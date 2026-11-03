/**
 * Skills grouped by engineering domain. `applied` links a tool to a project where I used it, and is the
 * only place a skill is tied to evidence. `also` lists tools I have worked with that are not linked to a
 * project on this site. There are deliberately no proficiency levels.
 */
export type Capability = {
  domain: string
  applied: { tool: string; project: string; note?: string }[]
  also: string[]
}

export const capabilities: Capability[] = [
  {
    domain: 'AWS',
    applied: [
      { tool: 'S3, CloudFront, Origin Access Control', project: 'aws-hosting-and-sso' },
      { tool: 'Elastic Beanstalk', project: 'aws-hosting-and-sso' },
      { tool: 'Cognito', project: 'aws-hosting-and-sso' },
      { tool: 'Route 53, ACM', project: 'aws-hosting-and-sso' },
      { tool: 'EKS', project: 'crm-on-eks' },
    ],
    also: [
      'EC2',
      'VPC',
      'RDS',
      'Elastic Load Balancing',
      'IAM',
      'CloudWatch',
      'Lambda',
      'Step Functions',
      'AWS Budgets',
    ],
  },
  {
    domain: 'Azure',
    applied: [
      { tool: 'Application Gateway (internal)', project: 'azure-internal-access' },
      { tool: 'App Service', project: 'azure-internal-access' },
      { tool: 'Front Door', project: 'azure-internal-access', note: 'the legacy entry point' },
      { tool: 'Microsoft Entra ID', project: 'azure-internal-access' },
      {
        tool: 'Private Endpoint',
        project: 'azure-internal-access',
        note: 'evaluated, not selected',
      },
    ],
    also: ['Private DNS', 'Key Vault', 'Azure Storage', 'Container Apps', 'Azure AI services'],
  },
  {
    domain: 'Google Cloud',
    applied: [{ tool: 'GKE', project: 'kubernetes-deployments' }],
    also: ['Cloud DNS', 'IAM', 'Quotas and cloud infrastructure'],
  },
  {
    domain: 'Containers and Kubernetes',
    applied: [
      { tool: 'Docker, Docker Compose', project: 'docker-microservices' },
      {
        tool: 'Kubernetes, StatefulSets, Ingress, Persistent Volumes',
        project: 'kubernetes-deployments',
      },
      { tool: 'Helm', project: 'prometheus-grafana' },
    ],
    also: ['Deployments', 'Services', 'HPA', 'Kustomize', 'Amazon EKS'],
  },
  {
    domain: 'Infrastructure as code',
    applied: [
      { tool: 'Terraform (GKE)', project: 'cicd-automation' },
      { tool: 'Terraform (AWS)', project: 'crm-on-eks' },
    ],
    also: [],
  },
  {
    domain: 'CI/CD',
    applied: [
      { tool: 'GitHub Actions, Docker Buildx', project: 'cicd-automation' },
      { tool: 'Jenkins', project: 'cicd-automation' },
      { tool: 'SonarCloud, OWASP Dependency-Check', project: 'cicd-automation' },
    ],
    also: ['GitLab CI'],
  },
  {
    domain: 'Observability',
    applied: [{ tool: 'Prometheus, Grafana, ServiceMonitor', project: 'prometheus-grafana' }],
    also: ['CloudWatch'],
  },
  {
    domain: 'Security and identity',
    applied: [
      { tool: 'Microsoft Entra ID, SSO', project: 'azure-internal-access' },
      { tool: 'SAML 2.0, Cognito', project: 'aws-hosting-and-sso' },
      { tool: 'SSL/TLS, ACM', project: 'aws-hosting-and-sso' },
    ],
    also: ['AWS IAM', 'Azure Key Vault'],
  },
  {
    domain: 'Languages and applications',
    applied: [
      { tool: 'TypeScript, Next.js', project: 'web-applications' },
      { tool: 'React, Node.js', project: 'docker-microservices' },
      { tool: 'Ruby on Rails', project: 'kubernetes-deployments' },
      { tool: 'Java, Tomcat', project: 'kubernetes-deployments' },
    ],
    also: ['Python', 'JavaScript', 'Bash', 'Express', 'Flask'],
  },
  {
    domain: 'Databases',
    applied: [
      { tool: 'PostgreSQL', project: 'kubernetes-deployments' },
      { tool: 'MariaDB (MySQL)', project: 'kubernetes-deployments' },
      { tool: 'MongoDB', project: 'docker-microservices' },
    ],
    also: [],
  },
]
