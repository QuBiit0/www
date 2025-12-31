import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  // Access emails directly from the constant
  const { email, secondaryEmail, socials, name } = PERSONAL_INFO;

  return (
    <footer id="contact" className="py-24 bg-gradient-to-b from-tech-bg to-black border-t border-slate-900">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Build Something Amazing</h2>
          <p className="text-slate-400 mb-12 text-lg">
            Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-tech-accent to-tech-purple text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              <Mail size={20} />
              Say Hello
            </a>

            <div className="text-slate-400 text-sm flex flex-col gap-2 mt-4">
              <a href={`mailto:${email}`} className="hover:text-tech-accent transition-colors">
                {email}
              </a>
              {secondaryEmail && (
                <a href={`mailto:${secondaryEmail}`} className="hover:text-tech-accent transition-colors">
                  {secondaryEmail}
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-8 mb-12">
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              <Linkedin size={32} />
            </a>
            <a href={socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              <Github size={32} />
            </a>
          </div>

          <div className="pt-8 border-t border-slate-900 text-slate-600 text-sm">
            <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
            <p className="mt-2 text-xs">Built by <span className="text-tech-accent font-bold">Onefix</span> | Powered by React & Tailwind</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;