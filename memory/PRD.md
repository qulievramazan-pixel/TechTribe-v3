# TechTribe - Product Requirements Document

## Original Problem Statement
Build a high-end, premium digital agency website for TechTribe - a company that builds professional websites, deploys them, and sells ready-to-use website packages. Dark premium theme, Azerbaijani language, AI chatbot, admin panel.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: Claude Sonnet 4.5 via emergentintegrations (Emergent LLM Key)
- **Auth**: JWT with bcrypt password hashing
- **Email**: Resend (configured, needs API key for real sending)

## User Personas
1. **Business Owners in Azerbaijan**: Looking for professional website solutions
2. **Admin/Staff**: Managing catalogue, messages, and chat conversations
3. **Visitors**: Browsing packages, contacting via form, chatting with AI

## Core Requirements (Static)
- Multi-page site: Home, About, Catalogue, CatalogueDetail, Contact
- Admin panel with Auth (register + login)
- Catalogue CRUD management
- Contact form with email notification
- AI-powered chatbot (Claude Sonnet 4.5)
- All visible text in Azerbaijani
- Dark premium theme (#02040A bg, #3B82F6 accent)
- Custom TechTribe SVG logo

## What's Been Implemented (Feb 9, 2026)
### Backend
- JWT auth (register/login/me)
- Catalogue CRUD (GET/POST/PUT/DELETE)
- Contact messages (create/list/read/delete)
- Chat system (send/history/conversations/reply)
- Dashboard stats endpoint
- AI chatbot with Claude Sonnet 4.5
- Auto-seeding 6 demo catalogue items
- Email via Resend (graceful fallback)

### Frontend
- Home page (7 sections: Hero, Why Us, How We Work, Tech Stack, Featured, CTA, Stats)
- About page (Story, Values, Team)
- Catalogue page (Grid with filters + search)
- CatalogueDetail page (Image gallery, features, technologies, pricing)
- Contact page (Form + company info + working hours)
- Auth page (Login + Register with tabs)
- Admin panel (Dashboard, Catalogue CRUD, Messages, Chat management)
- Navbar with logo animation
- Footer with links and contact info
- Floating AI chatbot widget
- Page transitions (Framer Motion)
- Custom TechTribe SVG logo

### Testing Results
- Backend: 100% (15/15 tests passed)
- Frontend: 95% (minor chat widget overlay fixed)

## Prioritized Backlog
### P0 (Critical)
- All core features implemented ✅

### P1 (Important - Next Phase)
- WebSocket for real-time chat (currently HTTP polling)
- Resend API key for real email sending
- Image upload for catalogue items
- About section content editable from admin

### P2 (Nice to Have)
- Multi-language support (Azerbaijani + English toggle)
- Blog/news section
- Analytics dashboard with charts (Recharts)
- SEO meta tags per page
- PWA support
- Admin role management

## Next Tasks
1. Add Resend API key for real email
2. WebSocket for real-time chat
3. Image upload functionality
4. Admin content management for About page
5. Enhanced analytics with charts
