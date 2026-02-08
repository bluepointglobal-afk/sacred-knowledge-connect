# Mawashi — Regulatory & Compliance Checklist (KSA livestock marketplace)
*This is a product-oriented checklist, not legal advice. Validate with Saudi counsel + MEWA/SFDA/ZATCA as needed.*

## 1) Business / platform compliance (baseline)
### 1.1 Entity, licensing, and contracts
- [ ] Decide operator role:
  - Classifieds-only (information service / listings)
  - Marketplace facilitator (payments/escrow)
  - Direct seller (inventory owner) or broker
- [ ] Entity formation + CR (Commercial Registration), bank account.
- [ ] Platform terms covering:
  - prohibited listings, fraud, fees/commission, dispute process
  - liability boundaries (esp. live animals)
  - data processing / privacy

### 1.2 VAT (ZATCA)
- [ ] Determine VAT registration requirements (thresholds, business model).
- [ ] If charging commission/fees, ensure VAT treatment is correct.
- [ ] Invoicing flows:
  - ZATCA highlights simplified invoicing conditions (Arabic; <1000 SAR invoices can omit VAT reg. number; must show VAT value).
  - Source: ZATCA VAT page. https://zatca.gov.sa/en/RulesRegulations/VAT/Pages/default.aspx
- [ ] E-invoicing (FATOORA) planning if VAT-registered (integration waves).

---

## 2) Livestock sector rules & ministry interactions (MEWA)
### 2.1 Livestock regulation direction (why it matters)
MEWA’s Animal Production directorate includes responsibilities around:
- developing livestock production regulations
- standards “from farm until the beginning of the marketing line”
- **registration/numbering and controlling movements** (coordination with other ministries)
Source: MEWA General Directorate of Animal Production page. https://www.mewa.gov.sa/en/Ministry/Agencies/AgencyLivestock/Departments/Pages/General%20Directorate%20of%20Animal%20Production.aspx

### 2.2 Animal welfare (GCC Animal Welfare Law)
- [ ] Marketplace policy: ban listings that imply cruelty/illegal practices.
- [ ] Content moderation for prohibited practices.
- [ ] Seller education: acceptable handling, transport, and marketing.

MEWA explicitly prohibits cruelty practices (examples include: tail docking/ear cropping etc. except medical necessity; and forbidden for any reason: dyeing animals; injectable cosmetic fillers like “Botox” esp. on camels; growth stimulants in races). Source: MEWA news (2018). https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx

### 2.3 Camel-specific: passport / identity & health records
- [ ] If trading camels: support attaching passport/microchip data and vaccination evidence.
- [ ] For ownership transfer workflows: capture identity of buyer/seller; record transfer events.

MEWA’s camel passport contains microchip number + identity details + vaccination table certified by a veterinarian (name/signature/stamp) and is meant to tighten controls over sales/transport/documentation. Source: Anadolu Agency summary citing MEWA statement. https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215

---

## 3) Food safety / veterinary compliance (live animal sales)
### 3.1 Health representation & claims
- [ ] Prohibit false health claims.
- [ ] If offering “verified health” badges, define:
  - what exam was done (who, when)
  - how long it remains valid
  - how disputes are handled

### 3.2 Slaughter & carcass services (if you expand into “direct sales”)
If the platform supports slaughtering/skinning/delivery (like some competitors):
- [ ] Ensure partner slaughterhouses are licensed.
- [ ] Ensure cold-chain / transport compliance for meat deliveries.
- [ ] Clear separation: live animal sale vs slaughter service vs meat sale (may change regulator obligations).

---

## 4) Payments & financial compliance (KSA reality)
### 4.1 Typical payment options to support
(Confirm availability and contracting requirements with each PSP.)
- Cards: Visa/Mastercard + **mada** (critical in KSA)
- Wallets: **Apple Pay** (common on iOS), STC Pay (if supported via gateway)
- Bank transfer options (often used for high-value trades)

### 4.2 Escrow / “trusted purchase” vs off-platform payment
- [ ] Decide whether to:
  - stay classifieds-only (no money handled)
  - offer deposits/reservations
  - offer escrow with delivery confirmation
- [ ] If handling funds, expect stronger KYC/AML obligations (PSP + bank requirements).

### 4.3 Chargebacks, disputes, and fraud
- [ ] Fraud rules and escalation
- [ ] Evidence collection in-app (chat logs, listing photos, vet docs)

---

## 5) Cross-border / GCC trade considerations (future)
- [ ] If enabling cross-border trading (export/import):
  - require exporter/importer identity and license info
  - require veterinary/export certificates and port-of-entry info
  - clarify who is “importer of record”
- [ ] Start domestic-first unless there’s a clear export wedge (camels, horses).

---

## 6) Product requirements derived from regulation (practical)
### 6.1 Data fields (minimum viable compliance)
- Seller: identity verification tier (phone + ID), seller type (individual/farm/trader)
- Listing: species, breed, age, sex, count, location, health notes
- Attachments: vet certificate (optional), passport/microchip (camels), pedigree docs (horses)

### 6.2 Audit trail
- Immutable record of:
  - listing edits
  - verification status changes
  - payments (if any)
  - disputes/resolutions

### 6.3 Moderation categories
- Animal cruelty / prohibited practices
- Misrepresentation / fraud
- Stolen animals / disputed ownership

---

## Appendix — Key sources referenced
- ZATCA VAT overview + simplified invoicing notes: https://zatca.gov.sa/en/RulesRegulations/VAT/Pages/default.aspx
- MEWA Animal Production directorate responsibilities: https://www.mewa.gov.sa/en/Ministry/Agencies/AgencyLivestock/Departments/Pages/General%20Directorate%20of%20Animal%20Production.aspx
- MEWA animal welfare / prohibited practices news: https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx
- Camel passport project details (MEWA statement via Anadolu): https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215
