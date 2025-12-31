import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BadgeCheck } from 'lucide-react';
import { EDUCATION, CERTIFICATIONS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Education: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="education" className="py-24 bg-tech-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-900 to-transparent opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">

        <div className="flex flex-col lg:flex-row gap-16">

          {/* Education Column */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-tech-accent">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">{t('education.title')}</h2>
            </motion.div>

            <div className="space-y-8 pl-4 border-l border-slate-800">
              {EDUCATION.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-tech-accent transition-colors"></div>
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-tech-purple font-medium mb-1">{edu.institution}</p>
                  <span className="text-sm text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {edu.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-tech-purple">
                <Award size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">{t('education.certifications')}</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <BadgeCheck size={20} className="text-slate-600 group-hover:text-tech-accent transition-colors" />
                    <span className="text-xs text-slate-500 font-mono">{cert.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white leading-snug">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-slate-500">{cert.issuer}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Education;