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
      "title": "CloudFront analysis",
      "description": "Implemented a comprehensive analysis of CloudFront logs to optimize content delivery and improve performance metrics.",
      "technologies": ["AWS", "Athena", "S3"]
      }
    ]
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Professional Experience</h2>
        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{experience.role} at {experience.company}</h3>
              <p className="text-sm text-gray-500">{experience.duration}</p>
              <p className="text-lg text-gray-700 mt-2">{experience.description}</p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Key Projects</h4>
                <div className="space-y-4">
                  {experience.projects.map((project, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <h5 className="text-md font-semibold">{project.title}</h5>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="mt-2 text-xs text-gray-500">Technologies: {project.technologies.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
