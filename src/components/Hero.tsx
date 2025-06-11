
import React from "react";
import { Mail, Github, Linkedin, Terminal } from "lucide-react";

export function Hero() {
  return (
      <section
          style={{
            backgroundImage: "url('https://github-sharathkumar.s3.us-east-1.amazonaws.com/pexels-pixabay-315938.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
          className="pt-32 pb-20 bg-gradient-to-b from-gray-900 to-gray-800 relative"
      >
        {/* Optional overlay for contrast */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <img
              src="https://github-sharathkumar.s3.us-east-1.amazonaws.com/profile_image.jpg?auto=format&fit=crop&q=80&w=200&h=200"
              alt="Sharath Kumar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-white">Sharath Kumar</h1>
          <p className="text-xl font-mono font-bold text-yellow-400">Site Reliability Engineer</p>
          <p className="mt-4 max-w-2xl text-gray-200 mx-auto">
            Passionate about building scalable and reliable systems. Experienced in cloud-native technologies,
            infrastructure automation, and DevOps practices.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-gray-200">
          <span className="flex items-center gap-2">
            <CloudIcon /> Cloud Native
          </span>
            <span className="flex items-center gap-2">
            <ServerIcon /> Infrastructure
          </span>
            <span className="flex items-center gap-2">
            <ZapIcon /> DevOps
          </span>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <a
                href="#contact"
                className="px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Contact Me
            </a>
            <a
                href="#projects"
                className="px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>
  );
}

function CloudIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 15a4 4 0 0 1 4-4h1a3 3 0 1 1 6 0h1a4 4 0 0 1 0 8H7a4 4 0 0 1-4-4z" /></svg>;
}

function ServerIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z" /></svg>;
}

function ZapIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9z" /></svg>;
}
