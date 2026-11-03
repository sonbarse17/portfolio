import { cloudArchitectureProject } from './cloud-architecture-project'
import { azureInternalAccess } from './azure-internal-access'
import { cicdAutomation } from './cicd-automation'
import { crmOnEks } from './crm-on-eks'
import { dockerMicroservices } from './docker-microservices'
import { kubernetesDeployments } from './kubernetes-deployments'
import { prometheusGrafana } from './prometheus-grafana'
import { awsHostingAndSso } from './aws-hosting-and-sso'
import { webApplications } from './web-applications'
import type { Project } from './types'

export * from './types'

/** Order is the order shown. Professional work comes first and is always labelled as such. */
export const projects: Project[] = [
  azureInternalAccess,
  awsHostingAndSso,
  cloudArchitectureProject,
  crmOnEks,
  kubernetesDeployments,
  dockerMicroservices,
  prometheusGrafana,
  cicdAutomation,
  webApplications,
]

export const professional = projects.filter((p) => p.classification === 'professional')
export const personal = projects.filter((p) => p.classification === 'personal')

/** Pages that existed before this rewrite, mapped to where they live now. Used for host redirects. */
export const retiredRoutes: Record<string, string> = {
  '/work/kubernetes-platform': '/work/kubernetes-deployments',
  '/work/infrastructure-as-code': '/work/cicd-automation',
  '/work/observability-stack': '/work/prometheus-grafana',
  '/work/cloud-migration': '/work',
}
