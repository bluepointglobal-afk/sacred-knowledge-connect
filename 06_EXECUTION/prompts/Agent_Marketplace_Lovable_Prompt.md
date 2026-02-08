# Lovable Builder Prompt — Agent Marketplace (Upwork-like for AI Agents)

You are Lovable AI Builder. Build a production-ready MVP web app called **Agent Marketplace**: an Upwork-style marketplace where **clients** hire **AI agents** (people/teams offering agent services or deployable agents) to complete tasks.

## 0) North Star
Create a trustworthy marketplace that:
- Lets clients quickly **discover agents**, **post jobs**, **receive bids**, and **hire with escrow**.
- Lets agents **showcase skills/portfolio**, **apply/bid**, **chat**, and **get paid**.
- Supports **fixed-price** and **hourly** engagements.

Deliver an MVP that can ship: responsive UI, authentication, core CRUD, messaging, reviews, payments scaffolding, and robust permissions.

---

## 1) Platform Overview
### What it is
A two-sided platform:
- **Clients** post work and hire.
- **Agents** create profiles and bid/apply.

### Who uses it
- Startups, founders, PMs, ops teams needing AI automation.
- Independent AI engineers/consultants offering agent builds and execution.

### Why it exists
- Centralizes discovery and trust signals (ratings, verified identity, portfolio).
- Provides safe hiring via **contracts + escrow**.
- Makes repeatable agent work purchasable like services.

---

## 2) User Personas & Key Jobs-To-Be-Done
### Persona A — Client
Goals:
- Find qualified agent fast.
- Post a clear job, compare bids, hire with confidence.
- Track delivery, communicate, release funds, leave reviews.

Primary actions:
- Browse/search agents
- Post job
- Review bids
- Create contract + fund escrow
- Chat
- Approve milestones / release payment
- Rate/review agent

### Persona B — Agent
Goals:
- Present skills and proof of work.
- Find relevant jobs, bid quickly.
- Convert bids to contracts.
- Deliver work and get paid.

Primary actions:
- Create/maintain profile
- Add skills, pricing, portfolio
- Apply/bid
- Chat
- Track contracts, submit milestones/time
- Receive reviews

---

## 3) Core Feature Set (MVP)
### A) Agent Profiles
Include:
- Name, headline, avatar
- Bio/description
- Skills tags (e.g., RAG, tooling, LangChain, OpenAI, automation)
- Pricing model: hourly rate + optional fixed-price “packages”
- Average rating + review count
- Portfolio items (links, screenshots, short case studies)
- Badges: verified email, verified identity (placeholder), “Top Rated” (computed)

### B) Job Posting & Listing
- Clients create job: title, description, required skills, budget (fixed) OR hourly range, expected timeline, attachments/links.
- Job listing page: filter by category/skills, budget type, recency.
- Job detail: show bids/applications, recommended agents, and “Invite agent” action.

### C) Bidding / Applying
- Agents submit a proposal: cover letter, estimated cost, timeline, relevant portfolio items, optional milestone breakdown.
- Client can accept proposal to create a contract.

### D) Matching / Recommendations
- On job detail page, show **recommended agents** based on overlapping skills and rating.
- On homepage, show “Recommended jobs” for agents based on skills.

### E) Contracts + Escrow (Upwork-like)
Support two contract types:
1) **Fixed price with milestones**
   - Client funds escrow for each milestone (or total).
   - Agent submits milestone for approval.
   - Client approves → release payment.
2) **Hourly**
   - Track hours via manual time logs (MVP) with notes.
   - Weekly invoice summary; client pays captured payment method (MVP: manual “Mark as paid” fallback + Stripe plan).

Payments for MVP:
- Implement **payment flow UI + database states**.
- Integrate **Stripe** (recommended) with:
  - Client checkout to fund escrow (PaymentIntent)
  - Payouts to agents via Stripe Connect (Express) OR placeholder “payout pending” state if Connect not configured.

### F) Messaging
- In-app messaging between client and agent.
- Conversation created when:
  - Agent applies to job, OR
  - Client invites agent.
- Show unread counts, last message preview.

### G) Reviews & Ratings
- After contract completion, prompt both parties.
- Client → agent rating (1–5) + text review.
- Optional: agent → client rating (MVP: store but only show to agent).

### H) Billing Modes
- Fixed price (milestones)
- Hourly (rate + time logs)

---

## 4) Core Pages & Flows (wireframe-level)

### 4.1 Homepage (Agent Discovery)
Layout:
- Top nav: logo, search bar, “Find Agents”, “Find Jobs”, Messages, Dashboard, Profile menu.
- Hero: value prop + primary CTA (Client: “Post a Job”, Agent: “Create Agent Profile”).
- Featured agents grid:
  - Card: avatar, name, headline, skills chips, rating stars, hourly rate, “View Profile”.
- Filters sidebar or top filter row:
  - Skill tags multi-select
  - Hourly rate range
  - Rating threshold
  - Verified only
- Secondary section: “How it works” (Post → Proposals → Contract → Escrow → Review).

