import React from 'react';
const certificates = [
  {
    title: "AWS Certified SysOps Administrator – Associate",
    organization: "Amazon Web Services",
    date: "March 2020",
    certificateUrl: "https://www.credly.com/badges/8c6885e9-9801-45b5-bd32-a00d24ec5f90/public_url",
  },
  {
    title: "Incident Management Certification",
    organization: "PagerDuty",
    date: "November 2021",
    certificateUrl: "https://www.credly.com/badges/7bafafe2-766c-4c97-9ed4-11334f5b0bc1/public_url",
  },
  {
    title: "Gremlin Certified Enterprise Chaos Engineering",
    organization: "Gremlin",
    date: "January 2025",
    certificateUrl: "https://certification.gremlin.com/credentials/b4baef2c-1042-453a-9bd1-10cac88a6269",
  },
  {
    title: "Red Hat Certified System Administrator",
    organization: "Red Hat",
    date: "November 2018",
    certificateUrl: "https://rhtapps.redhat.com/verify?certId=180-269-706",
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