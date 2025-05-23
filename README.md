# 📘 VitalPath Azure App

VitalPath is a deeply personalized, voice-first AI Health Coaching system designed for IRB research and future commercialization.
This system combines motivational interviewing, behavioral science, and agent-based AI to empower transformative health journeys.

## 🔧 Stack Overview

| Layer          | Tech Stack                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Frontend**   | Next.js (App Router), Tailwind CSS, TypeScript, Zustand, Framer Motion     |
| **Backend**    | Django (Auth, Admin, Research APIs), FastAPI (Audio STT, Real-time AI)     |
| **Database**   | PostgreSQL (Primary), Redis (optional for sessions)                        |
| **AI Services**| Azure OpenAI (GPT-4 Turbo), Azure Speech (STT/TTS)                         |
| **Infra**      | Docker, Azure Container Apps, Azure Bicep, GitHub Actions CI/CD            |

---

# 🚀 Getting Started

## 🖥️ Local Dev Setup (3 Containers)

```bash
# Start all services
docker-compose up --build

# Individual services (optional)
docker-compose up django
# or
cd backend/fastapi && uvicorn main:app --reload
```

## 📁 Monorepo Structure

```
/vitalpath-azure
├── frontend/             # Next.js frontend (App Router)
├── backend/
│   ├── django/           # Django admin, auth, IRB research APIs
│   └── fastapi/          # FastAPI: Real-time audio, coaching agent
├── infra/                # Bicep/Terraform/compose configs
├── docs/                 # Architecture, IRB schema, user flows
└── README.md             # You're here
```

---

# ✅ Milestone Checklist (8-hr Sprints)

### ✅ Milestone 1: Repo + Frontend + Django Init
- [x] GitHub repo created, structure committed
- [x] Next.js frontend initialized with Tailwind & Zustand
- [x] Django initialized, PostgreSQL planned
- [x] Azure PostgreSQL Flexible Server provisioned
- [x] Azure Key Vault + environment secrets prepped

### ✅ Milestone 2: FastAPI for Voice + Docker Compose
- [x] FastAPI scaffolding complete (`/healthz`, `/voice/transcribe`)
- [x] Docker Compose orchestrates Django + FastAPI + PostgreSQL
- [x] Shared .env and JWT coordination across Django + FastAPI

### ✅ Milestone 3: Add Django + PostgreSQL Integration
- [x] Django + psycopg2 database connection validated
- [x] PostgreSQL container or Azure DB provisioned
- [x] Django models and admin panel reflect IRB data model
- [x] Superuser account created, admin site reachable

### 🟩 Milestone 4: User Flow (Register → Consent → Discovery → Dashboard)
- [x] Scaffolded `users` app with custom user model
- [x] Installed DRF and SimpleJWT for JWT-based auth
- [x] Implemented `POST /api/users/register/`, `login/`, `me/`
- [x] Hooked up `/consent/`, `/discovery/` endpoints and frontend forms

### 🕒 Milestone 5: Infrastructure-as-Code (Azure Bicep)
- [ ] Setup `/infra/bicep/` directory
- [ ] Create `main.bicep` for Azure resources: Container Apps, DB, Key Vault
- [ ] Parameterize secrets and validate with `az bicep build`
- [ ] Create deployment README and `az deployment` instructions

### 🕒 Milestone 6: AI Voice Integration
- [ ] Azure Speech STT & TTS tested
- [ ] Live mic input via WebSocket or REST
- [ ] GPT-4 prompt seeded with user’s discovery data
- [ ] FastAPI `/chat/` responds with synthesized audio

---

# 📍 Next Steps
- IRB research data logging (PhDResearcherAgent)
- Azure Blob Storage + Key Vault integration
- GitHub Actions CI/CD → Azure Container App deployment

---


✅ Completed Admin Features
🔬 Research Data Export Functions

export_research_data - Comprehensive CSV export with all participant data
export_wellness_data - Wellness baselines only for statistical analysis
export_session_data - Session tracking data with user journey analytics
export_completion_funnel - JSON export with completion funnel analysis

📊 Enhanced Data Visualization

Wellness Chart Display: Visual baseline indicators with color-coded bars
Quality Score Badges: Color-coded completion quality indicators
Session Timeline: Visual progress through discovery sections
Technical Details: Parsed browser/device information

🎯 Key Research Admin Features

Data Quality Monitoring: Identify suspicious response patterns
Completion Analytics: Track user journey and drop-off points
Export Capabilities: Multiple formats for different analysis needs
Visual Data Display: Charts and graphs for quick insights

🚀 How to Use the Complete Admin
Step 1: Replace the Admin File








# 👨‍💼 Project Lead
**John-Eric Bonilla**  
PhD Candidate, Information Science – University of Arkansas at Little Rock

📧 jbonilla@ualr.edu  
🔗 [vitalpathinnovations.com](https://vitalpathinnovations.com)

---

> "VitalPath is not an app — it’s an intelligent companion guiding you toward your best self."
# Force rebuild Thu, May 22, 2025  4:41:38 PM
