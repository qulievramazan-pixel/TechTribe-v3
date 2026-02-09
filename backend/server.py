from fastapi import FastAPI, APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = os.environ.get('JWT_SECRET', 'techtribe-jwt-secret-2024-prod')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# AI Config
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Admin Secret
ADMIN_SECRET = "elituqay"

# Email Config
CONTACT_EMAIL = 'qulievramazan@gmail.com'

# Resend
try:
    import resend
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
except ImportError:
    RESEND_API_KEY = ''

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============ MODELS ============

class AdminUserCreate(BaseModel):
    name: str
    email: str
    password: str
    admin_secret: str = ""

class AdminUserLogin(BaseModel):
    email: str
    password: str

class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: str

class CatalogueItemCreate(BaseModel):
    title: str
    description: str
    short_description: str = ""
    features: List[str] = []
    technologies: List[str] = []
    price: float = 0
    currency: str = "AZN"
    images: List[str] = []
    demo_url: str = ""
    category: str = ""
    is_featured: bool = False

class CatalogueItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    features: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    images: Optional[List[str]] = None
    demo_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str

class ChatMessageCreate(BaseModel):
    session_id: str
    message: str
    user_name: str = "Qonaq"

class AdminChatReply(BaseModel):
    content: str


# ============ AUTH HELPERS ============

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Giriş tələb olunur")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Etibarsız token")
        user = await db.admin_users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="İstifadəçi tapılmadı")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Etibarsız token")


# ============ AUTH ROUTES ============

