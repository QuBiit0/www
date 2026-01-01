import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatAssistant from './components/ChatAssistant';
import AdminPanel from './components/AdminPanel';

// Assuming a Login component will be created or already exists for the /login route
// For now, we'll use a placeholder or redirect if the instruction is to remove its usage entirely.
// Given the instruction "Remove Login import and usage", I will not re-introduce a Login component here.
// The Navigate('/login') will point to a route that is not defined in this App.js,
// which implies the user might define it elsewhere or handle it differently.
// For the purpose of this edit, I will remove the old Login component and its direct usage.

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="bg-tech-bg min-h-screen text-slate-300 font-sans selection:bg-tech-accent selection:text-white">
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Education />
      </main>
      <Contact />
      <ChatAssistant />
    </div>
    </LanguageProvider >
  );
}

export default App;