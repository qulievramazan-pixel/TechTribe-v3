# TechTribe - Product Requirements Document

## Original Problem Statement
Build a high-end, premium digital agency website for TechTribe - builds professional websites, deploys them, sells ready-to-use website packages. Dark premium theme, Azerbaijani language, AI chatbot, admin panel.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: Claude Sonnet 4.5 via emergentintegrations (Emergent LLM Key)
- **Auth**: JWT with bcrypt password hashing
- **Email**: Resend (configured, needs API key for real sending)

## What's Been Implemented

### V2 Redesign (Feb 2026)
- **Gradient text effects** (text-gradient class with blue→cyan→violet)
- **Glass morphism** everywhere (glass-card, glass-panel)
- **Logo overlay cinematic animation** on page transitions
- **Floating tech icon orbit** on hero section with center "TT" logo
- **Tech marquee** scrolling band
- **Bento grid stats** in "What We Deliver" section
- **Premium card hover effects** with gradient border reveal
- **Shimmer button effect** on CTAs
- **Dot/grid pattern overlays** for visual depth
- **Navbar scroll effect** with glass blur transition
- **Active link indicator** with spring animation

### Backend (unchanged from V1)
- JWT auth (register/login/me) - 100% passing
- Catalogue CRUD, Contact messages, Chat system, Dashboard stats
- AI chatbot with Claude Sonnet 4.5
- Auto-seeding 6 demo catalogue items

### Frontend Pages
- Home (8 sections), About, Catalogue, CatalogueDetail, Contact, Auth, Admin

### Testing Results V2
- Backend: 92.9% (AI timeout expected)
- Frontend: 95% (chat widget fixed)

## Prioritized Backlog
### P1
- Resend API key for real email
- WebSocket for real-time chat
- Image upload for catalogue items
### P2
- Multi-language support
- Blog section
- Analytics charts
- About page editable from admin