@api_router.post("/auth/register")
async def register(data: AdminUserCreate):
    existing = await db.admin_users.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Bu email artıq qeydiyyatdan keçib")
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password_hash": pwd_context.hash(data.password),
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.admin_users.insert_one(user_doc)
    token = create_token({"sub": user_doc["id"]})
    return {
        "token": token,
        "user": {
            "id": user_doc["id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": user_doc["role"]
        }
    }

@api_router.post("/auth/login")
async def login(data: AdminUserLogin):
    user = await db.admin_users.find_one({"email": data.email}, {"_id": 0})
    if not user or not pwd_context.verify(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email və ya şifrə yanlışdır")
    token = create_token({"sub": user["id"]})
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }


# ============ CATALOGUE ROUTES ============

@api_router.get("/catalogue")
async def get_catalogue(category: str = "", featured: bool = False):
    query = {"is_active": True}
    if category:
        query["category"] = category
    if featured:
        query["is_featured"] = True
    items = await db.catalogue_items.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return items

@api_router.get("/catalogue/{item_id}")
async def get_catalogue_item(item_id: str):
    item = await db.catalogue_items.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Məhsul tapılmadı")
    return item

@api_router.post("/catalogue", status_code=201)
async def create_catalogue_item(data: CatalogueItemCreate, user=Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["is_active"] = True
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.catalogue_items.insert_one(doc)
    created = await db.catalogue_items.find_one({"id": doc["id"]}, {"_id": 0})
    return created

@api_router.put("/catalogue/{item_id}")
async def update_catalogue_item(item_id: str, data: CatalogueItemUpdate, user=Depends(get_current_user)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Yeniləmə üçün məlumat yoxdur")
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.catalogue_items.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Məhsul tapılmadı")
    updated = await db.catalogue_items.find_one({"id": item_id}, {"_id": 0})
    return updated

@api_router.delete("/catalogue/{item_id}")
async def delete_catalogue_item(item_id: str, user=Depends(get_current_user)):
    result = await db.catalogue_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Məhsul tapılmadı")
    return {"message": "Məhsul silindi"}


# ============ CONTACT ROUTES ============

@api_router.post("/contact")
async def create_contact(data: ContactMessageCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "subject": data.subject,
        "message": data.message,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_messages.insert_one(doc)
    # Try to send email
    email_sent = False
    if RESEND_API_KEY:
        try:
            params = {
                "from": os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev'),
                "to": [CONTACT_EMAIL],
                "subject": f"TechTribe Əlaqə: {data.subject or 'Yeni mesaj'}",
                "html": f"""
                <h2>Yeni Əlaqə Mesajı</h2>
                <p><strong>Ad:</strong> {data.name}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Telefon:</strong> {data.phone}</p>
                <p><strong>Mövzu:</strong> {data.subject}</p>
                <p><strong>Mesaj:</strong> {data.message}</p>
                """
            }
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
        except Exception as e:
            logger.error(f"Email göndərilə bilmədi: {e}")
    return {"message": "Mesajınız qəbul edildi", "id": doc["id"], "email_sent": email_sent}

@api_router.get("/messages")
async def get_messages(user=Depends(get_current_user)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages

@api_router.put("/messages/{msg_id}/read")
async def mark_message_read(msg_id: str, user=Depends(get_current_user)):
    result = await db.contact_messages.update_one({"id": msg_id}, {"$set": {"is_read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj tapılmadı")
    return {"message": "Oxundu kimi işarələndi"}

@api_router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, user=Depends(get_current_user)):
    result = await db.contact_messages.delete_one({"id": msg_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj tapılmadı")
    return {"message": "Mesaj silindi"}


# ============ CHAT ROUTES ============

@api_router.post("/chat/send")
async def send_chat_message(data: ChatMessageCreate):
    # Find or create conversation
    convo = await db.chat_conversations.find_one({"session_id": data.session_id}, {"_id": 0})
    if not convo:
        convo = {
            "id": str(uuid.uuid4()),
            "session_id": data.session_id,
            "user_name": data.user_name,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_conversations.insert_one(convo)

    # Save user message
    user_msg = {
        "id": str(uuid.uuid4()),
        "conversation_id": convo["id"],
        "sender": "user",
        "content": data.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(user_msg)

    # Update conversation timestamp
    await db.chat_conversations.update_one(
        {"id": convo["id"]},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat(), "user_name": data.user_name}}
    )

    # Generate AI response
    ai_response = await generate_ai_response(convo["id"], data.message)

    # Save AI message
    ai_msg = {
        "id": str(uuid.uuid4()),
        "conversation_id": convo["id"],
        "sender": "bot",
        "content": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(ai_msg)

    return {
        "reply": ai_response,
        "conversation_id": convo["id"],
        "message_id": ai_msg["id"]
    }

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    convo = await db.chat_conversations.find_one({"session_id": session_id}, {"_id": 0})
    if not convo:
        return {"messages": [], "conversation_id": None}
    messages = await db.chat_messages.find(
        {"conversation_id": convo["id"]}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return {"messages": messages, "conversation_id": convo["id"]}

@api_router.get("/chat/conversations")
async def get_conversations(user=Depends(get_current_user)):
    convos = await db.chat_conversations.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    # Add last message and unread count for each
    for convo in convos:
        last_msg = await db.chat_messages.find(
            {"conversation_id": convo["id"]}, {"_id": 0}
        ).sort("created_at", -1).limit(1).to_list(1)
        convo["last_message"] = last_msg[0]["content"] if last_msg else ""
        msg_count = await db.chat_messages.count_documents({"conversation_id": convo["id"]})
        convo["message_count"] = msg_count
    return convos

@api_router.get("/chat/conversations/{convo_id}/messages")
async def get_conversation_messages(convo_id: str, user=Depends(get_current_user)):
    messages = await db.chat_messages.find(
        {"conversation_id": convo_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return messages

@api_router.post("/chat/conversations/{convo_id}/reply")
async def admin_reply_to_chat(convo_id: str, data: AdminChatReply, user=Depends(get_current_user)):
    convo = await db.chat_conversations.find_one({"id": convo_id}, {"_id": 0})
    if not convo:
        raise HTTPException(status_code=404, detail="Söhbət tapılmadı")
    admin_msg = {
        "id": str(uuid.uuid4()),
        "conversation_id": convo_id,
        "sender": "admin",
        "content": data.content,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(admin_msg)
    await db.chat_conversations.update_one(
        {"id": convo_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Cavab göndərildi", "id": admin_msg["id"]}


# ============ AI HELPER ============

async def generate_ai_response(conversation_id: str, user_message: str):
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage

        # Get conversation history
        history = await db.chat_messages.find(
            {"conversation_id": conversation_id}, {"_id": 0}
        ).sort("created_at", 1).to_list(20)

        system_msg = (
            "Sən TechTribe-ın süni intellekt köməkçisisən. TechTribe professional veb-saytlar hazırlayır "
            "və hazır veb-sayt paketləri satır. Müştərilərə kömək et, suallarına cavab ver. "
            "Hər zaman Azərbaycan dilində cavab ver. Professional, dostcanlı və bilikli ol. "
            "Cavablarını qısa və aydın tut (2-3 cümlə). TechTribe haqqında: "
            "Biz Biznes Sayt (499 AZN), E-Ticarət (999 AZN), Landing Səhifə (299 AZN), "
            "Portfolio (399 AZN), Korporativ (799 AZN) və Startup (599 AZN) paketləri təklif edirik."
        )

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"techtribe-{conversation_id}",
            system_message=system_msg
        )
        chat.with_model("anthropic", "claude-sonnet-4-5-20250929")

        msg = UserMessage(text=user_message)
        response = await chat.send_message(msg)
        return response

    except Exception as e:
        logger.error(f"AI xətası: {e}")
        return "Salam! TechTribe-a xoş gəlmisiniz. Sizə necə kömək edə bilərəm? Veb-sayt paketlərimiz haqqında məlumat almaq və ya sifariş vermək üçün buradayam."


# ============ DASHBOARD ROUTES ============

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user=Depends(get_current_user)):
    total_products = await db.catalogue_items.count_documents({"is_active": True})
    total_messages = await db.contact_messages.count_documents({})
    unread_messages = await db.contact_messages.count_documents({"is_read": False})
    total_chats = await db.chat_conversations.count_documents({})
    total_users = await db.admin_users.count_documents({})
    return {
        "total_products": total_products,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "total_chats": total_chats,
        "total_users": total_users
    }


# ============ SEED DATA ============

@api_router.post("/seed")
async def seed_data():
    existing = await db.catalogue_items.count_documents({})
    if existing > 0:
        return {"message": "Data artıq mövcuddur", "count": existing}

    items = [
        {
            "id": str(uuid.uuid4()),
            "title": "Biznes Veb Sayt",
            "description": "Professional biznes veb saytı hazırlanması. Müasir dizayn, mobil uyğunluq, SEO optimallaşdırma və CMS idarəetmə paneli daxildir. Şirkətinizin onlayn imicini gücləndirin.",
            "short_description": "Şirkətiniz üçün professional və müasir veb sayt",
            "features": ["Responsive dizayn", "SEO optimallaşdırma", "CMS paneli", "Əlaqə forması", "Xəritə inteqrasiyası", "Sosial media bağlantıları"],
            "technologies": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
            "price": 499,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/biznes",
            "category": "Biznes",
            "is_featured": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "E-Ticarət Platforması",
            "description": "Tam funksional e-ticarət platforması. Məhsul idarəetməsi, ödəniş sistemi, sifariş izləmə, müştəri hesabları və analitika daxildir. Onlayn satışlarınızı artırın.",
            "short_description": "Güclü e-ticarət həlli ilə onlayn satışa başlayın",
            "features": ["Məhsul kataloqu", "Ödəniş sistemi", "Sifariş izləmə", "Müştəri hesabları", "Analitika paneli", "Stok idarəetməsi"],
            "technologies": ["Next.js", "Stripe", "PostgreSQL", "Redis"],
            "price": 999,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/ecommerce",
            "category": "E-Ticarət",
            "is_featured": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Landing Səhifə",
            "description": "Yüksək konversiya dərəcəli landing səhifə. A/B testləmə, analitika inteqrasiyası və CTA optimallaşdırması ilə müştərilərinizi cəlb edin.",
            "short_description": "Effektiv landing səhifə ilə müştəri cəlb edin",
            "features": ["Yüksək konversiya dizayn", "A/B testləmə", "Analitika", "Forma inteqrasiyası", "Sürətli yüklənmə", "Animasiyalar"],
            "technologies": ["React", "Framer Motion", "Tailwind CSS", "Vercel"],
            "price": 299,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80", "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/landing",
            "category": "Landing",
            "is_featured": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Portfolio Saytı",
            "description": "Yaradıcı portfolio veb saytı. İşlərinizi professional şəkildə nümayiş etdirin. Qalerya, blog, CV bölməsi və əlaqə forması ilə tam həll.",
            "short_description": "İşlərinizi dünyaya göstərin",
            "features": ["İş nümunələri qalereyası", "Blog sistemi", "CV/Resume bölməsi", "Əlaqə forması", "Animasiyalı keçidlər", "Qaranlıq/İşıqlı tema"],
            "technologies": ["Vue.js", "Nuxt", "Prisma", "Tailwind CSS"],
            "price": 399,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80", "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/portfolio",
            "category": "Portfolio",
            "is_featured": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Korporativ Həll",
            "description": "Enterprise səviyyəli korporativ veb həll. Çoxdilli dəstək, təhlükəsizlik sertifikatı, API inteqrasiyaları və xüsusi funksionallıq ilə tam korporativ paket.",
            "short_description": "Böyük şirkətlər üçün enterprise həll",
            "features": ["Çoxdilli dəstək", "API inteqrasiyaları", "Təhlükəsizlik", "Xüsusi CRM", "Hesabat sistemi", "7/24 Dəstək"],
            "technologies": ["Next.js", "TypeScript", "AWS", "Docker", "Kubernetes"],
            "price": 799,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/corporate",
            "category": "Korporativ",
            "is_featured": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Startup Paketi",
            "description": "Startaplar üçün xüsusi paket. MVP inkişafı, sürətli prototipləmə, istifadəçi analitikası və miqyaslana bilən arxitektura ilə startapınızı uğurla başladın.",
            "short_description": "Startapınızı sürətlə bazara çıxarın",
            "features": ["MVP inkişafı", "Prototipləmə", "İstifadəçi analitikası", "Miqyaslana bilən", "CI/CD pipeline", "Bulud yerləşdirmə"],
            "technologies": ["React", "FastAPI", "MongoDB", "Docker", "AWS"],
            "price": 599,
            "currency": "AZN",
            "images": ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"],
            "demo_url": "https://demo.techtribe.az/startup",
            "category": "Startup",
            "is_featured": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    await db.catalogue_items.insert_many(items)
    return {"message": "Demo data əlavə edildi", "count": len(items)}


# ============ STARTUP ============

@app.on_event("startup")
async def startup():
    # Auto-seed if empty
    count = await db.catalogue_items.count_documents({})
    if count == 0:
        logger.info("Seeding demo data...")
        items = [
            {
                "id": str(uuid.uuid4()),
                "title": "Biznes Veb Sayt",
                "description": "Professional biznes veb saytı hazırlanması. Müasir dizayn, mobil uyğunluq, SEO optimallaşdırma və CMS idarəetmə paneli daxildir.",
                "short_description": "Şirkətiniz üçün professional və müasir veb sayt",
                "features": ["Responsive dizayn", "SEO optimallaşdırma", "CMS paneli", "Əlaqə forması", "Xəritə inteqrasiyası", "Sosial media"],
                "technologies": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
                "price": 499, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"],
                "demo_url": "#", "category": "Biznes", "is_featured": True, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "E-Ticarət Platforması",
                "description": "Tam funksional e-ticarət platforması. Məhsul idarəetməsi, ödəniş sistemi, sifariş izləmə və analitika daxildir.",
                "short_description": "Güclü e-ticarət həlli ilə onlayn satışa başlayın",
                "features": ["Məhsul kataloqu", "Ödəniş sistemi", "Sifariş izləmə", "Müştəri hesabları", "Analitika", "Stok idarəetməsi"],
                "technologies": ["Next.js", "Stripe", "PostgreSQL", "Redis"],
                "price": 999, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"],
                "demo_url": "#", "category": "E-Ticarət", "is_featured": True, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Landing Səhifə",
                "description": "Yüksək konversiya dərəcəli landing səhifə. A/B testləmə və analitika inteqrasiyası ilə.",
                "short_description": "Effektiv landing səhifə ilə müştəri cəlb edin",
                "features": ["Yüksək konversiya dizayn", "A/B testləmə", "Analitika", "Forma inteqrasiyası", "Sürətli yüklənmə", "Animasiyalar"],
                "technologies": ["React", "Framer Motion", "Tailwind CSS", "Vercel"],
                "price": 299, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80", "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"],
                "demo_url": "#", "category": "Landing", "is_featured": False, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Portfolio Saytı",
                "description": "Yaradıcı portfolio veb saytı. İşlərinizi professional şəkildə nümayiş etdirin.",
                "short_description": "İşlərinizi dünyaya göstərin",
                "features": ["Qalerya", "Blog", "CV bölməsi", "Əlaqə forması", "Animasiyalar", "Qaranlıq/İşıqlı tema"],
                "technologies": ["Vue.js", "Nuxt", "Prisma", "Tailwind CSS"],
                "price": 399, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80", "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80"],
                "demo_url": "#", "category": "Portfolio", "is_featured": True, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Korporativ Həll",
                "description": "Enterprise səviyyəli korporativ veb həll. Çoxdilli dəstək və API inteqrasiyaları ilə.",
                "short_description": "Böyük şirkətlər üçün enterprise həll",
                "features": ["Çoxdilli dəstək", "API inteqrasiyaları", "Təhlükəsizlik", "CRM", "Hesabat sistemi", "7/24 Dəstək"],
                "technologies": ["Next.js", "TypeScript", "AWS", "Docker", "Kubernetes"],
                "price": 799, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"],
                "demo_url": "#", "category": "Korporativ", "is_featured": False, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Startup Paketi",
                "description": "Startaplar üçün xüsusi paket. MVP inkişafı və sürətli prototipləmə ilə bazara çıxın.",
                "short_description": "Startapınızı sürətlə bazara çıxarın",
                "features": ["MVP inkişafı", "Prototipləmə", "Analitika", "Miqyaslana bilən", "CI/CD", "Bulud yerləşdirmə"],
                "technologies": ["React", "FastAPI", "MongoDB", "Docker", "AWS"],
                "price": 599, "currency": "AZN",
                "images": ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"],
                "demo_url": "#", "category": "Startup", "is_featured": True, "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.catalogue_items.insert_many(items)
        logger.info(f"Seeded {len(items)} catalogue items")


# ============ APP SETUP ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
