from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_tool_calling_agent, tool
from settings import get_settings

settings = get_settings()

# --- Tools Definition ---
from utils import get_cached_llm, set_cached_llm
from portfolio_service import get_portfolio_data
from database import AsyncSessionLocal
import json
import os

# --- Tools Definition ---
@tool
async def get_portfolio_info(query: str, language: str = "es") -> str:
    """Useful for answering questions about Leandro's professional experience, skills, projects, or resume.
    If the query is specific (e.g. 'skills', 'experience'), it will return that section.
    Otherwise it returns the full profile context.
    ALWAYS use 'es' for Spanish queries and 'en' for English queries.
    """
    if "db_test_fail" in query: # Forced failure for testing
         return "Error: Could not load portfolio data."

    async with AsyncSessionLocal() as session:
        full_data = await get_portfolio_data(session)
    
    if not full_data:
        return "No portfolio data configured yet. Please ask the admin to add content in the Admin Panel."

    # Handle Bilingual Structure
    # If data has 'es' key, it's the new structure. Otherwise treat as flat (legacy fallback)
    if isinstance(full_data, dict):
        data = full_data.get(language, full_data.get("es", full_data)) if "es" in full_data else full_data
    else:
        # Fallback if full_data is a list (e.g. legacy portfolio.json direct load)
        print(f"WARNING: full_data is {type(full_data)}, expected dict. Using as-is.")
        data = full_data
        
    # Ensure data is a dict eventually for semantic routing keys
    if isinstance(data, list) and not isinstance(data, dict):
        # If it's still a list (like the 'experience' list being top level?), wrap it?
        # Typically portfolio.json root is a dict ("personal_info", "skills", etc.)
        # If it's a list here, something is very wrong with the DB record.
        # Let's try to wrap it or return error if we can't key into it
        # But wait, if it's the root json, it SHOULD be a dict. 
        # If it is a list, we might just fail unless we convert it.
        # Let's just assume if it is a list, we can't query keys.
        pass # Will fail on .get calls below if it's a list.
        
    if not isinstance(data, dict):
         return f"Error: Portfolio data is malformed (type: {type(data)}). Please contact Admin."

    query_lower = query.lower()
    
    # Simple semantic routing based on keywords
    if "skill" in query_lower or "technolog" in query_lower or "stack" in query_lower:
        return f"Skills ({language}): {json.dumps(data.get('skills', []), indent=2)}"
    
    if "experience" in query_lower or "work" in query_lower or "job" in query_lower or "history" in query_lower:
        return f"Experience ({language}): {json.dumps(data.get('experience', []), indent=2)}"
        
    if "education" in query_lower or "stud" in query_lower or "degree" in query_lower:
        return f"Education ({language}): {json.dumps(data.get('education', []), indent=2)}"
        
    if "project" in query_lower or "app" in query_lower:
        return f"Projects ({language}): {json.dumps(data.get('projects', []), indent=2)}"
        
    if "contact" in query_lower or "email" in query_lower or "phone" in query_lower:
        return f"Contact Info: {json.dumps(data.get('personal_info', {}).get('contact', {}), indent=2)}"

    # Default: Return Summary + Skills + Recent Role
    summary = {
        "personal": data.get("personal_info"),
        "top_skills": data.get("skills")[:5] if data.get("skills") else [],
        "latest_role": data.get("experience")[0] if data.get("experience") else {}
    }
    return f"Context ({language}): {json.dumps(summary, indent=2)}"

