# GhostBid — MVP Schema & Template Recommendation
**Date:** 2026-02-04  
**Status:** Ready for Architect Approval  
**Scope:** Database schema, tech stack, template selection

---

## Executive Summary

**Recommended Approach:** Fork **Hirezy** (open-source Upwork clone) + adapt for agents.

**Why Hirezy:**
- ✅ MIT-licensed, fully open-source (zero cost)
- ✅ Complete feature set (job posting, bidding, contracts, payments, messaging, reviews)
- ✅ Modern stack: React/Redux + Node/Express + PostgreSQL + Kafka + Socket.IO
- ✅ Microservices architecture (scales for agent ecosystem)
- ✅ Includes Figma designs, API docs, ERD, Docker deployment
- ✅ 4 stars on GitHub (active, maintained)

**Effort:** Adapt existing schema (add agent fields) + modify UI for agent-specific workflows.

---

## Part 1: Template Comparison

### Option A: Hirezy (Open-Source) ⭐ **RECOMMENDED**

| Aspect | Details |
|--------|---------|
| **Cost** | $0 (MIT License) |
| **Completeness** | 90% feature-complete for Upwork-style platform |
| **Tech Stack** | React/Redux, Node.js/Express, PostgreSQL, Kafka, Socket.IO, Firebase auth |
| **Architecture** | Microservices (user, job, messaging, payment, rating services) |
| **Deployment** | Docker, AWS/Heroku ready |
| **Documentation** | Figma designs, API docs (Postman), ERD, Microservice diagram |
| **Customization** | High (open-source = full source code access) |
| **Time to MVP** | 4-6 weeks (adapt schema + modify UI) |
| **Production-Ready** | Medium (solid foundation, needs testing for agents) |

**Sources:**
- GitHub: https://github.com/rameezrz/Hirezy
- Figma: https://www.figma.com/file/jYQT4TbH5ZFKQGFLxspJno/Hirezy
- API Docs: https://documenter.getpostman.com/view/27651295/2s9YeHZAYE
- Entity Relation Diagram: https://drive.google.com/file/d/1KFPdNmzRUR6mX3sZ8ohMQ3zMOggWiXNT/view

---

### Option B: Miracuves High-End Clone (Commercial)

| Aspect | Details |
|--------|---------|
| **Cost** | $5,000–$15,000 |
| **Completeness** | 99% (production-grade) |
| **Tech Stack** | Laravel / Node.js / MERN (customizable) |
| **Customization** | Medium (source code provided, but vendor support required) |
| **Time to MVP** | 2-4 weeks (mostly plug-and-play) |
| **Production-Ready** | High |
| **Support** | White-label, dedicated support |

**Verdict:** Too expensive for MVP phase. Worth reconsidering post-Series A.

---

### Option C: WordPress Theme (Prolancer / FreelanceEngine)

| Aspect | Details |
|--------|---------|
| **Cost** | $50–$200 (one-time) |
| **Completeness** | 60% (basic Upwork features) |
| **Tech Stack** | WordPress + PHP |
| **Customization** | Limited (plugin/theme constraints) |
| **Time to MVP** | 2-3 weeks (configuration-heavy) |
| **Production-Ready** | Low (not scalable for agent ecosystem) |

**Verdict:** Too limited. WordPress doesn't handle microservices needed for agent coordination.

---

## Part 2: Recommended Tech Stack (Hirezy-Based)

### **Frontend**
- **Framework:** React 18+ (Hirezy standard)
- **State Management:** Redux Toolkit (or Zustand for simplification)
- **Mobile:** React Native (Phase 2) — reuse logic layer, new UI layer
- **Styling:** Tailwind CSS or Material-UI
- **Real-time:** WebSocket (Socket.IO)

### **Backend**
- **Runtime:** Node.js (LTS 18+)
- **Framework:** Express.js (or NestJS for stricter typing)
- **Database:** PostgreSQL (Hirezy standard)
- **Message Broker:** Kafka or Redis (async job processing)
- **Auth:** Firebase Auth (existing Hirezy integration) OR JWT + custom sessions

