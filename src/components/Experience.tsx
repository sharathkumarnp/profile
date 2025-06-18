import React from 'react';

const experiences = [
  {
    company: "JFrog India Pvt Ltd",
    role: "Site Reliability Engineer",
    duration: "Jul 2021 - Present",
    description: "Responsible for maintaining and improving the reliability, availability, and performance of JFrog's cloud services. Developed automation scripts and tools to enhance operational efficiency and reduce downtime.",
    projects: [
      {
        title: "Resource Monitor Automation",
        description: "Developed an automated resource monitoring solution using Azure Function Apps, significantly reducing manual monitoring efforts and improving system reliability.",
        technologies: ["Azure", "Python", "Function Apps", "Azure Monitor"]
      },
      {
        title: "OpsGenie Stackstorm Integration",
        description: "Integrated OpsGenie with Stackstorm to automate incident response workflows, enhancing incident management efficiency and reducing response times.",
        technologies: ["OpsGenie", "Stackstorm", "Kubernetes", "Python"]
      }
    ]
  },
  {
    company: "axcess.io",
    role: "Cloud Engineer",
    duration: "March 2019 - Jul 2021",
    description: "Developed and maintained cloud infrastructure solutions, focusing on high availability and disaster recovery strategies. Collaborated with development teams to ensure seamless integration of cloud services.",
    projects: [
      {
        title: "CloudFront analysis",
        description: "Implemented a comprehensive analysis of CloudFront logs to optimize content delivery and improve performance metrics.",
        technologies: ["AWS", "Athena", "S3"]
      }
    ]
  },
  {
    company: "Zynux",
    role: "Linux System Administrator",
    duration: "Jun 208 - Dec 2018",
    description: "Managed Linux-based systems and provided support for various applications. Focused on system performance tuning, security hardening, and user management.",
    projects: [
      {
        title: "Patch Management",
        description: "Implemented a robust patch management system to ensure all Linux servers were up-to-date with the latest security patches and updates, enhancing overall system security.",
        technologies: ["Linux Red Hat7", "Bash"]
      }
    ]
  }
];

export function Experience() {
  return (
      <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-10 text-white">

            {/* Reflective gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-2/3 h-32 -translate-x-1/2 bg-white/20 blur-xl rounded-full opacity-10" />
              <div className="absolute bottom-0 right-1/2 w-1/2 h-24 translate-x-1/2 bg-white/10 blur-2xl rounded-full opacity-10" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-12 relative z-10 text-white">Professional Experience</h2>

            <div className="space-y-12 relative z-10">
              {experiences.map((experience, index) => (
                  <div key={index} className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-md transition">
                    <h3 className="text-xl font-semibold">{experience.role} at {experience.company}</h3>
                    <p className="text-sm text-gray-300">{experience.duration}</p>
                    <p className="text-md text-gray-200 mt-2">{experience.description}</p>
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">Key Projects</h4>
                      <div className="space-y-4">
                        {experience.projects.map((project, index) => (
                            <div key={index} className="bg-white/20 dark:bg-white/10 backdrop-blur-sm p-4 rounded-lg transition">
                              <h5 className="text-md font-semibold">{project.title}</h5>
                              <p className="text-sm text-gray-300">{project.description}</p>
                              <p className="mt-2 text-xs text-gray-400">Technologies: {project.technologies.join(', ')}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
              ))}
            </div>

          </div>
        </div>
      </section>
  );
}
