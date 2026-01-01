import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatAssistant from './components/ChatAssistant';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

function App() {
  // Simple "Router" for Admin
  const path = window.location.pathname;

  if (path === '/login') {
    return <Login />;
  }

  const isAdmin = path === '/admin';

  if (isAdmin) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }
    return <AdminPanel />;
  }

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

export default App;