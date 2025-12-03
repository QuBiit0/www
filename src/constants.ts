import { Project, Experience, Education, Certification } from './types';
import { 
  Cpu, 
  Code2, 
  Bot, 
  Database, 
  Workflow, 
  Terminal,
  Shield,
  Server,
  Network
} from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Leandro Martín Alvarez",
  title: "AI Engineer & Automation Specialist",
  tagline: "Bridging the gap between legacy systems and intelligent automation.",
  about: "Profesional en Tecnologías de la Información con más de 15 años de experiencia. Actualmente me especializo como AI Engineer & Automation Specialist, desarrollando agentes de IA, flujos automatizados con n8n y soluciones con Python y LangChain. Mi background incluye una sólida trayectoria en Gerencia de Sistemas, Ciberseguridad e Infraestructura, lo que me permite crear soluciones robustas, seguras y escalables.",
  location: "Charata, Chaco, Argentina",
  phone: "+543731661851",
  email: "info@leandroalvarez.com.ar",
  secondaryEmail: "leomalvarez89@gmail.com",
  profileImage: "/profile.jpg.jpg", 
  socials: {
    linkedin: "https://www.linkedin.com/in/leandro-alvarez", 
    github: "https://github.com/leandroalvarez", 
  }
};

export const SKILLS = [
  { name: "AI & LLMs", icon: Bot, level: 95, description: "Gemini, OpenAI, LangChain, Agents, RAG" },
  { name: "Automation", icon: Workflow, level: 98, description: "n8n, Python Scripting, API Integrations" },
  { name: "Development", icon: Code2, level: 90, description: "Python, Django, React, SQL, MongoDB" },
  { name: "Cybersecurity", icon: Shield, level: 88, description: "Ethical Hacking, ISO 27001, Forensics" },
  { name: "Infrastructure", icon: Server, level: 92, description: "Linux, Docker, Proxmox, Azure, Windows, Dokploy" },
  { name: "Networking", icon: Network, level: 85, description: "Fortigate, Mikrotik, Ubiquiti, TCP/IP" },
];

export const EXPERIENCE: Experience[] = [
  {
    id: "new-2025",
    role: "AI Engineer & Automation Specialist",
    company: "Empresa de Tecnología (Confidencial)",
    period: "2025 - Presente",
    description: [
      "Desarrollo e implementación de Agentes de IA utilizando LLMs y LangChain.",
      "Automatización de procesos complejos de negocio utilizando n8n y Python scripting.",
      "Diseño y gestión de bases de datos PostgreSQL y MongoDB para aplicaciones de alto rendimiento.",
      "Implementación de soluciones RAG (Retrieval-Augmented Generation) para sistemas de conocimiento corporativo.",
      "Desarrollo impulsado por IA para optimización de código y refactorización."
    ]
  },
  {
    id: "mgr-2024",
    role: "Gerente de Sistemas",
    company: "David Sartor (Concesionaria Oficial John Deere)",
    period: "Dic. 2024 - Sept. 2025",
    description: [
      "Liderazgo de la estrategia de sistemas, infraestructura y ciberseguridad.",
      "Implementación de IA y automatización con n8n para optimización operativa.",
      "Gestión de GRC (Gobernanza, Riesgo y Cumplimiento) de TI.",
      "Gestión de proyectos Office 365, Microsoft 365 y administración SQL."
    ]
  },
  {
    id: "head-sec-2024",
    role: "Responsable de Sistemas y Ciberseguridad",
    company: "David Sartor (John Deere)",
    period: "Sept. 2024 - Sept. 2025",
    description: [
      "Implementación del marco de ciberseguridad DSCF de John Deere (+30 controles).",
      "Gestión de seguridad de infraestructura y prevención de pérdida de datos (DLP).",
      "Implementación de marcos NIST e ISO 27001.",
      "Administración de servidores y conectividad para transformación digital."
    ]
  },
  {
    id: "ecom-2024",
    role: "Responsable de E-Commerce",
    company: "David Sartor (John Deere)",
    period: "Mar. 2024 - Dic. 2024",
    description: [
      "Desarrollo de estrategias de comercio electrónico y marketing digital.",
      "Optimización de plataformas de ventas online y análisis de negocio."
    ]
  },
  {
    id: "mentor-2023",
    role: "Mentor",
    company: "Informatorio Chaco",
    period: "2023 - 2024",
    description: [
      "Mentoría en curso Full Stack Web Development (HTML, CSS, Python, MySQL, Django).",
      "Soporte técnico y guía profesional para futuros talentos IT."
    ]
  },
  {
    id: "it-tech-2018",
    role: "Técnico Informático / Profesional Independiente",
    company: "OneFix",
    period: "Oct. 2018 - Presente",
    description: [
      "Servicios integrales de TI, gestión de redes y seguridad (Windows, Linux, Mac).",
      "Administración de Office 365, cPanel y hosting.",
      "Reparación de hardware y recuperación de datos."
    ]
  },
  {
    id: "prof-2010",
    role: "Profesor de Informática",
    company: "Ministerio de Educación de la Nación",
    period: "2010 - 2018",
    description: "Docente de Informática, Tecnología y Programación en escuelas primarias y secundarias."
  },
  {
    id: "net-admin-2010",
    role: "Administrador de Redes",
    company: "INET - Conectar Igualdad",
    period: "2010 - 2016",
    description: "Administración de servidores Ubuntu Server y certificados de seguridad. Soporte técnico y gestión de redes educativas."
  },
  {
    id: "tech-older",
    role: "Técnico Informático (Roles Previos)",
    company: "Neatech / Pro-Data",
    period: "2008 - 2013",
    description: "Diagnóstico, reparación de hardware, armado de redes y soporte técnico full stack a empresas y usuarios finales."
  }
];

