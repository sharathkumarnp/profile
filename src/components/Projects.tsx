import React from "react";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Kubernetes Monitoring Stack",
    description:
        "Implemented a comprehensive monitoring solution using Prometheus, Grafana, and AlertManager for a large-scale Kubernetes cluster.",
    tags: ["Kubernetes", "Prometheus", "Grafana", "Go"],
    code: "#",
    demo: "#",
  },
  {
    title: "Infrastructure Automation Framework",
    description:
        "Developed a custom automation framework for infrastructure provisioning and configuration management using Terraform and Python.",
    tags: ["Terraform", "Python", "AWS", "Infrastructure as Code"],
    code: "#",
    demo: "#",
  },
  {
    title: "CI/CD Pipeline Optimization",
    description:
        "Redesigned and optimized CI/CD pipelines, reducing build times by 60% and implementing automated testing and deployment.",
    tags: ["Jenkins", "Docker", "GitLab", "Shell Scripting"],
    code: "#",
    demo: "#",
  },
];

export function Projects() {
  return (
      <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg p-6 overflow-hidden"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-2/3 h-24 -translate-x-1/2 bg-white/20 blur-xl opacity-10 rounded-full" />
                    <div className="absolute bottom-0 right-1/2 w-1/2 h-20 translate-x-1/2 bg-white/10 blur-2xl opacity-10 rounded-full" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white relative z-10">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 relative z-10">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm"
                        >
                    {tag}
                  </span>
                    ))}
                  </div>

                  <div className="flex gap-6 text-white text-sm items-center relative z-10">
                    <a href={project.code} className="flex items-center gap-1 hover:text-indigo-400 transition">
                      <Github className="h-4 w-4" /> Code
                    </a>
                    <a href={project.demo} className="flex items-center gap-1 hover:text-indigo-400 transition">
                      <ExternalLink className="h-4 w-4" /> Demo
                    </a>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
