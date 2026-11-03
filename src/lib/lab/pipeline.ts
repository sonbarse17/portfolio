export type Strategy = 'rolling' | 'canary' | 'blue-green'
export type PresetId = 'service' | 'gitops' | 'model'
export type StageStatus = 'passed' | 'failed' | 'skipped' | 'rolled-back'

export type Stage = { id: string; label: string; does: string; production?: boolean }
export type Fault = { id: string; label: string; stage: string; result: string }

export type Preset = { id: PresetId; label: string; stages: Stage[]; faults: Fault[] }

const badRelease = (stage: string): Fault => ({
  id: 'bad-release',
  label: 'Passes every test, fails under production traffic',
  stage,
  result: 'Error rate breaches the SLO during rollout. Automated analysis reverts it.',
})

export const presets: Preset[] = [
  {
    id: 'service',
    label: 'Service release',
    stages: [
      { id: 'test', label: 'Lint + unit', does: 'Fast feedback, before any image exists.' },
      {
        id: 'build',
        label: 'Build image',
        does: 'Multi-stage Docker build, tagged with the commit SHA.',
      },
      {
        id: 'scan',
        label: 'Scan',
        does: 'Dependency and image scanning. Fixable criticals block the merge.',
      },
      {
        id: 'staging',
        label: 'Staging',
        does: 'Deploys the exact image digest that production will get.',
      },
      { id: 'e2e', label: 'Integration', does: 'Tests the real dependencies and contracts.' },
      {
        id: 'prod',
        label: 'Production',
        does: 'Progressive rollout using the chosen strategy.',
        production: true,
      },
      {
        id: 'verify',
        label: 'Verify SLO',
        does: 'Compares error rate and latency with the previous release.',
        production: true,
      },
    ],
    faults: [
      {
        id: 'unit',
        label: 'Failing unit test',
        stage: 'test',
        result: 'Stopped in minutes. Nothing was built.',
      },
      {
        id: 'cve',
        label: 'Critical CVE in a base image',
        stage: 'scan',
        result: 'Image never reaches a registry that clusters can pull from.',
      },
      {
        id: 'contract',
        label: 'Breaking API contract',
        stage: 'e2e',
        result: 'Caught in staging, where the blast radius is the team.',
      },
      badRelease('verify'),
    ],
  },
  {
    id: 'gitops',
    label: 'GitOps delivery',
    stages: [
      { id: 'ci', label: 'CI', does: 'Tests, builds and scans. CI holds no cluster credentials.' },
      { id: 'pr', label: 'Manifest PR', does: 'Bumps the image digest in the environment repo.' },
      { id: 'review', label: 'Review', does: 'Policy checks and approval on the rendered diff.' },
      {
        id: 'sync',
        label: 'Argo CD sync',
        does: 'The cluster pulls the desired state from Git.',
        production: true,
      },
      {
        id: 'verify',
        label: 'Verify SLO',
        does: 'Rollout analysis. Reverting is a git revert.',
        production: true,
      },
    ],
    faults: [
      {
        id: 'policy',
        label: 'Manifest violates admission policy',
        stage: 'review',
        result: 'Rejected on the diff. The cluster never sees it.',
      },
      {
        id: 'drift',
        label: 'Sync fails on invalid manifest',
        stage: 'sync',
        result: 'Argo CD reports the app degraded and keeps the last healthy revision running.',
      },
      badRelease('verify'),
    ],
  },
  {
    id: 'model',
    label: 'Model release',
    stages: [
      {
        id: 'data',
        label: 'Validate data',
        does: 'Schema and distribution checks on the training set.',
      },
      { id: 'train', label: 'Train', does: 'Reproducible run: pinned data, code and parameters.' },
      { id: 'eval', label: 'Evaluate', does: 'Must beat the current model on a held-out set.' },
      { id: 'registry', label: 'Register', does: 'Versioned artifact with its lineage attached.' },
      {
        id: 'shadow',
        label: 'Shadow',
        does: 'Receives real requests; its answers are discarded and compared.',
      },
      {
        id: 'prod',
        label: 'Serve',
        does: 'Progressive rollout on GPU-aware serving.',
        production: true,
      },
      {
        id: 'verify',
        label: 'Watch',
        does: 'Latency, cost per request and prediction drift.',
        production: true,
      },
    ],
    faults: [
      {
        id: 'skew',
        label: 'Training data drifted',
        stage: 'data',
        result: 'Training never starts, saving the GPU time.',
      },
      {
        id: 'worse',
        label: 'Model worse than baseline',
        stage: 'eval',
        result: 'Not registered. The current model keeps serving.',
      },
      {
        id: 'latency',
        label: 'Too slow on real inputs',
        stage: 'shadow',
        result: 'Found in shadow with zero users affected.',
      },
      badRelease('verify'),
    ],
  },
]

