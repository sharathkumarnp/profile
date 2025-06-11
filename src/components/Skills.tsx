import React, { useRef } from "react";

const skills = [
  { name: "Kubernetes", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/kubernetes-96.png" },
  { name: "Docker", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/docker-96.png" },
  { name: "Terraform", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/terraform-96.png" },
  { name: "AWS", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/aws.png" },
  { name: "Azure", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/azure-96.png"},
  { name: "GCP", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/google-cloud-96.png"},
  { name: "BitBucket", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/BitBucket-96.png"},
  { name: "Jira", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Jira-96.png"},
  { name: "Windows", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/windows-96.png" },
  { name: "Linux", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/linux-96.png" },
  { name: "Splunk", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/splunk-96.png" },
  { name: "Grafana", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/grafana-96.png" },
  { name: "Slack", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/slack-96.png" },
  { name: "Python", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/python-96.png" },
  { name: "Bash", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/bash-96.png" },
  { name: "NewRelic", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/new_relic-96.png" },
  { name: "Git", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/git-96.png" },
  { name: "Jenkins", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Jenkins.png" },
  { name: "Coralogix", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Coralogix-green-horizontal.png"},
  { name: "Nginx", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/NGINX.png"},
  { name: "PagerDuty", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/PagerDuty-96.png"}

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
