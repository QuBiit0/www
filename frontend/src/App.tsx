import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatAssistant from './components/ChatAssistant';
import AdminPanel from './components/AdminPanel';

function App() {
  // Simple "Router" for Admin
  const path = window.location.pathname;

  const isAdmin = path === '/admin';

  if (isAdmin) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // Redirect to login page (you'll need to create this)
      window.location.href = '/login.html';
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
          <Contact />
        </main>
        <footer className="bg-slate-900 border-t border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
            © 2026 Leandro Alvarez. All rights reserved.
          </div>
        </footer>
        <ChatAssistant />
      </div>
    </LanguageProvider>
  );
}

export default App;