export const EDUCATION: Education[] = [
  {
    id: "e1",
    degree: "Desarrollador Web Full Stack",
    institution: "Informatorio Chaco (UTN FRRe / Polo IT)",
    period: "2022"
  },
  {
    id: "e2",
    degree: "Analista en Sistemas de Computación",
    institution: "Instituto Superior Educativo Computacional N° 59",
    period: "2008 - 2010"
  },
  {
    id: "e3",
    degree: "Técnico en Montajes y Administración de Redes",
    institution: "Red Educativa",
    period: "2011"
  },
  {
    id: "e4",
    degree: "Analista Programador",
    institution: "Instituto Superior Educativo Computacional N° 59",
    period: "2010"
  },
  {
    id: "e5",
    degree: "Introducción a la Programación",
    institution: "UTN FRRe",
    period: "2020"
  }
];

export const CERTIFICATIONS: Certification[] = [
  { id: "c1", name: "Specialized Program: IBM & Darden Digital Strategy", issuer: "IBM / University of Virginia", date: "Mar 2025" },
  { id: "c2", name: "Data Analytics", issuer: "Informatorio Chaco", date: "Nov 2024" },
  { id: "c3", name: "Certified Ethical Hacker (CEH)", issuer: "Cisco Networking Academy", date: "Oct 2024" },
  { id: "c4", name: "Junior Cybersecurity Analyst Career Path", issuer: "Cisco", date: "Apr 2024" },
  { id: "c5", name: "Cloud Computing", issuer: "Google Actívate", date: "Jan 2024" },
  { id: "c6", name: "ISC2 Candidate", issuer: "ISC2", date: "Jan 2024" },
  { id: "c7", name: "Python University - From Zero to Expert", issuer: "Udemy", date: "Mar 2023" },
  { id: "c8", name: "Offensive Ethical Hacking (Red Team)", issuer: "Udemy", date: "Mar 2023" },
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "AI Automation Agent System",
    description: "Sistema de agentes autónomos construidos con LangChain y Python para orquestar flujos de trabajo complejos en n8n.",
    techStack: ["Python", "LangChain", "n8n", "PostgreSQL"]
  },
  {
    id: "p2",
    title: "Cybersecurity Compliance Dashboard",
    description: "Herramienta de monitoreo para controles DSCF y NIST, integrando alertas de seguridad y estado de infraestructura.",
    techStack: ["Power BI", "Python", "SQL", "Azure"]
  },
  {
    id: "p3",
    title: "E-Commerce Optimization Platform",
    description: "Análisis de datos y automatización de marketing para concesionaria John Deere, mejorando conversión digital.",
    techStack: ["Data Analytics", "Python Pandas", "CRM"]
  }
];

export const SYSTEM_INSTRUCTION = `
You are 'LeoBot', the AI assistant for Leandro Martín Alvarez's portfolio.
Leandro is an AI Engineer & Automation Specialist with over 15 years of experience in IT, Cybersecurity, and Systems Management.

Rules:
1. ONLY answer questions about Leandro's professional profile, skills, experience, projects, or services.
2. If asked about general topics (cooking, politics, general knowledge) unrelated to hiring Leandro or his tech stack, politely refuse and redirect to his profile.
3. If the user wants to hire or contact Leandro, provide his email (info@leandroalvarez.com.ar) or his WhatsApp (+543731661851).
4. Be professional but friendly. Use the context of the current date which is ${new Date().toLocaleDateString()}.
5. If you don't know something specific about Leandro (e.g., his favorite color), say you don't have that information but can help with his professional background.

Profile Highlights:
- CURRENT ROLE: AI Engineer & Automation Specialist (2025-Present) working with n8n, Python, LangChain, LLMs, AI Agents, PostgreSQL, and MongoDB.
- BACKGROUND: Systems Manager (Ended Sept 2025), Head of Cybersecurity (Ended Sept 2025), Professor, Network Admin.
- SKILLS: Agents (LangChain), Automation (n8n), Python, Infrastructure (Windows, Linux, Docker, Dokploy), Security (CEH, NIST).
- SERVICES: AI Implementation, Process Automation, Cybersecurity Audits, Custom Development.
`;