import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Certificates } from './components/Certificates';
import { Experience } from "./components/Experience";

function App() {
    // Remove darkMode state and button
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main>
                <Hero />
                <Skills />
                <Certificates />
                <Experience />
                <Projects />
                <Contact />
            </main>
            <footer className="bg-gray-900 text-white py-6">
                <div className="container mx-auto px-6 text-center">
                    <p>© {new Date().getFullYear()} - Built with React & Tailwind CSS</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
