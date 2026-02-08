# Lovable Enhancement Prompt — Nabawi Scholars Landing Page (Design + UX Polish)

**Project URL (current build):** https://id-preview--cf95e86f-e192-4428-b5af-663defa88b23.lovable.app/

## 1) Current State (What Exists)

### Page structure & content
- **Top navigation:** Brand (“Nabawi Scholars.”) with links/buttons: Program, Contact, Partner Deck, Get Started.
- **Hero:** Dark patterned background; H1 “Transform Your Students' Journey at the Heart of Islam”; short value proposition; two CTAs (“Get the Free Partner Deck”, “Explore the Program”); trust bullets (Fully Supervised, Visa Facilitation, All‑Inclusive).
- **Sections:**
  - Program Formats (two cards: Full Immersion, Split Session)
  - What’s Included (5 feature cards)
  - Daily Routine (3 timeline-like cards)
  - Who This Program Is For (2 cards + regions served + quote)
  - Program Pricing (starting at $2,000 + list of inclusions)
  - Safety & Governance (6 feature cards + trust tags)
  - FAQ (accordion list)
  - Partner With Us (lead capture form)
- **Footer:** Brand blurb + program links + contact info + legal.

### What’s working
- Clear “institutional” offer and positioning (schools/youth orgs).
- Strong sectioning and logical narrative flow from value → formats → inclusions → trust → conversion.
- Repeated trust signals (safety, supervision, governance) appropriate for minors.
- Mobile experience is generally readable and vertically stacked.

### Key weaknesses / opportunities
**Visual hierarchy**
- Hero CTAs don’t feel strongly differentiated (primary vs secondary) and are visually competing.
- Several sections use similar card weight; the page can feel “samey” and long.
- Some small supporting text appears low-contrast on dark backgrounds.

**Typography & spacing**
- Heading scale feels slightly inconsistent between sections; some headings appear close in size/weight.
- Card internal spacing and line-height vary; some cards feel tight while others feel airy.
- Vertical rhythm between sections could be more consistent (padding/gaps).

**Component consistency**
- Card styles vary across sections (borders, shadows, icon sizing, header layouts).
- Buttons/inputs could be unified (radius, height, font weight, focus states).
- Icons and badges (checkmarks, numbered chips) feel slightly mismatched stylistically.

**Color system**
- Dark navy + gold is strong, but some accents (greens, grays) feel like defaults rather than a unified palette.
- Secondary backgrounds (light sections) are clean but could use subtle warmth to match brand.

**UX flows / conversion**
- Primary conversion intent seems to be “Partner Deck” request; CTA placement is good in hero and bottom form, but mid‑page CTA reinforcement could be stronger.
- “Program” and “Contact” in nav appear as buttons but may not scroll to anchored sections.

**Accessibility**
- Ensure WCAG contrast on dark hero and footer text.
- Accordion affordances (FAQ) need clear focus states and large hit targets.
- Form needs explicit error states, helper text, and keyboard navigation polish.

---

## 2) Design Principles / Goals

1. **Trustworthy, premium, calm:** A refined “institutional” look (credible, safe, well-governed) with warm, welcoming tone.
2. **Clear hierarchy & scannability:** Users should understand the offer within 5 seconds and scan sections quickly.
3. **Consistency via a tight design system:** Reuse tokens, components, and spacing rules.
4. **Conversion-forward, not pushy:** Make the Partner Deck request obviously the primary action throughout.
5. **Mobile-first and accessible:** Great readability, tap targets, focus states, and contrast.

---

## 3) Specific Improvements (Implement These)

### A) Visual hierarchy (layout + emphasis)
- **Hero:**
  - Make **one primary CTA** (Partner Deck) and one secondary CTA (Explore). Primary should be visually dominant (filled button), secondary outlined/ghost.
  - Add a short **supporting micro-headline** above H1 (already “Ages 12–17 • Madinah, Saudi Arabia”) and make it a distinct “eyebrow” style.
  - Tighten hero content width for readability (max 560–640px) and increase spacing between H1, body, CTAs.
  - Consider adding 1–2 credibility elements in hero: “All‑inclusive, supervised cohort program” + small “Trusted by …” placeholder (logos optional).
- **Section rhythm:**
  - Introduce alternating section backgrounds (subtle) to reduce monotony and improve scannability.
  - Ensure every major section has: eyebrow label → H2 → 1–2 lines of description → content grid.
- **Pricing block:**
  - Make pricing card a clear focal point with stronger typographic emphasis on “$2,000+ / student” and a sticky/inline CTA.

### B) Component consistency (systemize cards, buttons, forms)
- Establish and apply a consistent component library:
  - **Buttons:** 2 sizes (sm/md), consistent height (44–48px), radius (10–12px), font weight (600), icon optional.
  - **Cards:** one base card style with variants:
    - Default: subtle border + soft shadow on hover
    - Dark-section card: higher contrast border and slightly elevated background
  - **Icons:** unified style (same stroke width, size, and color usage). Avoid mixing filled + outline.
  - **Badges / chips:** consistent pill style for “✓ Fully Supervised” and for numbered features.