Acceptance:
- Search and filters update results.
- Agent cards link to profile.

### 4.2 Agent Profile Page
Sections:
- Header: avatar, name, headline, badges, rating summary.
- Tabs: Overview | Portfolio | Reviews
- Overview: bio, skills, pricing (hourly + packages), availability.
- Portfolio list: cards with title, summary, link.
- Reviews list: rating + text + job title.
- Actions:
  - Client: “Invite to Job” (select one of their open jobs) and “Message”.
  - Agent (owner): “Edit Profile”.

### 4.3 Job Listing Page
- List/table of jobs with quick metadata: title, budget type, budget, required skills, posted date.
- Filters: skills, budget type, min/max budget, status (open/closed).
- Click job → Job detail.

### 4.4 Job Detail Page
- Job description + attachments/links
- Required skills chips
- Budget details
- Client info (lightweight)
- CTA (Agent): “Submit Proposal”
- If client owner: proposals list with compare view
- Recommended agents module

### 4.5 Client Job Posting Flow (multi-step)
Step 1: Basics
- Title, description, category
Step 2: Requirements
- Skills tags, timeline
Step 3: Budget
- Fixed vs Hourly
- Fixed: amount + optional milestones
- Hourly: min/max hourly or fixed hourly rate
Step 4: Review & Publish

Acceptance:
- Draft saved automatically.
- Published job appears in listings.

### 4.6 Agent Bidding Flow
- From job detail, open proposal modal/page:
  - Cover letter
  - Select relevant portfolio items
  - Pricing:
    - Fixed: total + milestone plan
    - Hourly: hourly rate + estimate
  - Time estimate
- Submit → proposal visible to client; conversation created.

### 4.7 Contract / Payment Page
After client accepts proposal:
- Create contract with:
  - Contract type (fixed/hourly), start date, scope
  - Milestones (fixed) with escrow funding state per milestone
  - Hourly: time logs + weekly summary
- Payment box:
  - Fixed: “Fund Escrow” button per milestone (Stripe checkout) → status updates: Unfunded → Funded → Submitted → Approved → Released
  - Hourly: “Add payment method” + weekly invoice (MVP)
- Timeline/activity feed: proposals accepted, escrow funded, milestone submitted, payment released.

### 4.8 Dashboard (Client & Agent)
Role-aware dashboard tabs:
- Overview KPIs
- Jobs (client) / Proposals (agent)
- Contracts (both)
- Messages
- Payments

Dashboard widgets:
- Client: Open jobs, active contracts, pending approvals, spend.
- Agent: Open proposals, active contracts, pending milestones, earnings.

### 4.9 Reviews/Ratings Page
- After contract marked complete:
  - Client review form: stars + text + tags (quality, communication, timeliness)
  - Optional agent review of client
- Reviews display on agent profile.

---

## 5) Design Requirements
- Modern, professional, clean (neutral palette, high readability)
- Trust-building UI:
  - Verified badges
  - Ratings prominently
  - Clear pricing display
  - “Escrow protected” messaging on contract pages
- Mobile-responsive:
  - Cards stack, filters collapse to drawer
  - Sticky primary CTA on job detail/profile
- Accessibility:
  - Proper labels, keyboard navigation, sufficient contrast

---

## 6) Technical Notes (Lovable Implementation)

### 6.1 Stack
- **Frontend:** Lovable-generated React/Next.js style app
- **Backend:** **Supabase** (Postgres + Auth + Storage + Realtime)
- **Payments:** Stripe (PaymentIntents + optional Stripe Connect)

### 6.2 Authentication & Roles
- Supabase Auth (email magic link or password).
- On signup, user chooses role: `client` or `agent` (can support both later).
- Store role in `profiles`.

### 6.3 Database Schema (Supabase)
Create these tables (minimum):

**profiles**
- id (uuid, pk, matches auth.users)
- role (text: client|agent)
- full_name (text)
- avatar_url (text)
- headline (text)
- bio (text)
- hourly_rate (numeric)
- location (text, optional)
- verified_email (bool default true if auth)
- verified_identity (bool default false)
- created_at, updated_at

**skills**
- id (uuid, pk)
- name (text unique)

**profile_skills**
- profile_id (uuid fk profiles)
- skill_id (uuid fk skills)

**portfolio_items**
- id (uuid)
- profile_id (uuid fk)
- title (text)
- description (text)
- url (text)
- media_path (text, optional; Supabase Storage)
- created_at

**jobs**
- id (uuid)
- client_id (uuid fk profiles)
- title (text)
- description (text)
- budget_type (text: fixed|hourly)
- budget_fixed (numeric, nullable)
- budget_hourly_min (numeric, nullable)
- budget_hourly_max (numeric, nullable)
- status (text: draft|open|closed|in_contract)
- created_at, updated_at

**job_skills**
- job_id (uuid fk jobs)
- skill_id (uuid fk skills)

**proposals**
- id (uuid)
- job_id (uuid fk jobs)
- agent_id (uuid fk profiles)
- cover_letter (text)
- proposed_type (text: fixed|hourly)
- proposed_fixed_total (numeric, nullable)
- proposed_hourly_rate (numeric, nullable)
- timeline_text (text)
- status (text: submitted|withdrawn|accepted|rejected)
- created_at

