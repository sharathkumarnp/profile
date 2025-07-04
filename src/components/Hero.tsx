// src/components/Hero.tsx
import React from 'react';

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 bg-black overflow-hidden">
            {/* Background Image */}
            <img
                src="https://github-sharathkumar.s3.us-east-1.amazonaws.com/pexels-pixabay-315938.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90 z-0" />

            {/* Glass Card with Shimmer */}
            <div className="relative z-10 max-w-4xl w-full p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <img
                    src="https://github-sharathkumar.s3.us-east-1.amazonaws.com/profile_image.jpg?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="Sharath Kumar"
                    className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/20 shadow-lg mb-6"
                />

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-transparent bg-clip-text animate-fade-in">
                    Sharath Kumar
                </h1>
                <p className="text-lg text-white/70 mt-4">Site Reliability Engineer</p>
                <p className="text-sm sm:text-base text-white/50 mt-2 max-w-2xl mx-auto">
                    Building resilient infrastructure with automation and cloud-native tooling. Obsessed with performance and reliability.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <a href="#projects" className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition">
                        View Projects
                    </a>
                    <a href="#contact" className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition">
                        Contact Me
                    </a>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-10 text-white/40 text-sm animate-bounce z-10">
                Scroll down ↓
            </div>
        </section>
    );
}