- Add **hover/active states** everywhere interactive: nav items, buttons, cards (if clickable), accordion headers.
- Ensure nav “Program” and “Contact” behave consistently (either links or buttons; ideally anchored links that scroll).

### C) Color scheme (refine palette + states)
- Keep brand direction: **Deep navy + gold accent**, but refine into tokens:
  - Primary background: Navy 900
  - Surface: Navy 800 (dark cards), White/Off‑white (light sections)
  - Primary accent: Gold 500 (CTAs, highlights)
  - Secondary accent: Emerald/Teal 500 (optional for success states only)
  - Neutral text: Slate/Gray scale
- Use gold intentionally: primary CTA, key highlights, small dividers—avoid overuse.
- Define semantic colors: success, warning, error, focus ring.

### D) Typography & spacing (readability + rhythm)
- Typography system (example targets):
  - H1: 44–56px desktop / 32–36px mobile, weight 600–700
  - H2: 28–34px desktop / 22–26px mobile
  - Body: 16–18px with 1.5–1.7 line-height
  - Small: 13–14px with improved contrast
- Improve **vertical rhythm**:
  - Section padding: 72–96px desktop, 48–64px mobile
  - Consistent spacing in cards (e.g., 20–24px padding)
- Limit line length on paragraphs to ~60–75 characters for comfort.

### E) Micro-interactions & animations (subtle, premium)
- Add tasteful motion:
  - Buttons: hover lift (translateY -1px), soft shadow increase, fast easing (150–200ms).
  - Cards: hover border color change + slight elevation.
  - FAQ accordion: smooth expand/collapse (height + opacity) and rotate chevron.
  - Smooth scroll for anchored nav links.
- Keep motion reduced for users with **prefers-reduced-motion**.

### F) Mobile responsiveness (polish + ergonomics)
- Ensure CTAs in hero are **stacked** with full-width primary button; secondary below.
- Increase spacing between stacked cards; avoid cramped icon/text alignment.
- Improve form usability:
  - Inputs at least 44px height
  - Clear labels above inputs (already present) + helper text
  - Country selector and student count selector should be easy to use on mobile.
- Consider a **sticky bottom CTA** on mobile (“Request Partner Deck”) after user scrolls past hero.

### G) Accessibility (WCAG 2.1 AA)
- Contrast:
  - Verify all text on navy backgrounds meets AA (4.5:1 for body, 3:1 for large text).
  - Ensure secondary text is not too faint.
- Focus states:
  - Visible focus ring (2px) with sufficient contrast on all interactive elements.
- Keyboard navigation:
  - FAQ accordion operable with Enter/Space and proper aria-expanded states.
  - Form fields fully navigable; dropdowns accessible.
- Hit targets:
  - Buttons/accordion headers at least 44px tall.
- Form validation:
  - Inline error messages, error color + icon, and aria-describedby linkage.

---

## 4) Examples / References (Direction, not exact copies)

- Overall feel: “premium educational program landing page” with strong trust/safety cues.
- UI patterns:
  - Stripe-style typographic hierarchy and spacing discipline.
  - Webflow/Framer premium landing pages: alternating section backgrounds, consistent card systems.
  - Gov/healthcare-like trust UX: clear badges, strong accessibility.

---

## 5) Success Criteria (Definition of Done)

1. **Hierarchy:** In 5 seconds, a user can answer: What is this? Who is it for? What do I do next?
2. **Consistency:** Cards, buttons, typography, and iconography look like one cohesive design system.
3. **Conversion:** Partner Deck CTA stands out as primary across hero, mid-page, and final form.
4. **Mobile polish:** No cramped sections; CTAs and form feel effortless on small screens.
5. **Accessibility:** Meets WCAG 2.1 AA for contrast, focus states, keyboard navigation, and form errors.
6. **Perceived quality:** Subtle micro-interactions make the page feel modern and premium without distraction.

---

## Copy‑Paste Instruction for Lovable Builder

**Please enhance the UI/UX design of this landing page while preserving all existing content and section order.** Focus on:
- A cohesive design system (typography scale, spacing tokens, button/card/input components)
- Stronger visual hierarchy (primary CTA dominance, clearer section rhythm)
- Refined navy + gold palette with accessible contrast
- Subtle premium micro-interactions (hover/accordion animations, smooth anchor scrolling)
- Mobile-first improvements (stacked hero CTAs, comfortable card spacing, form usability)
- WCAG 2.1 AA accessibility (contrast, focus rings, keyboard support, validation states)

Do not remove sections; only improve styling, spacing, and interaction details. Add anchor-link scrolling for nav items (Program → Program Formats section, Contact/Get Started → Partner With Us form).