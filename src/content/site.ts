export const site = {
  name: 'Sushant Sonbarse',
  role: 'Cloud & DevOps Engineer',
  url: 'https://sushantsonbarse.in',
  github: 'https://github.com/sonbarse17',
  linkedin: 'https://linkedin.com/in/sushant-sonbarse',
  description:
    'Cloud and DevOps engineer. Case studies in Azure internal access, AWS hosting and enterprise SSO, plus interactive infrastructure labs for failure, release, scheduling and identity.',
}

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/lab', label: 'Lab' },
  { href: '/atlas', label: 'Atlas' },
  { href: '/freelance', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
]

export const roles = [
  {
    title: 'Freelance DevOps Consultant',
    org: 'Self-employed',
    where: 'Remote',
    when: '2025 to present',
    current: true,
    points: [
      'CI/CD pipeline setup and optimization',
      'Cloud infrastructure design and management',
      'Kubernetes consulting and implementation',
    ],
    stack: ['AWS', 'Azure', 'GCP'],
  },
  {
    title: 'DevOps Engineer Intern',
    org: 'HisanLabs Pvt Ltd',
    where: 'Pune, Maharashtra',
    when: 'Sep 2024 to May 2025, 9 months',
    current: false,
    points: [
      'Deployed a CRM with 35+ microservices',
      'Automated AWS infrastructure with Terraform',
    ],
    stack: ['Angular', 'Spring Boot', 'AWS EKS', 'Terraform'],
  },
]

export const background = [
  {
    kind: 'Training',
    title: 'Cloud DevOps Engineering Course',
    org: 'CloudBlitz CDEC',
    when: 'Aug 2024 to May 2025',
  },
  {
    kind: 'Education',
    title: 'B.Sc. Computer Science',
    org: 'Rashtrasant Tukdoji Maharaj Nagpur University',
    when: '2020 to 2023',
  },
]

/** Figures from the HisanLabs role, carried over from the original portfolio. No others are published. */
export const figures = [
  { value: '35+', label: 'microservices in the CRM deployed' },
  { value: '2h → 30m', label: 'deployment time' },
  { value: '40%', label: 'CI/CD pipeline efficiency gain' },
]