### **Services Architecture** (Microservices)
1. **User Service:** Registration, profiles, agent credentials
2. **Job Service:** CRUD jobs, search/filtering, categories
3. **Bidding Service:** Bid placement, winner selection, contract creation
4. **Messaging Service:** Real-time chat (Socket.IO), notifications
5. **Payment Service:** Stripe integration, escrow handling, payouts
6. **Rating Service:** Reviews, ratings, dispute resolution
7. **Agent Service:** (NEW) Agent capabilities, lineage, verification status

### **External Services**
- **Payments:** Stripe (existing in Hirezy)
- **Email:** SendGrid (existing in Hirezy)
- **SMS/OTP:** Twilio (existing in Hirezy)
- **File Storage:** Cloudinary or AWS S3
- **Logging:** ELK Stack or CloudWatch

### **Deployment**
- **Containerization:** Docker (Dockerfile for each service)
- **Orchestration:** Docker Compose (local) → Kubernetes (production)
- **Hosting:** AWS (EC2, RDS, ElastiCache) or DigitalOcean
- **CI/CD:** GitHub Actions or GitLab CI

---

## Part 3: Database Schema (Agent Ecosystem Adaptations)

### **Core Hirezy Tables (Existing)**
```sql
-- Users (unchanged core, add agent fields)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Jobs (unchanged core)
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2),
  category VARCHAR(100),
  status VARCHAR(50), -- 'open', 'assigned', 'completed', 'cancelled'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bids (unchanged core)
CREATE TABLE bids (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  freelancer_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2),
  proposal_text TEXT,
  status VARCHAR(50), -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP
);

-- Contracts (unchanged core)
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  freelancer_id UUID REFERENCES users(id),
  milestone_amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP
);

-- Messages (unchanged core)
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP
);

-- Reviews (unchanged core)
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id),
  reviewed_user_id UUID REFERENCES users(id),
  rating INT (1-5),
  comment TEXT,
  created_at TIMESTAMP
);
```

### **NEW: Agent-Specific Tables**

```sql
-- Agent Profile (extends users table)
CREATE TABLE agent_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  agent_type VARCHAR(50), -- 'writing', 'development', 'design', 'research', 'automation', etc.
  capabilities TEXT[] (array of skill tags),
  lineage TEXT, -- "trained on dataset X, fine-tuned for task Y"
  model_version VARCHAR(50), -- e.g., "gpt-4-turbo", "claude-3-sonnet"
  benchmark_scores JSONB, -- {"speed": 0.95, "accuracy": 0.88, "cost_efficiency": 0.92}
  verification_status VARCHAR(50), -- 'unverified', 'pending', 'verified', 'certified'
  created_at TIMESTAMP
);

-- Agent Verification (track certifications)
CREATE TABLE agent_verifications (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agent_profiles(id),
  verification_type VARCHAR(50), -- 'benchmark', 'lineage', 'test_job', 'human_review'
  verified_by VARCHAR(100), -- 'platform_test', 'human_review_v1', etc.
  verified_at TIMESTAMP,
  expiry_date TIMESTAMP, -- renewal cycle
  score DECIMAL(3, 2) -- 0.0-1.0
);

-- Agent Capabilities (detailed skill matrix)
CREATE TABLE agent_capabilities (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agent_profiles(id),
  capability_name VARCHAR(100), -- 'web-scraping', 'blog-writing', 'image-generation'
  proficiency_level VARCHAR(50), -- 'basic', 'intermediate', 'expert'
  success_rate DECIMAL(3, 2), -- from completed jobs
  avg_time_hours DECIMAL(6, 2),
  avg_cost_per_task DECIMAL(8, 2)
);

-- Agent-to-Agent Relationships (for orchestration)
CREATE TABLE agent_relationships (
  id UUID PRIMARY KEY,
  orchestrator_agent_id UUID REFERENCES agent_profiles(id),
  specialist_agent_id UUID REFERENCES agent_profiles(id),
  relationship_type VARCHAR(50), -- 'delegates_to', 'relies_on', 'partner_with'
  success_count INT,
  failure_count INT,
  created_at TIMESTAMP
);

-- Jobs (extended for agent ecosystem)
-- ALTER TABLE jobs ADD COLUMN:
-- - agent_required BOOLEAN DEFAULT false
-- - min_verification_level VARCHAR(50) -- 'unverified', 'verified', 'certified'
-- - required_capabilities TEXT[]
-- - allowed_bidders VARCHAR(50) -- 'humans_only', 'agents_only', 'both'
-- - auto_accept_if_certified BOOLEAN DEFAULT false
```

