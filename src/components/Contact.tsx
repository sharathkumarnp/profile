import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-indigo-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
          <p className="text-gray-600 mb-8">
            I'm currently open to new opportunities in Site Reliability Engineering.
            Feel free to reach out if you'd like to discuss, or just want to connect!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:sharathkumarsr97@gmail.com"
              className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Mail className="h-5 w-5 text-indigo-600" />
              <span>Email Me</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sharathkumarnp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Linkedin className="h-5 w-5 text-indigo-600" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/sharathkumarnp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Github className="h-5 w-5 text-indigo-600" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}