# Workspace Structure (drop zones)

This workspace is organized for fast intake → triage → execution → artifacts.

## 00_INBOX/
**Default landing zone** for anything new.
- `repos/` — git repos you just copied in (before sorting)
- `zips/` — compressed drops
- `docs/` — random PDFs/notes not yet classified
- `assets/` — images, videos, raw media

## 01_CHARTERS/
Identity + doctrine.
- Put: `TIM_CHARTER.md`, `ARCHITECT_CHARTER.md`, operating rules, colony rules.

## 02_PORTFOLIO/
Portfolio-level control.
- `projects/` — one folder per initiative (brief + status)
- `roadmaps/` — 30/60/90, quarterly plans
- `kpis/` — dashboards, KPI definitions, metric snapshots

## 03_REPOS/
**Canonical location** for active codebases.
- Put: `AFAQesg/` here once copied into workspace.

## 04_SPECS/
Specs by type.
- `prd/` — product requirement docs
- `tech/` — architecture, ADRs
- `ux/` — flows, copy, UI notes
- `api/` — endpoints, schemas, contracts

## 05_RESEARCH/
External intel.
- `market/` — market sizing, segments
- `competitors/` — teardowns
- `notes/` — working notes

## 06_EXECUTION/
Execution system.
- `plans/` — current plan of record
- `sprints/` — sprint logs
- `backlog/` — prioritized tasks
- `checklists/` — repeatable SOPs

## 07_OPS/
Operational reliability + security.
- `runbooks/` — how to run/deploy/restore
- `incidents/` — postmortems
- `security/` — threat model, policies (no secrets)

## 08_ARTIFACTS/
Outputs meant to ship or share.
- `exports/` — generated exports
- `deliverables/` — client-ready packages
- `media/` — finalized media

## 09_ARCHIVE/
Retired/old material.

---

## Drop Rules (simple)
1) **If unsure → `00_INBOX/`** (I’ll triage).
2) Repos you’re actively working on live in **`03_REPOS/`**.
3) Anything “truth/authority” goes in **`01_CHARTERS/`**.
4) Anything meant to be sent out goes in **`08_ARTIFACTS/`**.
