import React from "react";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Eclipse24",
    description:
        "Automated server decomissioning utility tool built in kafka to clean-up the servers which are unused and non-active",
    tags: ["Slack", "Python", "Kafka", "Atlassian", "API", "Postgres"],
    code: "https://github.com/sharathkumarnp/Eclipse24",
    demo: "https://github.com/sharathkumarnp/Eclipse24",
  },
  {
    title: "OpsGenie Stackstorm Integration",
    description:
        "Integrated OpsGenie with Stackstorm to automate incident response workflows, enhancing incident management efficiency and reducing response times.",
    tags: ["OpsGenie", "Stackstorm", "Python"],
    code: "#",
    demo: "#",
  },
  {
    title: "Coralogix Metrics Scraper CI/CD Pipeline",
    description:
        "Developed a CI/CD pipeline to automate the deployment of a metrics scraper for Coralogix, ensuring continuous integration and delivery of monitoring solutions. Building new docker images upon every commit and pushing them to the artifactory edge.",
    tags: ["Jenkins", "Docker", "CI/CD", "Python"],
    code: "#",
    demo: "#",
  },
  {
    title: "JSK Sales Web Application",
    description:
        "Developed a full-stack web application for JSK Sales using React for the frontend and Node.js for the backend, enabling efficient sales management and customer tracking.",
    tags: ["React", "Node.js", "Firebase", "Vercel"],
    code: "https://github.com/sharathkumarnp/jsk-sales-app",
    demo: "https://jsk-sales-app.vercel.app/",
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
