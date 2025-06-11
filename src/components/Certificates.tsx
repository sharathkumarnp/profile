import React from "react";

const certificates = [
  {
    title: "AWS Certified SysOps Administrator – Associate",
    organization: "Amazon Web Services",
    date: "March 2020",
    certificateUrl: "https://www.credly.com/badges/8c6885e9-9801-45b5-bd32-a00d24ec5f90/public_url"
  },
  {
    title: "Incident Management Certification",
    organization: "PagerDuty",
    date: "November 2021",
    certificateUrl: "https://www.credly.com/badges/7bafafe2-766c-4c97-9ed4-11334f5b0bc1/public_url"
  },
  {
    title: "Gremlin Certified Enterprise Chaos Engineering",
    organization: "Gremlin",
    date: "January 2025",
    certificateUrl: "https://certification.gremlin.com/credentials/b4baef2c-1042-453a-9bd1-10cac88a6269"
  },
  {
    title: "Red Hat Certified System Administrator",
    organization: "Red Hat",
    date: "November 2018",
    certificateUrl: "https://rhtapps.redhat.com/verify?certId=180-269-706"
  }
];

export function Certificates() {
  return (
      <section id="certificates" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-10">

            {/* light reflection gradient */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-2/3 h-32 -translate-x-1/2 bg-white/20 blur-xl rounded-full opacity-10" />
              <div className="absolute bottom-0 right-1/2 w-1/2 h-24 translate-x-1/2 bg-white/10 blur-2xl rounded-full opacity-10" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-10 text-white relative z-10">
              Certificates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center relative z-10">
              {certificates.map((cert, index) => (
                  <div
                      key={index}
                      className="w-full max-w-sm bg-white/30 dark:bg-gray-800/30 border border-white/20 backdrop-blur-md rounded-lg p-6 shadow hover:shadow-lg transition text-white"
                  >
                    <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                    <p className="text-gray-300 mb-2">{cert.organization}</p>
                    <p className="text-gray-400 text-sm mb-4">{cert.date}</p>
                    <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                    >
                      View Certificate
                    </a>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
