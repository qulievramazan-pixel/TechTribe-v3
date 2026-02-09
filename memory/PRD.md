# TechTribe — PRD

## Problem Statement
Premium digital agency website. Dark/light mode, splash screen, AI chatbot (Claude Sonnet 4.5), admin panel with hidden routes, user management, AI-powered search, admin secret code, contact form with email.

## Architecture
- Frontend: React + Tailwind CSS + Shadcn/UI + Framer Motion
- Backend: FastAPI + MongoDB
- AI: Claude Sonnet 4.5 via emergentintegrations
- Auth: JWT + bcrypt, admin_secret="elituqay"

## Implemented (Feb 2026)

### V3 Features
- Splash screen with logo animation + slogan "Ideyaları Koda Çeviririk"
- Dark/Light mode toggle (localStorage persisted)
- Hidden admin routes: /eliyaxsi (login), /tuqayyaxsi (admin panel)
- Products/Services page with 6 cards + pricing comparison table
- AI-powered catalogue search (multi-field scoring)
- Admin secret code "elituqay" for registration
- User management: view/block/delete/change role
- 8+ homepage sections with premium animations

### V2 Features
- Gradient text effects, glass morphism, orbit animations
- Logo overlay cinematic transition, shimmer buttons
- Tech marquee, bento grid stats, dot/grid patterns

### Backend (100% passing - 21/21 tests)
- JWT auth with admin_secret validation
- Catalogue CRUD + AI search
- Contact messages + email (Resend configured)
- Chat system + Claude Sonnet 4.5 AI
- User management (block/delete/role)
- Dashboard stats

### Pages
Home, About, Products, Catalogue, CatalogueDetail, Contact, Auth(eliyaxsi), Admin(tuqayyaxsi), Splash

## Test Results
- Backend: 100% (21/21)
- Frontend: 93%

## Backlog
P1: Resend API key, WebSocket chat, image upload
P2: Multi-language, Blog, Analytics charts, About editable from admin
