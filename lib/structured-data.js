export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sushant Sonbarse",
  "alternateName": ["Sushant", "Sonbarse"],
  "jobTitle": "DevOps Engineer",
  "description": "Professional DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines.",
  "url": "https://sushantsonbarse.com",
  "image": "https://sushantsonbarse.com/assets/images/profile.jpg",
  "email": "sushant.sonbarse@example.com",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance DevOps Consultant"
  },
  "sameAs": [
    "https://github.com/sonbarse17",
    "https://linkedin.com/in/sushant-sonbarse"
  ],
  "knowsAbout": [
    "DevOps", "Cloud Computing", "Kubernetes", "Docker", "AWS", "Google Cloud", "Azure", 
    "Terraform", "Jenkins", "CI/CD", "Infrastructure as Code", "Site Reliability Engineering",
    "Ansible", "Prometheus", "Grafana", "Linux", "GitLab"
  ]
};

export const projectSchema = (project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": project.title,
  "description": project.description,
  "author": {
    "@type": "Person",
    "name": "Sushant Sonbarse"
  },
  "dateCreated": "2024",
  "keywords": project.keywords || ["DevOps", "Cloud", "Infrastructure"],
  "url": project.liveLink,
  "codeRepository": project.githubLink
});