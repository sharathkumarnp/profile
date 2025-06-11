
import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

export function Contact() {
  return (
      <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 text-center shadow-xl">
            {/* Light reflections */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-2/3 h-24 -translate-x-1/2 bg-white/20 blur-xl opacity-10 rounded-full" />
              <div className="absolute bottom-0 right-1/2 w-1/2 h-20 translate-x-1/2 bg-white/10 blur-2xl opacity-10 rounded-full" />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-white relative z-10">Let's Connect</h2>
            <p className="mb-8 text-gray-300 relative z-10">
              I'm currently open to new opportunities in Site Reliability Engineering. Feel free to reach out if you'd like to
              discuss, or just want to connect!
            </p>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <a
                  href="mailto:sharathkumarnp@gmail.com"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-md"
              >
                <Mail className="h-5 w-5" />
                Email Me
              </a>
              <a
                  href="https://linkedin.com/in/sharathkumarnp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-md"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
              <a
                  href="https://github.com/sharathkumarnp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-md"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
  );
}