### **Schema Diagram (Text Representation)**

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   users     │────────►│     jobs     │────────►│    bids      │
│ (core)      │         │ (core)       │         │ (core)       │
└─────────────┘         └──────────────┘         └──────────────┘
      │                        │                        │
      │                        │                        └──────────┐
      │                        │                                  │
      ▼                        ▼                                  ▼
┌──────────────────┐  ┌──────────────────┐              ┌────────────┐
│ agent_profiles   │  │ agent_capabilities│              │ contracts  │
│ (NEW)            │  │ (NEW)            │              │ (core)     │
│- capabilities[]  │  │- capability_name │              └────────────┘
│- lineage        │  │- proficiency     │
│- verification   │  │- success_rate    │
│- benchmarks     │  └──────────────────┘
└──────────────────┘
      │
      ▼
┌──────────────────────┐
│ agent_verifications  │
│ (NEW)               │
│- verification_type  │
│- verified_at        │
│- score              │
└──────────────────────┘
```

---

## Part 4: API Endpoints (MVP)

### **Existing Hirezy Endpoints** (leverage as-is)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/register` | POST | User registration |
| `/api/jobs` | GET/POST | List/create jobs |
| `/api/jobs/:id` | GET/PATCH | Job details/update |
| `/api/jobs/:id/bids` | GET/POST | List/place bids |
| `/api/contracts` | GET/POST | Contract management |
| `/api/messages` | WebSocket | Real-time messaging |
| `/api/reviews` | GET/POST | Ratings & reviews |

### **NEW: Agent-Specific Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agents` | GET/POST | List/register agents |
| `/api/agents/:id/profile` | GET/PATCH | Agent profile (capabilities, lineage) |
| `/api/agents/:id/verify` | POST | Trigger verification flow |
| `/api/agents/:id/benchmarks` | GET | Agent benchmark scores |
| `/api/agents/search` | GET | Search agents by capability |
| `/api/agents/:id/stats` | GET | Performance stats (jobs completed, rating, success rate) |

---

## Part 5: Implementation Checklist

### **Phase 1: Setup & Scaffolding** (Week 1)
- [ ] Clone Hirezy repository
- [ ] Set up development environment (Docker Compose, local PostgreSQL, Redis)
- [ ] Review Figma designs, API docs, ERD
- [ ] Identify customization points (where to add agent fields)
- [ ] Create branch: `ghostbid/agent-adaptation`

### **Phase 2: Schema Adaptation** (Week 2)
- [ ] Create migration scripts (add agent_profiles, agent_verifications, agent_capabilities tables)
- [ ] Extend user table with agent_type field
- [ ] Update jobs table (add agent_required, min_verification_level, allowed_bidders)
- [ ] Test migrations (local dev DB)

### **Phase 3: Backend Services** (Weeks 3-4)
- [ ] Create agent service (CRUD agent profiles, capabilities)
- [ ] Create verification service (benchmark tracking, status updates)
- [ ] Extend bidding logic (accept bids from agents)
- [ ] Extend payment service (handle agent payouts differently?)
- [ ] Add WebSocket handlers for agent notifications

### **Phase 4: Frontend Adaptations** (Weeks 5-6)
- [ ] Create agent registration flow (capabilities input, lineage field)
- [ ] Create agent dashboard (my profile, my bids, my jobs, stats)
- [ ] Modify job posting (client selects "agents only" or "humans + agents")
- [ ] Modify bidding UI (show agent verification badges)
- [ ] Create agent discovery page (search by capability)

### **Phase 5: Testing & Deployment** (Weeks 7-8)
- [ ] Unit tests for agent services
- [ ] Integration tests (agent registration → bidding → payment)
- [ ] Docker build + deployment (staging)
- [ ] Security audit (auth, payments, data)
- [ ] Beta launch with 20-50 founder agents

---

## Part 6: Customization Points (High-Priority)

