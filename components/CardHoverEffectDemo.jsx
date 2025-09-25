import { HoverEffect } from "./ui/card-hover-effect";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

export const projects = [
  {
    title: "Kubernetes Cluster Management",
    description:
      "Automated Kubernetes cluster deployment and management using Terraform and Helm charts for scalable microservices architecture.",
    results: "Reduced deployment time by 50% and improved scalability.",
    githubLink: "https://github.com/sonbarse17/k8s-cluster-management",
    liveLink: "https://example.com/k8s-cluster-demo",
  },
  {
    title: "CI/CD Pipeline Automation",
    description:
      "End-to-end CI/CD pipeline using Jenkins, GitLab CI, and GitHub Actions with automated testing, security scanning, and deployment.",
    results: "Increased deployment frequency by 200% and reduced manual errors.",
    githubLink: "https://github.com/sonbarse17/cicd-pipeline-automation",
    liveLink: "https://example.com/cicd-pipeline-demo",
  },
  {
    title: "Infrastructure as Code",
    description:
      "Complete AWS infrastructure provisioning using Terraform with multi-environment support and automated backup strategies.",
    results: "Achieved 99.99% uptime and reduced infrastructure costs by 30%.",
    githubLink: "https://github.com/sonbarse17/infrastructure-as-code",
    liveLink: "https://example.com/iac-demo",
  },
  {
    title: "Docker Containerization",
    description:
      "Containerized applications with Docker, optimized images, and multi-stage builds for production-ready deployments.",
    results: "Improved application portability and reduced server costs by 25%.",
    githubLink: "https://github.com/sonbarse17/docker-containerization",
    liveLink: "https://example.com/docker-apps-demo",
  },
  {
    title: "Monitoring & Observability",
    description:
      "Comprehensive monitoring stack with Prometheus, Grafana, and ELK stack for real-time application and infrastructure monitoring.",
    results: "Reduced incident response time by 60% and improved system reliability.",
    githubLink: "https://github.com/sonbarse17/monitoring-observability",
    liveLink: "https://example.com/monitoring-demo",
  },
  {
    title: "Cloud Migration Project",
    description:
      "Large-scale cloud migration from on-premises to AWS with zero-downtime deployment and cost optimization strategies.",
    results: "Successfully migrated 50+ applications with zero downtime.",
    githubLink: "https://github.com/sonbarse17/cloud-migration-project",
    liveLink: "https://example.com/cloud-migration-demo",
  },
];