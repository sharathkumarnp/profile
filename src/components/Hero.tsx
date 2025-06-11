import React from 'react';
import { Terminal, Cloud, Database, GitBranch } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background Image (Doodle) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage: 'url(https://dineshportofolio.s3.us-east-1.amazonaws.com/sre_tools.webp)', 
        }}
      ></div>
      
      {/* Content Section */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image and Info */}
          <div className="relative mb-8">
            <img
              src="https://dineshportofolio.s3.us-east-1.amazonaws.com/profile.jpg?auto=format&fit=crop&q=80&w=200&h=200"
              alt="Dinesh Kumar A"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Dinesh Kumar A</h1>
          <h2 className="text-2xl text-indigo-600 mb-4">Site Reliability Engineer - 2</h2>
          <p className="text-xl text-gray-900 mb-8 max-w-2xl">
            Experienced SRE with 3+ years of expertise in building and maintaining scalable, reliable, 
            and efficient infrastructure. Passionate about automation, monitoring, and incident response.
          </p>

          {/* Skills Section */}
          <div className="flex items-center space-x-6 mb-12">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-indigo-600" />
              <span>Cloud Native</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <span>Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-indigo-600" />
              <span>DevOps</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex space-x-4">
            <a
              href="#contact"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
