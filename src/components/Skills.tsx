import React, { useRef } from "react";

const skills = [
  { name: "Kubernetes", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/Kubernetes.png" },
  { name: "Docker", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/docker.jpg" },
  { name: "Terraform", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/terraform.png" },
  { name: "AWS", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/aws.png" },
  { name: "Linux/Unix", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/windows.png" },
  { name: "Windows", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/linux.jpg" },
  { name: "Splunk", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/splunk.jpg" },
  { name: "Grafana", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/grafana.png" },
  { name: "Datadog", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/Datadog_Logo.jpg" },
  { name: "Python", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/python.jpg" },
  { name: "Bash", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/bash.png" },
  { name: "PowerShell", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/powershell.png" },
  { name: "Git", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/git.jpg" },
  { name: "Jenkins", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/jenkins.png" },
  { name: "Incident.IO", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/incidentio.png"},
  { name: "Blameless", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/blameless.png"},
  { name: "PagerDuty", image: "https://dineshportofolio.s3.us-east-1.amazonaws.com/pagerduty.png"}
];

export function Skills() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll the container to the left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  // Scroll the container to the right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Technical Skills</h2>
        <div className="relative">
          {/* Left Arrow */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10"
            onClick={scrollLeft}
          >
            &#8249;
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 scrollbar-hide"
          >
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center w-32 shrink-0"
              >
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <p className="text-sm font-medium text-gray-600">{skill.name}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10"
            onClick={scrollRight}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
