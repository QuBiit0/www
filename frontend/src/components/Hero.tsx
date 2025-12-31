import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown, Terminal, Sparkles, Code2, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const CodeWindow = () => {
  const codeLines = [
    { text: "from langchain.agents import initialize_agent", color: "text-tech-purple" },
    { text: "from langchain.llms import OpenAI", color: "text-tech-purple" },
    { text: "import n8n_workflows as automation", color: "text-blue-400" },
    { text: "", color: "text-white" },
    { text: "# Initialize AI Brain", color: "text-slate-500" },
    { text: "llm = OpenAI(temperature=0)", color: "text-white" },
    { text: "", color: "text-white" },
    { text: "# Define Autonomous Tools", color: "text-slate-500" },
    { text: "tools = [", color: "text-white" },
    { text: "  automation.System_Optimizer(),", color: "text-green-400" },
    { text: "  automation.Security_Auditor()", color: "text-green-400" },
    { text: "]", color: "text-white" },
    { text: "", color: "text-white" },
    { text: "agent.run('Optimize Infrastructure')", color: "text-yellow-300" },
    { text: ">> Executing autonomous workflow...", color: "text-tech-accent animate-pulse" },
  ];

  return (
    <div className="w-full max-w-lg bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl font-mono text-xs md:text-sm relative group">
      {/* Window Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-slate-400 text-xs flex items-center gap-2">
          <Terminal size={12} />
          agent_builder.py
        </div>
      </div>

      {/* Code Area */}
      <div className="p-6 bg-[#0d1117] text-slate-300 overflow-hidden relative min-h-[320px]">
        {codeLines.map((line, index) => (
          <TypingLine key={index} line={line} delay={index * 0.8} />
        ))}

        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

const TypingLine = ({ line, delay }: { line: { text: string, color: string }, delay: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentText = "";
      const interval = setInterval(() => {
        if (currentText.length < line.text.length) {
          currentText = line.text.slice(0, currentText.length + 1);
          setDisplayedText(currentText);
        } else {
          clearInterval(interval);
        }
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [line.text, delay]);

  return (
    <div className="min-h-[1.5em] flex">
      <span className="text-slate-600 mr-4 select-none"></span>
      <span className={`${line.color} font-medium`}>{displayedText}</span>
    </div>
  );
};

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-tech-bg">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-tech-bg to-tech-bg opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

        {/* Animated Abstract Shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-tech-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-tech-purple/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            {/* Profile Header Block */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="relative shrink-0"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-tech-accent to-tech-purple rounded-full blur opacity-50 animate-pulse"></div>
                <img
                  src={PERSONAL_INFO.profileImage}
                  alt={PERSONAL_INFO.name}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
                />
              </motion.div>

              {/* Name & Title */}
              <div className="text-center md:text-left pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-tech-accent text-xs font-mono mb-4 backdrop-blur-md shadow-lg shadow-tech-accent/10">
                  <Sparkles size={12} />
                  <span>{PERSONAL_INFO.title}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                  Leandro <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-accent via-blue-400 to-tech-purple animate-pulse-slow">
                    Alvarez
                  </span>
                </h1>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl font-light leading-relaxed">
              Transforming complex challenges into
              <span className="text-white font-medium"> intelligent automated systems</span>.
              <span className="block mt-4 text-base md:text-lg text-slate-500 font-mono border-l-2 border-tech-accent pl-4">
                {PERSONAL_INFO.about.split('.')[0]}.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#contact"
                className="px-8 py-4 rounded-lg bg-white text-black font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
              >
                Let's Talk <Terminal size={18} />
              </a>

              <div className="flex gap-2">
                <a
                  href="/cv-es.pdf"
                  download="Leandro_Alvarez_CV_ES.pdf"
                  className="flex-1 sm:flex-none px-6 py-4 rounded-lg bg-slate-800/80 border border-slate-700 text-white font-medium hover:border-tech-accent hover:text-tech-accent hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
                >
                  CV Español <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                </a>
                <a
                  href="/cv-en.pdf"
                  download="Leandro_Alvarez_CV_EN.pdf"
                  className="flex-1 sm:flex-none px-6 py-4 rounded-lg bg-slate-800/80 border border-slate-700 text-white font-medium hover:border-tech-purple hover:text-tech-purple hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
                >
                  CV English <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative hidden md:flex justify-center"
          >
            {/* 3D Floating Code Window */}
            <div className="relative perspective-1000">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <CodeWindow />
              </motion.div>

              {/* Floating Decoration Icons */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 -top-8 bg-slate-800 p-4 rounded-2xl border border-slate-600 shadow-xl z-20"
              >
                <BotIcon />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-10 bg-slate-800 p-4 rounded-2xl border border-slate-600 shadow-xl z-20"
              >
                <Cpu size={32} className="text-tech-accent" />
              </motion.div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-tech-accent/20 to-tech-purple/20 rounded-full blur-[80px] -z-10"></div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  );
};

const BotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
)

export default Hero;