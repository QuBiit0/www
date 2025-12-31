from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent, tool
from settings import get_settings

settings = get_settings()

# --- Tools Definition ---
from utils import get_cached_llm, set_cached_llm
from portfolio_service import get_portfolio_data
from database import AsyncSessionLocal
import json

# --- Tools Definition ---
@tool
async def get_portfolio_info(query: str) -> str:
    """Useful for answering questions about Leandro's professional experience, skills, projects, or resume.
    If the query is specific (e.g. 'skills', 'experience'), it will return that section.
    Otherwise it returns the full profile context.
    """
    if "db_test_fail" in query: # Forced failure for testing
         return "Error: Could not load portfolio data."

    async with AsyncSessionLocal() as session:
        data = await get_portfolio_data(session)
    
    if not data:
        return "Error: Could not load portfolio data."

    query_lower = query.lower()
    
    # Simple semantic routing based on keywords
    if "skill" in query_lower or "technolog" in query_lower or "stack" in query_lower:
        return f"Skills: {json.dumps(data.get('skills', []), indent=2)}"
    
    if "experience" in query_lower or "work" in query_lower or "job" in query_lower or "history" in query_lower:
        return f"Experience: {json.dumps(data.get('experience', []), indent=2)}"
        
    if "education" in query_lower or "stud" in query_lower or "degree" in query_lower:
        return f"Education: {json.dumps(data.get('education', []), indent=2)}"
        
    if "project" in query_lower or "app" in query_lower:
        return f"Projects: {json.dumps(data.get('projects', []), indent=2)}"
        
    if "contact" in query_lower or "email" in query_lower or "phone" in query_lower:
        return f"Contact Info: {json.dumps(data.get('personal_info', {}).get('contact', {}), indent=2)}"

    # Default: Return Summary + Skills + Recent Role
    summary = {
        "personal": data.get("personal_info"),
        "top_skills": data.get("skills")[:5] if data.get("skills") else [],
        "latest_role": data.get("experience")[0] if data.get("experience") else {}
    }
    return f"Context: {json.dumps(summary, indent=2)}"

@tool
def contact_leandro(subject: str, message: str, contact_info: str = "Not provided") -> str:
    """Useful for sending a message or email to Leandro. 
    Ask for the user's contact info (email/phone) before calling this if not provided.
    """
    # Mock capability for V1 - In V2 implement SMTP
    print(f"--- EMAIL SIMULATION ---\nTo: Leandro\nFrom: {contact_info}\nSubject: {subject}\nMessage: {message}\n------------------------")
    return f"Message sent successfully to Leandro! He will contact you back at {contact_info}."

from sqlalchemy import select
from database import AsyncSessionLocal
from models import SystemSettings
import json

# --- Agent Factory (Dynamic) ---
async def get_dynamic_settings():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(SystemSettings).order_by(SystemSettings.id.desc()).limit(1))
        db_settings = result.scalars().first()
        return db_settings

async def get_llm():
    # Fetch latest settings from DB
    db_settings = await get_dynamic_settings()
    
    # Defaults
    provider = db_settings.provider if db_settings else settings.MODEL_PROVIDER
    model_name = db_settings.model_name if db_settings else "gpt-3.5-turbo"
    api_key = db_settings.api_key if db_settings else settings.GEMINI_API_KEY
    temperature = float(db_settings.temperature) if db_settings else 0.7

    print(f"DEBUG: Agent Settings - Provider: {provider}, Model: {model_name}, HasKey: {bool(api_key)}")

    # Check Cache
    cached_llm = get_cached_llm(provider, model_name, str(api_key), temperature)
    if cached_llm:
        print("DEBUG: Using Cached LLM")
        return cached_llm

    llm = None
    if provider == "gemini":
        if not api_key:
             # Fallback to env or error
             api_key = settings.GEMINI_API_KEY
        llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key, temperature=temperature)
    
    # OpenAI Fallback
    else:
        # Default to a widely available model if gpt-4o fails
        if model_name == "gpt-4o": 
            # Check if we should fallback (optional logic, but for now just use what's passed)
            pass
            
        openai_kwargs = {
            "model": model_name,
            "api_key": api_key or settings.OPENAI_API_KEY,
            "temperature": temperature
        }
        
        # Add base_url if present
        if db_settings and db_settings.base_url:
            openai_kwargs["base_url"] = db_settings.base_url
            
        llm = ChatOpenAI(**openai_kwargs)
    
    # Cache the new instance
    if llm:
        set_cached_llm(provider, model_name, str(api_key), llm, temperature)
    
    return llm

async def process_message(message: str, history: list = []):
    # Re-create agent per request to ensure latest config usage
    # Optimization: Cache agent and invalidate on config update in real production
    llm = await get_llm()
    tools = [get_portfolio_info, contact_leandro] # Add tools here
    
    system_prompt = """You are the AI Assistant for Leandro Alvarez's Portfolio.
    Your goal is to represent Leandro professionally, answer questions about his skills, and encourage visitors to hire him.
    
    - Be professional, enthusiastic, and concise.
    - If you don't know something, ask the user to contact Leandro directly.
    - Use the 'get_portfolio_info' tool to check his details.
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    agent = create_openai_tools_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    result = await agent_executor.ainvoke({
        "input": message,
        "chat_history": history
    })
    
    return result["output"]
