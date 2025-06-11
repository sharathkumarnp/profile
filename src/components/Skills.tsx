import React, { useRef } from "react";

const skills = [
  { name: "Kubernetes", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/kubernetes-96.png" },
  { name: "Docker", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/docker-96.png" },
  { name: "Terraform", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/terraform-96.png" },
  { name: "AWS", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/aws-96.png" },
  { name: "Azure", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/azure-96.png"},
  { name: "GCP", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/google-cloud-96.png"},
  { name: "BitBucket", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/BitBucket-96.png"},
  { name: "Jira", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Jira-96.png"},
  { name: "Windows", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/windows-96.png" },
  { name: "Linux", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/linux-96.png" },
  { name: "Splunk", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/logo-splunk-acc-rgb-w.png" },
  { name: "Grafana", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/grafana-96.png" },
  { name: "Slack", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/slack-96.png" },
  { name: "Gremlin", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Gremlin-Logo-Primary%402x.png" },
  { name: "Python", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/python-96.png" },
  { name: "Bash", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/bash-96.png" },
  { name: "NewRelic", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/new_relic-96.png" },
  { name: "GitHub", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/git-96.png" },
  { name: "Jenkins", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Jenkins.png" },
  { name: "Coralogix", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/Coralogix-green-horizontal.png"},
  { name: "Nginx", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/NGINX.png"},
  { name: "PagerDuty", image: "https://github-sharathkumar.s3.us-east-1.amazonaws.com/PagerDuty-96.png"}
];

export function Skills() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-10">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-2/3 h-32 -translate-x-1/2 bg-white/20 blur-xl rounded-full opacity-10" />
              <div className="absolute bottom-0 right-1/2 w-1/2 h-24 translate-x-1/2 bg-white/10 blur-2xl rounded-full opacity-10" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-12 text-white relative z-10">Technical Skills</h2>
            <div className="relative z-10">
              <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full p-2 z-20"
                  onClick={scrollLeft}
              >
                &#8249;
              </button>

              <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto space-x-6 scrollbar-hide px-10"
              >
                {skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col items-center justify-center w-32 shrink-0">
                      <img
                          src={skill.image}
                          alt={skill.name}
                          className="h-16 w-16 object-contain mb-2"
                      />
                      <p className="text-sm font-medium text-white">{skill.name}</p>
                    </div>
                ))}
              </div>

              <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full p-2 z-20"
                  onClick={scrollRight}
              >
                &#8250;
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}
