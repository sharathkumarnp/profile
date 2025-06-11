import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Kubernetes Monitoring Stack",
    description: "Implemented a comprehensive monitoring solution using Prometheus, Grafana, and AlertManager for a large-scale Kubernetes cluster.",
    tags: ["Kubernetes", "Prometheus", "Grafana", "Go"],
    github: "#",
    demo: "#"
  },
  {
    title: "Infrastructure Automation Framework",
    description: "Developed a custom automation framework for infrastructure provisioning and configuration management using Terraform and Python.",
    tags: ["Terraform", "Python", "AWS", "Infrastructure as Code"],
    github: "#",
    demo: "#"
  },
  {
    title: "CI/CD Pipeline Optimization",
    description: "Redesigned and optimized CI/CD pipelines, reducing build times by 60% and implementing automated testing and deployment.",
    tags: ["Jenkins", "Docker", "GitLab", "Shell Scripting"],
    github: "#",
    demo: "#"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                  >
                    <Github className="h-5 w-5" />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}