# Arquitectura del Sistema - Portfolio IA

## Visión General

Este proyecto implementa un portafolio personal interactivo potenciado por un Agente de Inteligencia Artificial capaz de responder preguntas sobre la experiencia profesional, skills y proyectos de Leandro Alvarez. El sistema utiliza una arquitectura de microservicios contenerizada.

## Diagrama de Arquitectura

```mermaid
graph TD
    User[Usuario] -->|HTTPS| Nginx[Frontend (React + Nginx)]
    Nginx -->|/api/*| FastAPI[Backend (FastAPI)]
    
    subgraph Backend Services
        FastAPI -->|LangChain| Agent[AI Agent Orchestrator]
        FastAPI -->|SQLAlchemy| DB[(PostgreSQL)]
        Agent -->|Tools| Data[Portfolio Data (JSON)]
        Agent -->|API| LLM[Google Gemini / OpenAI]
    end
    
    subgraph Frontend Logic
        React -->|Chat Messages| ChatService
        React -->|Admin Config| AdminService
    end
```

## Componentes Principales

### 1. Frontend (React + TypeScript)
- **Framework**: Vite + React
- **Estilos**: TailwindCSS
- **Componentes Clave**:
  - `ChatAssistant`: Interfaz flotante de chat. Maneja estado local y conexión websocket/http.
  - `AdminPanel`: Panel protegido para configuración de LLM y visualización de estadísticas.
  - `LanguageContext`: Gestión de internacionalización (EN/ES).

### 2. Backend (Python FastAPI)
- **API Rest**: Endpoints para gestión de chat `/api/chat`, configuración `/api/settings` y estadísticas `/api/stats`.
- **Base de Datos**: PostgreSQL para persistencia de:
  - Historial de conversaciones (`chat_messages`).
  - Configuración dinámica del sistema (`system_settings`).
- **ORM**: SQLAlchemy (Async) + Pydantic.

### 3. AI Agent (LangChain)
- **Motor**: LangChain con soporte multi-provider (Google Gemini y OpenAI).
- **Herramientas**:
  - `get_portfolio_info`: Recuperación de datos estructurados desde `data/portfolio.json`.
  - `contact_leandro`: Simulación de contacto directo.
- **Memoria**: Historial de chat persistente con ventana de contexto limitada (últimos 20 mensajes).

## Flujo de Datos

1. **Consulta del Usuario**: El usuario envía un mensaje desde el Frontend.
2. **Procesamiento**:
   - Backend recibe el mensaje y el `session_id`.
   - Recupera el historial reciente de la DB.
   - Instancia el Agente con la configuración actual (desde DB o Cache).
3. **Razonamiento (Agent)**:
   - El LLM decide si necesita herramientas (`get_portfolio_info`).
   - Si invoca herramienta, el backend ejecuta la función y devuelve el resultado al LLM.
4. **Respuesta**:
   - El LLM genera la respuesta final.
   - Backend guarda la interacción en DB.
   - Respuesta se envía al Frontend.

## Estructura de Datos (Portfolio)

El archivo `backend/data/portfolio.json` actúa como fuente de verdad para el agente.
Estructura:
```json
{
  "personal_info": { ... },
  "experience": [ ... ],
  "education": [ ... ],
  "skills": [ ... ],
  "projects": [ ... ]
}
```

## Seguridad
- **API Keys**: No se exponen al cliente. Gestionadas por el backend y almacenadas en DB o variables de entorno.
- **CORS**: Configurado para permitir orígenes específicos en producción.
- **Docker**: Ejecución aislada de servicios.