/** Modelling assumptions, shown to the visitor beside the result. */
export const strategies: Record<Strategy, { label: string; exposure: number; note: string }> = {
  rolling: {
    label: 'Rolling',
    exposure: 25,
    note: 'First batch of 25% is replaced before analysis trips. Rollback means rolling again.',
  },
  canary: {
    label: 'Canary',
    exposure: 5,
    note: 'First step sends 5% of traffic. Rollback is shifting that weight back.',
  },
  'blue-green': {
    label: 'Blue-green',
    exposure: 100,
    note: 'All traffic cuts over at once, but the old stack is still warm so reverting is near-instant. Double capacity while both run.',
  },
}

export type Step = { stage: Stage; status: StageStatus; note: string }
export type Outcome = { shipped: boolean; exposure: number; summary: string }

export function simulate(
  presetId: PresetId,
  strategy: Strategy,
  activeFaults: ReadonlySet<string>
): { steps: Step[]; outcome: Outcome } {
  const preset = presets.find((p) => p.id === presetId)!
  // The earliest fault in stage order is the one that fires.
  const fault = preset.stages
    .map((stage) => preset.faults.find((f) => f.stage === stage.id && activeFaults.has(f.id)))
    .find(Boolean)

  if (!fault) {
    return {
      steps: preset.stages.map((stage) => ({ stage, status: 'passed', note: stage.does })),
      outcome: { shipped: true, exposure: 0, summary: 'Release shipped. No user saw a bad build.' },
    }
  }

  const failedAt = preset.stages.findIndex((s) => s.id === fault.stage)
  const rollback = preset.stages[failedAt].production === true && fault.id === 'bad-release'

  const steps = preset.stages.map((stage, i): Step => {
    if (i < failedAt) {
      const undone = rollback && stage.production
      return {
        stage,
        status: undone ? 'rolled-back' : 'passed',
        note: undone ? `Reverted. ${strategies[strategy].note}` : stage.does,
      }
    }
    if (i === failedAt) return { stage, status: 'failed', note: fault.result }
    return { stage, status: 'skipped', note: 'Not run: an earlier gate stopped the release.' }
  })

  return {
    steps,
    outcome: {
      shipped: false,
      exposure: rollback ? strategies[strategy].exposure : 0,
      summary: fault.result,
    },
  }
}

export const definitions: { id: string; label: string; code: string }[] = [
  {
    id: 'github',
    label: 'GitHub Actions',
    code: `jobs:
  build:
    runs-on: ubuntu-latest
    permissions: { id-token: write, contents: read }
    steps:
      - uses: actions/checkout@v4
      - run: make test
      - run: docker build -t $IMAGE:$GITHUB_SHA .
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          image-ref: \${{ env.IMAGE }}:\${{ github.sha }}
          severity: CRITICAL
          ignore-unfixed: true
          exit-code: 1
  deploy:
    needs: build
    environment: production   # required reviewers live here
    steps:
      - run: helm upgrade app ./chart --set image.tag=$GITHUB_SHA --atomic`,
  },
  {
    id: 'gitlab',
    label: 'GitLab CI/CD',
    code: `stages: [test, build, scan, deploy]

test:
  stage: test
  script: make test

build:
  stage: build
  script: docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .

scan:
  stage: scan
  script: trivy image --severity CRITICAL --ignore-unfixed --exit-code 1 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  environment: production
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
  script: helm upgrade app ./chart --set image.tag=$CI_COMMIT_SHA --atomic`,
  },
  {
    id: 'jenkins',
    label: 'Jenkins',
    code: `pipeline {
  agent { kubernetes { yamlFile 'ci/agent.yaml' } }
  environment { TAG = "\${env.GIT_COMMIT}" }
  stages {
    stage('Test')  { steps { sh 'make test' } }
    stage('Build') { steps { sh 'docker build -t $IMAGE:$TAG .' } }
    stage('Scan')  {
      steps { sh 'trivy image --severity CRITICAL --ignore-unfixed --exit-code 1 $IMAGE:$TAG' }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps {
        input message: 'Promote to production?'
        sh 'helm upgrade app ./chart --set image.tag=$TAG --atomic'
      }
    }
  }
}`,
  },
]