### **1. Agent Registration Flow**
**Current (Hirezy):** Generic freelancer profile  
**Change:** Add agent-specific fields
- Agent name + description
- Capabilities (tags or structured form)
- Lineage (model info, training data)
- Model version + API key (if external agent)

### **2. Job Posting**
**Current (Hirezy):** Unspecified worker type  
**Change:** Allow clients to filter:
- "Humans only"
- "Agents only"
- "Both (fastest solution)"

### **3. Bidding Logic**
**Current (Hirezy):** Manual bid review  
**Change:** 
- Auto-accept agent bids if verified + price within range?
- Or always require client review?

### **4. Payment & Escrow**
**Current (Hirezy):** Milestone-based escrow (suited for longer projects)  
**Change:** 
- Micro-tasks (small bids, instant payment on delivery?)
- Or maintain milestone model for consistency?

### **5. Verification System**
**NEW:** Implement agent certification  
- Benchmark scores (accuracy, speed, cost)
- Lineage verification (model card checks)
- Test job results (agent completes sample task)
- Expiry + renewal cycles

---

## Part 7: Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users (Web + Mobile)                 │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼──────┐          ┌──────▼────┐
    │  React    │          │   React   │
    │  (Web)    │          │  Native   │
    │           │          │  (Mobile) │
    └────┬──────┘          └──────┬────┘
         │                        │
         └────────────┬───────────┘
                      │
         ┌────────────▼────────────────────────────┐
         │  API Gateway (Nginx/Kong)               │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┼──────────────────────┐
        │             │                      │
   ┌────▼────┐  ┌────▼────┐           ┌────▼────┐
   │  User   │  │   Job   │           │ Payment │
   │ Service │  │ Service │    ...    │ Service │
   └────┬────┘  └────┬────┘           └────┬────┘
        │            │                      │
        └────┬───────┴──────────────┬───────┘
             │                      │
        ┌────▼──────────────────────▼────┐
        │   PostgreSQL (Primary DB)       │
        └────────────────────────────────┘
             │              │
        ┌────▼────┐    ┌────▼────┐
        │  Redis  │    │  Kafka  │
        │ (Cache) │    │ (Events)│
        └─────────┘    └─────────┘
```

---

## Part 8: Cost Estimate (First Year)

| Component | Estimated Cost | Notes |
|-----------|----------------|-------|
| **Infrastructure (AWS)** | $5,000–$10,000 | EC2, RDS, S3, CloudFront |
| **Third-Party APIs** | $1,000–$2,000 | Stripe, SendGrid, Twilio |
| **Team (Dev + DevOps)** | $100,000–$200,000 | 2 months full-time |
| **Domain + SSL** | $100 | Annual |
| **Monitoring (DataDog)** | $500 | Optional, can use free tier |
| **Total** | **~$106,600–$212,600** | For MVP launch |

---

## Part 9: Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **Agent fraud** (fake credentials) | Implement benchmark verification + human review for high-value jobs |
| **Payment disputes** | Clear escrow policy + automated refund triggers |
| **Scale bottleneck** | Microservices + Kafka for async processing |
| **Regulatory** (if agents are classified as employees) | Legal review for contractor vs. employee status |
| **Security** (API keys, payments) | Regular penetration testing + compliance (SOC 2, PCI-DSS) |

---

## Part 10: Next Steps (Awaiting Architect Approval)

1. **Approve Hirezy as base?** → Proceed with fork + customization
2. **Timeline preference?** → 8 weeks full-time? Parallel with other projects?
3. **Team assignment?** → Who leads backend, who leads frontend?
4. **Launch scope?** → Beta (20 agents) or broader launch?
5. **Verify payment model?** → 10% commission on all transactions?

---

## Decision Summary

| Question | Answer |
|----------|--------|
| **Template** | Hirezy (open-source) |
| **Tech Stack** | React, Node.js, PostgreSQL, Kafka, Socket.IO |
| **Effort** | 8 weeks (adapting existing Hirezy) |
| **Cost to Build** | ~$100-200K (team, infrastructure) |
| **Cost to Buy (Miracuves)** | $5-15K (premade, but less customizable) |

**Recommendation:** Use Hirezy. It's free, complete, well-documented, and open-source — perfect for rapid MVP iteration.

---

**Status:** Ready for Architect decision on template + timeline.
