import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE, PROJECTS } from '../constants';
import { Briefcase, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Experience: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">

        {/* Experience Column */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-16 text-center"
          >
            {t('experience.title')}
          </motion.h2>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-tech-accent via-slate-800 to-slate-900 md:transform md:-translate-x-1/2"></div>

            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start justify-between mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                <div className="flex-1 w-full md:w-5/12 mb-4 md:mb-0"></div>

                {/* Center Dot */}
                <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 z-10 mt-1.5 ${index === 0 ? 'bg-tech-accent border-tech-accent shadow-[0_0_10px_#06b6d4]' : 'bg-slate-950 border-slate-600'
                  }`}></div>

                <div className={`flex-1 w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                  }`}>
                  <div className="group">
                    <span className={`text-tech-accent text-xs font-mono mb-2 block flex items-center gap-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                      }`}>
                      <Calendar size={12} /> {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-tech-accent transition-colors">{exp.role}</h3>
                    <p className="text-slate-400 font-medium mb-4">{exp.company}</p>

                    {Array.isArray(exp.description) ? (
                      <ul className={`space-y-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-slate-500 text-sm leading-relaxed flex items-start gap-2">
                            <span className={`mt-1.5 min-w-[4px] h-[4px] rounded-full bg-slate-700 ${index % 2 === 0 ? 'md:order-2' : ''}`}></span>
                            <span className={index % 2 === 0 ? 'md:text-right' : 'md:text-left'}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div id="projects">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            {t('experience.projects')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-tech-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-tech-accent/10 flex flex-col"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-tech-accent transition-all duration-500"></div>
                <div className="p-8 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-800 rounded-xl text-white group-hover:bg-tech-accent group-hover:text-black transition-colors">
                      <Briefcase size={24} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-tech-accent transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.techStack.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-slate-950 text-slate-400 text-xs rounded border border-slate-800 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;