**proposal_milestones** (optional but recommended)
- id (uuid)
- proposal_id (uuid fk proposals)
- title (text)
- amount (numeric)
- order_index (int)

**conversations**
- id (uuid)
- job_id (uuid fk jobs, nullable)
- client_id (uuid fk profiles)
- agent_id (uuid fk profiles)
- created_at

**messages**
- id (uuid)
- conversation_id (uuid fk conversations)
- sender_id (uuid fk profiles)
- body (text)
- created_at
- read_at (timestamptz, nullable)

**contracts**
- id (uuid)
- job_id (uuid fk jobs)
- proposal_id (uuid fk proposals)
- client_id (uuid fk profiles)
- agent_id (uuid fk profiles)
- contract_type (text: fixed|hourly)
- status (text: active|paused|completed|cancelled)
- start_at (timestamptz)
- created_at

**contract_milestones**
- id (uuid)
- contract_id (uuid fk contracts)
- title (text)
- amount (numeric)
- status (text: unfunded|funded|submitted|approved|released)
- due_at (timestamptz, nullable)
- order_index (int)

**time_logs** (hourly MVP)
- id (uuid)
- contract_id (uuid fk contracts)
- agent_id (uuid fk profiles)
- minutes (int)
- note (text)
- logged_at (timestamptz)

**payments** (tracking/payment state)
- id (uuid)
- contract_id (uuid fk contracts)
- milestone_id (uuid fk contract_milestones, nullable)
- amount (numeric)
- currency (text default 'usd')
- provider (text default 'stripe')
- provider_payment_intent_id (text, nullable)
- status (text: requires_action|processing|succeeded|failed|refunded)
- created_at

**reviews**
- id (uuid)
- contract_id (uuid fk contracts)
- reviewer_id (uuid fk profiles)
- reviewee_id (uuid fk profiles)
- rating (int check 1-5)
- body (text)
- created_at

Computed views (optional):
- **agent_rating_summary** view: avg rating + count by agent.

### 6.4 Row Level Security (RLS) Rules (must-have)
Enable RLS and implement policies:
- profiles: user can read all public agent fields; user can update only own profile.
- jobs: anyone can read open jobs; only owner client can create/update their jobs.
- proposals: only agent owner can create; only involved client (job owner) and agent can read; only client can accept/reject.
- conversations/messages: only participants can read/write.
- contracts: only participants can read; client can change status (pause/cancel) and approve milestones; agent can submit milestones and create time logs.
- reviews: only participants can create after contract completion; public can read agent reviews.

### 6.5 Matching Logic (MVP)
Implement simple matching:
- For a job: rank agents by number of overlapping skills + rating.
- For an agent: recommend jobs by overlapping skills.

### 6.6 File Uploads
Use Supabase Storage buckets:
- `avatars` (public)
- `portfolio` (public)
- `job_attachments` (private or signed URLs)

### 6.7 Payments Implementation Notes
MVP-friendly approach:
- Store payment state in `payments` and `contract_milestones`.
- Stripe integration steps:
  - Client clicks “Fund escrow” → create PaymentIntent server-side and redirect/confirm.
  - On webhook success, mark milestone funded.
- If Stripe Connect not configured, keep payout as “pending” and show admin note.

---

## 7) MVP User Stories (Acceptance Criteria)
### Client
- Can sign up/log in and choose Client role.
- Can create and publish a job.
- Can view proposals and accept one.
- Can create a contract and fund at least one milestone (or mark as funded in test mode).
- Can message the agent.
- Can approve milestone submission and mark as released.
- Can leave a review after completion.

### Agent
- Can sign up/log in and choose Agent role.
- Can create/edit agent profile with skills, pricing, and portfolio.
- Can browse jobs and submit proposals.
- Can message client.
- Can view contract, submit milestone for approval (and add time logs for hourly).
- Can see reviews on profile.

### Platform
- Mobile responsive across all pages.
- Permissions enforced (no cross-tenant data leaks).
- Basic analytics cards on dashboards.

---

## 8) Seed Data & Empty States
- Provide seed skills list (20–40 common AI/automation skills).
- Empty states:
  - No agents found → suggest removing filters.
  - No jobs → prompt clients to post.
  - No messages → show “Start a conversation”.

---

## 9) Admin / Moderation (MVP-lite)
- Add an `is_admin` flag in profiles (default false).
- Admin can:
  - View all users/jobs/proposals
  - Hide a job or agent (soft delete: `status='hidden'`)

---

## 10) Build Instructions (what to generate)
Generate the full app with:
- Navigation + routing for all pages listed
- Supabase client setup, auth flows, protected routes
- CRUD UI wired to Supabase for profiles/jobs/proposals/contracts/messages/reviews
- Realtime messages via Supabase Realtime
- Stripe integration scaffolding + environment variables placeholders
- Clear UI states for: loading, error, empty

Name the app **Agent Marketplace** and implement the above as the initial MVP.
