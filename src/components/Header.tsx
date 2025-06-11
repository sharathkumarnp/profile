import React from 'react';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">Sharath Kumar</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#experience" className="hover:text-indigo-600 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-indigo-600 transition-colors">Skills</a>
            <a href="#certificates" className="hover:text-indigo-600 transition-colors">Certificates</a>
            <a href="#projects" className="hover:text-indigo-600 transition-colors">Projects</a>
            <div className="flex items-center space-x-4 ml-6">
              <a href="https://github.com/sharathkumarnp" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/sharathkumarnp/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:sharathkumarsr97@gmail.com" className="hover:text-indigo-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
