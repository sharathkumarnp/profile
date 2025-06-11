import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Certificates } from './components/Certificates';
import { Experience } from "./components/Experience";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded"
            >
                Toggle Dark Mode
            </button>
            <main>
                <Hero />
                <Skills />
                <Certificates />
                <Experience />
                <Projects />
                <Contact />
            </main>
            <footer className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} py-6`}>
                <div className="container mx-auto px-6 text-center">
                    <p>© {new Date().getFullYear()} - Built with React & Tailwind CSS</p>
                </div>
            </footer>
        </div>
    );
}

export default App;