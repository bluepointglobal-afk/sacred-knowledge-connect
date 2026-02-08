# AFAQ ESG — E2E Reproduction Runbook (v1)

Goal: reproduce the same “paid report” for **any new client** reliably (intake → generation → PDF pack).

## 0) Preconditions
- AFAQ app running (local or deployed)
- `OPENROUTER_API_KEY` set for Supabase edge function environment
- Test/pro user available (tier = `pro` or `enterprise`)

## 1) Intake (15–30 min)
Capture:
- Company name, industry/subsector, country, listed/unlisted
- Employee count, revenue band + currency
- Reporting period (last 12 months)
- Requested framework(s) (IFRS S1/S2, TCFD, GRI, local UAE/KSA/Qatar)
- Available evidence (docs + data sources)

Output:
- A completed `Company Profile` + initial metrics + narrative notes.

## 2) Data normalization
- Convert raw docs into a structured disclosure pack:
  - metrics table (code/value/unit)
  - narrative snippets per pillar
  - known gaps + severity

## 3) Generate disclosure sections (AI)
Trigger the edge function `generate_disclosure` with:
- `reportId`
- `disclosurePack` (profile + frameworks + outline + metrics + narratives + gaps)

Expected output:
- JSON with `sections[]` and `status: success`

**Failure mode to watch:**
- `status: success` but `sections: []` → usually missing/invalid `OPENROUTER_API_KEY` or upstream model error.

## 4) Assemble report pack
- Paste/merge generated sections into:
  - `REPORT_TEMPLATE_FULL_v1.html`
- Ensure all missing metrics are explicitly labeled ("Not available")

## 5) Export to PDF
- Chrome → Print → Save as PDF

## 6) Acceptance test (client-ready)
A new client can be processed end-to-end when:
- You can produce:
  - 1-page score/gap plan
  - a full report PDF (40–60 pages)
  - a 30/60/90 plan
  - a limitations + evidence register section
- No fabricated numbers exist; all figures have a source or are marked missing.

## 7) Log
For every run, create:
- `runs/YYYY-MM-DD_<client>_runlog.md` (inputs, outputs, issues, time-to-value)