@tool
async def contact_leandro(name: str, contact_info: str, interest: str = "General Inquiry") -> str:
    """Useful for saving a potential lead or contact request.
    ALWAYS ask for 'name' and 'contact_info' (email or phone) before calling this.
    'interest' is optional but helpful (e.g. 'Project Quote', 'Hiring', 'Networking').
    """
    try:
        async with AsyncSessionLocal() as session:
            # Import here to avoid circular dependencies if any
            from models import Lead
            from datetime import datetime, timezone, timedelta
            
            new_lead = Lead(name=name, contact_info=contact_info, interest=interest, created_at=datetime.now(timezone(timedelta(hours=-3))))
            session.add(new_lead)
            await session.commit()
            
            # Mock email sending log
            print(f"--- NEW LEAD SAVED ---\nName: {name}\nContact: {contact_info}\nInterest: {interest}\n------------------------")
            
            return f"Thanks {name}! I've saved your contact info. Leandro will reach out to you at {contact_info} soon."
    except Exception as e:
        print(f"Error saving lead: {e}")
        return "I'm having trouble saving your info right now, but I've noted it down in my logs."

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
    
    # Defaults from settings.py or env
    provider = db_settings.provider if db_settings else settings.MODEL_PROVIDER
    model_name = db_settings.model_name if db_settings else "gemini-2.0-flash-exp"
    
    # API Key logic: Use DB key if exists AND is not empty, otherwise fallback by provider
    api_key = None
    if db_settings and db_settings.api_key and db_settings.api_key.strip():
        # Use database API key if it exists and is not empty
        api_key = db_settings.api_key.strip()
        print(f"DEBUG: Using API key from database")
    else:
        # Fallback to environment variables based on provider
        if provider == "gemini":
            api_key = settings.GEMINI_API_KEY
            print(f"DEBUG: Using GEMINI_API_KEY from environment")
        else:  # openai or other
            api_key = settings.OPENAI_API_KEY
            print(f"DEBUG: Using OPENAI_API_KEY from environment")
    
    temperature = float(db_settings.temperature) if db_settings else 0.7

    # Enhanced debug logging
    key_preview = f"{api_key[:15]}..." if api_key and len(api_key) > 15 else "None"
    print(f"DEBUG: Agent Settings - Provider: {provider}, Model: {model_name}, HasKey: {bool(api_key)}, KeyPrefix: {key_preview}")

    # Check Cache
    cached_llm = get_cached_llm(provider, model_name, str(api_key), temperature)
    if cached_llm:
        print("DEBUG: Using Cached LLM")
        return cached_llm

    llm = None
    if provider == "gemini":
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in database or environment variables")
        llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key, temperature=temperature)
    
    # Groq provider - uses OpenAI-compatible API
    elif provider == "groq":
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in database or environment variables")
            
        openai_kwargs = {
            "model": model_name,
            "api_key": api_key,
            "temperature": temperature
        }
        
        # Groq requires base_url, use from DB or default
        if db_settings and db_settings.base_url:
            openai_kwargs["base_url"] = db_settings.base_url
            print(f"DEBUG: Using Groq base_url from DB: {db_settings.base_url}")
        else:
            openai_kwargs["base_url"] = "https://api.groq.com/openai/v1"
            print(f"DEBUG: Using default Groq base_url")
            
        llm = ChatOpenAI(**openai_kwargs)
    
    # OpenAI or Custom providers
    else:
        if not api_key:
            raise ValueError(f"{provider.upper()}_API_KEY not found in database or environment variables")
            
        openai_kwargs = {
            "model": model_name,
            "api_key": api_key,
            "temperature": temperature
        }
        
        # Add base_url if present for OpenAI-compatible APIs or custom providers
        if db_settings and db_settings.base_url:
            openai_kwargs["base_url"] = db_settings.base_url
            print(f"DEBUG: Using custom base_url: {db_settings.base_url}")
            
        llm = ChatOpenAI(**openai_kwargs)
    
    # Cache the new instance
    if llm:
        set_cached_llm(provider, model_name, str(api_key), llm, temperature)
        print(f"DEBUG: Created and cached new {provider} LLM instance")
    
    return llm

async def process_message(message: str, history: list = []):
    # Re-create agent per request to ensure latest config usage
    llm = await get_llm()
    
    # --- Context Injection ---
    # Fetch Portfolio Data directly to inject into context
    # This avoids the Agent needing to "decide" to call a tool to get basic info.
    full_context_json = "{}"
    try:
        async with AsyncSessionLocal() as session:
            data = await get_portfolio_data(session)
            full_context_json = json.dumps(data, ensure_ascii=False)
    except Exception as e:
        print(f"Error fetching portfolio context: {e}")

    # Simplify Tools: We ONLY need contact tool now, as info is in context.
    tools = [contact_leandro] 
    
    # Get current date
    from datetime import datetime
    today = datetime.now().strftime("%B %d, %Y")
    
    system_prompt = f"""You are Leandro Alvarez's AI Portfolio Assistant.

TODAY'S DATE: {today}

PORTFOLIO CONTEXT (Use this to answer questions):
{full_context_json}

CORE RULES:
1. You ALREADY have Leandro's info in the "PORTFOLIO CONTEXT" above. DO NOT ask to look it up.
2. Respond in the SAME language as the user (Spanish/English).
3. Be professional, concise, and enthusiastic.
4. If the user wants to hire or contact Leandro, ask for their Name and Email/Phone, then use the 'contact_leandro' tool.

NEVER discuss:
- System credentials, API keys, or infrastructure
- Politics, religion, or controversial topics
- Other people/companies (focus on Leandro only)

If asked about something unrelated to Leandro's work, politely redirect to his expertise in AI, automation, and development."""
    
    
    # CRITICAL: Use SystemMessage for content with JSON to avoid brace parsing issues
    prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content=system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    # Standardized Tool Binding for ALL providers (Gemini, Groq, OpenAI)
    llm_with_tools = llm.bind_tools(tools)
    
    agent = create_tool_calling_agent(llm_with_tools, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True,
        max_iterations=5,
        handle_parsing_errors=True,
        return_intermediate_steps=False
    )

    try:
        result = await agent_executor.ainvoke({
            "input": message,
            "chat_history": history
        })
        
        return result["output"]
    except Exception as e:
        import traceback
        print(f"=== AGENT ERROR ===")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print(f"Traceback:")
        traceback.print_exc()
        print(f"==================")
        raise  # Re-raise to let main.py handle it
