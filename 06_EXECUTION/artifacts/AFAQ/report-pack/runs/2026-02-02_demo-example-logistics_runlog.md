# AFAQ Run Log — demo-example-logistics — 2026-02-02

## Summary
- Client: Example Logistics Co
- Jurisdiction: UAE
- Frameworks: IFRS S1/S2, TCFD, GRI (illustrative)
- Tier: pro/enterprise required for AI generation (demo pack built without live AI call)
- Outcome: PASS (report pack exported to A4 PDF)

## Inputs received
- Docs: (demo)
- Data: (demo)

## Execution
- Intake time: n/a (demo)
- Disclosure generation time: n/a (demo)
- PDF export time: ~<1 min (Chrome headless print)

## Outputs
- Full A4 PDF: `06_EXECUTION/artifacts/AFAQ/report-pack/exports/AFAQ_ESG_FULL_REPORT_DEMO_v1_A4.pdf`
- Source HTML: `06_EXECUTION/artifacts/AFAQ/report-pack/AFAQ_FULL_REPORT_DEMO_v1.html`

## Issues / Bugs
- Demo PDF is generated without a live AI section-fill; next step is to run the edge function end-to-end with a real disclosurePack payload.

## Next actions
- Run true E2E: app → intake → generate_disclosure → merge sections → export PDF.
