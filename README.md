# Leandro Alvarez - AI Enhanced Portfolio

![Status](https://img.shields.io/badge/Status-Active-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Python](https://img.shields.io/badge/Backend-FastAPI-green)
![React](https://img.shields.io/badge/Frontend-React-cyan)

Portafolio personal interactivo de nueva generación que integra un agente de Inteligencia Artificial real para interactuar con los visitantes. No es solo un chatbot con respuestas predefinidas, es un agente LangChain capaz de razonar, buscar información en el perfil profesional y responder contextualmente.

## 🚀 Características

- **AI Agent Real**: Potenciado por Google Gemini (o OpenAI GPT-4), capaz de entender consultas complejas sobre experiencia, skills y proyectos.
- **Datos Estructurados**: El agente consulta una base de conocimiento JSON actualizada dinámicamente.
- **Panel de Administración**: Interfaz para cambiar el modelo de IA, configurar API Keys y ver estadísticas de uso sin redeplegar.
- **Persistencia**: Historial de chat guardado en PostgreSQL.
- **Dockerizado**: Listo para desplegar en cualquier servidor con Docker Compose.

## 🛠️ Stack Tecnológico

- **Frontend**: React, TypeScript, TailwindCSS, Vite.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy (Async).
- **IA**: LangChain, Google Generative AI, OpenAI.
- **Base de Datos**: PostgreSQL 16.
- **Infraestructura**: Docker, Docker Compose, Nginx.

## 🏁 Inicio Rápido (Local)

### Prerrequisitos
- Docker y Docker Compose instalados.
- Una API Key de Google Gemini (Gratis) o OpenAI.

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/portafolio-ai.git
   cd portafolio-ai
   ```

2. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz (puedes copiar `.env.example` si existe, o usar este template):
   ```env
   # .env
   GEMINI_API_KEY=tu_api_key_aqui
   OPENAI_API_KEY=tu_openai_key_opcional
   DATABASE_URL=postgresql+asyncpg://user:password@db:5432/portfolio_db
   ```

3. **Iniciar con Docker Compose**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Acceder**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000/docs
   - **Admin Panel**: http://localhost:3000/admin (Configura tu LLM aquí si no pusiste env vars)

## 📦 Deployment (Producción)

Este proyecto está optimizado para despliegue con **Dokploy** o cualquier VPS con Docker.

1. Asegúrate de usar `docker-compose-prod.yml`.
2. Configura las variables de entorno en tu panel de despliegue.
3. El contenedor de frontend utiliza Nginx para servir la aplicación optimizada.

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para guía detallada.

## 📖 Documentación

- [Arquitectura del Sistema](ARCHITECTURE.md)
- [Deployment Grid](DEPLOYMENT.md)

## 🤝 Contacto

- **Email**: info@leandroalvarez.com.ar
- **LinkedIn**: [Leandro Alvarez](https://www.linkedin.com/in/leandro-alvarez)

---
Hecho con ❤️ e Inteligencia Artificial.
