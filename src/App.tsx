import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <div className="min-h-screen bg-tech-bg text-slate-200">
      <Navigation />
      
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>

      <ChatAssistant />
    </div>
  );
}

export default App;