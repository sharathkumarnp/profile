import React from 'react';
const certificates = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    organization: "Amazon Web Services",
    date: "August 2024",
    certificateUrl: "https://www.credly.com/badges/f0ce6814-93cf-40a3-9e89-8992cab63cef/public_url",
  },
  {
    title: "Microsoft Certified: Azure Fundamentals",
    organization: "Microsoft",
    date: "June 2023",
    certificateUrl: "https://www.credly.com/badges/2f06212f-bb8c-4017-b9e5-1a8286b0e84b/public_url",
  },
  {
    title: "Microsoft Certified: Azure Developer Associate",
    organization: "Microsoft",
    date: "June 2023",
    certificateUrl: "https://www.credly.com/badges/fed72620-7fd2-4798-9171-c721b25a8fe1/public_url",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    organization: "Amazon Web Services",
    date: "Oct 2022",
    certificateUrl: "https://www.credly.com/badges/fbf3a24a-0851-41dc-a1aa-0c06aa8d3ece/public_url",
  }
];
export function Certificates() {
    return (
      <section id="certificates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
          <div className="flex overflow-x-auto space-x-6 scrollbar-hide">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 border rounded-lg p-6 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                <p className="text-gray-600 mb-2">{cert.organization}</p>
                <p className="text-gray-500 text-sm mb-4">{cert.date}</p>
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  View Certificate
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }