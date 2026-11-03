import type { Project } from './types'

/** Facts come from the HisanLabs entry in the original portfolio. Nothing is added to them. */
export const crmOnEks: Project = {
  slug: 'crm-on-eks',
  title: 'CRM on AWS EKS at HisanLabs',
  summary:
    'Deployed a CRM comprising more than 35 microservices to AWS EKS during a DevOps internship, with AWS infrastructure automated through Terraform.',
  classification: 'professional',
  category: 'Kubernetes deployment, infrastructure as code, CI/CD',
  context: 'HisanLabs Pvt Ltd, DevOps Engineer Intern, Sep 2024 to May 2025',
  labels: ['Internship'],
  tier: 'overview',
  lab: 'cluster',
  glance: [
    { label: 'Scope', value: 'A CRM of 35+ microservices' },
    { label: 'Platform', value: 'AWS EKS' },
    { label: 'Automation', value: 'AWS infrastructure in Terraform' },
    { label: 'Role', value: 'DevOps Engineer Intern, 9 months' },
  ],
  stackGroups: [
    { group: 'Application', items: ['Angular', 'Spring Boot'] },
    { group: 'Platform and automation', items: ['AWS EKS', 'Terraform'] },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'record',
      body: 'During my DevOps internship at HisanLabs, I deployed a CRM comprising more than 35 microservices to AWS EKS. The solution included an Angular frontend, Spring Boot services, and AWS infrastructure that I automated with Terraform.',
    },
    {
      id: 'outcome',
      provenance: 'record',
      body: 'The recorded results from this engagement:',
      points: [
        '35+ microservices deployed',
        'AWS infrastructure automated with Terraform',
        'CI/CD pipeline efficiency improved by 40%',
        'Deployment time reduced from 2 hours to 30 minutes',
      ],
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'No architecture diagram is published for this project. It is shown as an overview with recorded facts only.',
    },
  ],
}
