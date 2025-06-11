import React from "react";
import { Mail, Github, Linkedin, Terminal } from "lucide-react";

export function Header() {
  return (
      <header className="fixed top-0 left-0 right-0 z-50 mt-4 px-4">
        <nav className="relative mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-lg">
          {/* Light reflection gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-2/3 h-20 -translate-x-1/2 bg-white/20 blur-2xl opacity-10 rounded-full"></div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-white font-bold text-lg">
            <Terminal className="h-5 w-5 text-indigo-400" />
            Sharath Kumar
          </div>

          <ul className="relative z-10 hidden md:flex space-x-6 text-white font-medium">
            <li><a href="#about" className="hover:text-indigo-400 transition">About</a></li>
            <li><a href="#experience" className="hover:text-indigo-400 transition">Experience</a></li>
            <li><a href="#skills" className="hover:text-indigo-400 transition">Skills</a></li>
            <li><a href="#certificates" className="hover:text-indigo-400 transition">Certificates</a></li>
            <li><a href="#projects" className="hover:text-indigo-400 transition">Projects</a></li>
          </ul>

          <div className="relative z-10 flex items-center gap-4 text-white">
            <a href="https://github.com/sharathkumarnp" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 hover:text-indigo-400 transition" />
            </a>
            <a href="https://linkedin.com/in/sharathkumarnp" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 hover:text-indigo-400 transition" />
            </a>
            <a href="#contact">
              <Mail className="h-5 w-5 hover:text-indigo-400 transition" />
            </a>
          </div>
        </nav>
      </header>
  );
}
