export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string | string[]; // Support for bullet points
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}