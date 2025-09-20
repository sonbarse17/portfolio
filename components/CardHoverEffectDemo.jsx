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
    link: "https://github.com/your-username/k8s-cluster",
  },
  {
    title: "CI/CD Pipeline Automation",
    description:
      "End-to-end CI/CD pipeline using Jenkins, GitLab CI, and GitHub Actions with automated testing, security scanning, and deployment.",
    link: "https://github.com/your-username/cicd-pipeline",
  },
  {
    title: "Infrastructure as Code",
    description:
      "Complete AWS infrastructure provisioning using Terraform with multi-environment support and automated backup strategies.",
    link: "https://github.com/your-username/terraform-aws",
  },
  {
    title: "Docker Containerization",
    description:
      "Containerized applications with Docker, optimized images, and multi-stage builds for production-ready deployments.",
    link: "https://github.com/your-username/docker-apps",
  },
  {
    title: "Monitoring & Observability",
    description:
      "Comprehensive monitoring stack with Prometheus, Grafana, and ELK stack for real-time application and infrastructure monitoring.",
    link: "https://github.com/your-username/monitoring-stack",
  },
  {
    title: "Cloud Migration Project",
    description:
      "Large-scale cloud migration from on-premises to AWS with zero-downtime deployment and cost optimization strategies.",
    link: "https://github.com/your-username/cloud-migration",
  },
];