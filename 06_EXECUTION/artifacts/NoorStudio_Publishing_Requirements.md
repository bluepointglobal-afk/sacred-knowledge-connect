# NoorStudio Publishing Platform Requirements & Specifications

**Version:** 1.0  
**Date:** February 4, 2026  
**Purpose:** Comprehensive publishing industry standards research for streamlined multi-platform book publishing workflow

---

## 1. Publishing Platform Comparison Table

| Platform | File Formats | Cover Specifications | ISBN Requirements | Series Support | API Available? |
|----------|-------------|---------------------|-------------------|----------------|----------------|
| **Kindle Direct Publishing (KDP)** | **eBook:** EPUB, DOCX, HTML, RTF, TXT, PDF (no MOBI since 2025)<br>**Print:** PDF, DOCX | **eBook:** JPG/TIFF only, 2560×1600px ideal (min 1000px longest side), RGB, 50MB max<br>**Print:** PDF, CMYK, 300 DPI, 0.125" bleed | **eBook:** Optional (Amazon assigns free ASIN)<br>**Print:** Required (Amazon provides free ISBN or use your own) | ✅ Yes - Series name + number field in metadata | ❌ No official API (unofficial tools exist; Amazon Ads API only) |
| **Lulu** | **eBook:** EPUB<br>**Print:** PDF | **Print:** PDF, CMYK, 300 DPI, 0.125" (3mm) bleed all sides, 0.5" text safety margin | Free Lulu-assigned ISBN or supply your own | ✅ Yes - Metadata fields support series info | ❌ No public API documented |
| **Apple Books** | EPUB 3.3 (backwards compatible with older EPUB 3) | Embedded cover in EPUB + separate storefront image<br>Minimum 1400×2100px recommended<br>RGB, JPG/PNG | Required (must supply your own) | ✅ Yes - Series metadata supported | ⚠️ iTunes Producer exists (desktop tool, not REST API) |
| **IngramSpark** | **eBook:** EPUB<br>**Print:** PDF | PDF, CMYK, 300 DPI, 175 line screen<br>**Bleed:** 0.125" (3mm) standard; 0.625" (16mm) for hardcover wrap<br>Text safety: 0.25" (6mm) from trim | Required (must be unique, cannot reuse Amazon ISBN) | ✅ Yes - Metadata supports series | ❌ No public API |
| **Barnes & Noble Press** | **eBook:** EPUB, DOCX<br>**Print:** PDF (cover + interior) or DOCX (interior) | Images 300 DPI minimum<br>Print-ready PDF for covers | Optional for personal use; required for commercial sale | ✅ Likely (standard metadata fields) | ❌ No public API |
| **Smashwords** | **Primary:** DOCX (auto-converts)<br>**Alternative:** Direct EPUB upload | Embedded in EPUB or DOCX<br>Must follow 100+ page Style Guide | Optional | ✅ Yes - Distribution includes series metadata | ❌ No public API |

---

## 2. Detailed Platform Requirements

### 2.1 Kindle Direct Publishing (KDP)

**File Formats:**
- **eBooks:** EPUB (preferred), DOCX, HTML, RTF, TXT, PDF
- **MOBI deprecated** as of March 2025
- **Print Books:** PDF (print-ready) or DOCX (auto-formatted)

**Cover Specifications:**
- **eBook Covers:**
  - Format: JPG or TIFF only (PNG not supported)
  - Ideal dimensions: 2560×1600 pixels (1.6:1 ratio)
  - Minimum: 1000 pixels on longest side
  - Color mode: RGB
  - Max file size: 50MB
- **Print Covers:**
  - Format: PDF (one-piece: front + spine + back)
  - Color: CMYK, 300 DPI minimum
  - Bleed: 0.125 inches on all sides
  - Spine width: Calculated based on page count

**Metadata Requirements:**
- **Title:** Must match cover exactly, <200 characters including subtitle
- **Author:** Real name or pen name (no keywords)
- **Description:** HTML supported, no prohibited content (porn, contact info, reviews, ads)
- **ISBN:** Optional for eBooks (Amazon assigns ASIN); required for print
- **Series Support:** ✅ Series name + series number (digits only, e.g., "3" not "Book 3")
- **Categories:** BISAC categories required, must be relevant
- **Content Flags:** Mark sexually explicit content before category selection

**ISBN/ASIN Integration:**
- Every book gets unique 10-character **ASIN** (auto-generated)
- Print books need ISBN (free from Amazon or supply your own)
- Cannot change ISBN after print publication

**Royalty Tiers:**
- **eBooks:** 35% or 70% (delivery fees apply to 70%)
- **Print:** ~60% net after printing costs

**Publishing Checklist:**
1. Format manuscript (EPUB/DOCX recommended)
2. Create cover (2560×1600px JPG for eBook)
3. Enter metadata (title, author, description, categories)
4. Add to series (if applicable)
5. Set price and royalty rate
6. Preview before publishing
7. Publish (appears on Amazon within 72 hours)

---

### 2.2 Lulu (Print + eBook)

**Print-on-Demand Specifications:**
- **Trim Sizes:** Predefined only (no custom sizes)
  - Fiction: 6×9" (US Trade), 5.5×8.5" (Digest), A5 (5.83×8.27")
  - Nonfiction: 6×9" (US Trade), 7×10" (Executive), A4 (8.27×11.69")
  - Other: 4.25×6.875" (Pocketbook), 8.5×8.5" (Square), etc.
- **Bleed:** 0.125 inches (3mm) on all sides (interior + cover)
- **Resolution:** 300 DPI minimum
- **Text Safety Margin:** 0.5 inches inside trim edge
- **Gutter Margin:** 0.20 inches minimum (inner binding edge)
- **Spine Width:** Varies by page count (e.g., 0.625" for 85-140 pages)
- **Trim Tolerance:** 0.125 inches (no crop marks in files)

**eBook (EPUB) Requirements:**
- Standard EPUB format
- Follow Lulu's formatting basics (safety margins, no bleed for digital)

**ISBN Assignment:**
- **Free Lulu ISBN:** Automatically assigned and added to cover barcode
- **Custom ISBN:** Purchase your own for full control and wider distribution

**Cover Template Requirements:**
- PDF format for print
- Full wrap (front + spine + back)
- 0.125" bleed on all edges
- Barcode placement reserved (Lulu adds if using their ISBN)

**Metadata Fields:**
- Title, author, description
- Series name and number
- Author bio
- BISAC categories
- Publication date, price

**Integration API:**
- ❌ No public API documented (as of 2024/2025)
- Manual upload via dashboard

---

### 2.3 Apple Books (iBooks)

**EPUB 3 Requirements:**
- **Format:** EPUB 3.3 specification (backwards compatible)
- **Validation:** Must pass EPUBCheck
- **Package Structure:**
  - Uncompressed `mimetype` file at root (contains "application/epub+zip")
  - `META-INF` folder with `container.xml`
  - `OEBPS` content folder (XHTML, CSS, images, fonts, Navigation Document)
- **Layout Options:**
  - Reflowable EPUB (recommended for most books)
  - Fixed layout (for picture books, comics only when necessary)

**Cover Specifications:**
- **Embedded cover** in EPUB package (required)
- **Separate storefront image** (required)
- Minimum recommended: 1400×2100 pixels
- RGB color mode
- JPG or PNG format

**Metadata Requirements:**
- **BISAC Categories:** Required for classification
- **Author Name:** Standard format
- **Description:** Book description and marketing copy
- **Series Support:** ✅ Series metadata fully supported
- **ISBN:** Required (must supply your own)

**File Size:**
- Ideal: <1 GB
- Maximum: 2 GB (1 GB limit for Pages exports)

**Asset Optimization:**
- Images: JPEG or PNG with correct MIME types
- Fonts: Embed only with proper licenses, register in manifest and CSS with @font-face

**Distribution:**
- Upload via Apple Books Connect (formerly iTunes Connect)
- **iTunes Producer:** Desktop tool for metadata/file upload (not a REST API)
- Appears in Apple Books Store globally

---

### 2.4 IngramSpark (Wholesale Distribution)

**Print Specifications:**
- **Format:** PDF (interior + separate cover PDF)
- **Setup:** Single-page format (1-up per page)
- **No printer marks:** No crop, registration, or trim marks

**Technical Specifications:**
- **Resolution:** 300 PPI for all images
- **Color Space:** CMYK only
- **Line Screen:** 175 visual equivalent
- **Bleed:**
  - Standard: 0.125 inches (3mm) on all four sides
  - Hardcover case laminate: 0.625 inch (16mm) wrap
- **Text Safety:** Minimum 0.25 inches (6mm) from trim line/edge

**Barcode Requirements:**
- 100% black only (0/0/0/100 CMYK)
- White background
- IngramSpark will place barcode if not supplied

**Color Conversion:**
- Convert all spot colors to CMYK
- Avoid registration black (100/100/100/100 CMYK) - causes smudging

**ISBN Requirements:**
- **Must use separate ISBN** for IngramSpark edition
- Cannot reuse Amazon/KDP ISBN
- Update ISBN in book file before upload

**Metadata for Bookstore Distribution:**
- Title, author, publisher
- BISAC categories
- Description, keywords
- Price, publication date
- Series metadata supported

**Distribution Network:**
- Wholesale to major retailers (Barnes & Noble, Apple, Kobo)
- Libraries and independent bookstores
- Global print-on-demand network

---

### 2.5 Barnes & Noble Press

**File Formats:**
- **eBook:** EPUB or DOCX
- **Print:** PDF (cover + interior) or DOCX (interior)

**Specifications:**
- Images: 300 DPI minimum
- Print covers: Print-ready PDF

**ISBN Requirements:**
- Optional for personal use
- Required for commercial sale
- No free ISBN provided (use your own or none)

**Metadata:**
- Title, author, description
- Keywords for discoverability
- Price and royalty settings
- Distribution options
- BISAC categories (for wholesale)

**Publication Timeline:**
- Bibliographic data should be submitted 180 days prior to publication (for wholesale)
- Appears on BN.com within 72 hours of publishing (self-publishing)

---

### 2.6 Smashwords

**File Formats:**
- **Primary:** DOCX (auto-converts to multiple formats via "Meatgrinder")
- **Alternative:** Direct EPUB upload (Smashwords Direct)

**Conversion Output:**
- EPUB, MOBI, PDF, and other formats
- Conversion takes 1-3 minutes

**Style Guide Compliance:**
- **Mandatory** for Premium Catalog acceptance
- 100+ pages (27,000 words) of requirements
- Key restrictions:
  - No "Kindle Edition" or "Kobo Edition" labeling
  - No buy links to other retailers
  - Smashwords branding on first page required

**Cover Specifications:**
- Embedded in DOCX or EPUB
- Must meet Style Guide requirements

**Distribution Network:**
- Apple iBooks, Barnes & Noble Nook, Kobo
- Smaller retailers and libraries
- Mobile app catalogs (iPhone, iPad, Android)

**Pricing:**
- Author sets price (free, $0.99+, or reader-sets-price)
- 10% commission on retail price
- Quarterly payments

**Rights:**
- Non-exclusive (can publish elsewhere simultaneously)
- Author retains full copyright

---

## 3. Key Industry Standards

### 3.1 BISAC Subject Headings

**What is BISAC?**
- Book Industry Standards and Communications
- Standardized topical categories for North American book trade
- Maintained by Book Industry Study Group (BISG)

**Structure:**
- **Code Format:** 9-character alphanumeric (e.g., BIO034000)
  - First 3 letters: Main category (FIC = Fiction, HIS = History)
  - Next 6 digits: Subcategories
- **Descriptor Format:** Uses slashes for hierarchy (e.g., "BIOGRAPHY & AUTOBIOGRAPHY / Aviation & Nautical")

**Organization:**
- 50+ main sections (alphabetically ordered)
- Updated annually (223 new headings added by end of 2024)

**Usage Standards:**
- Publishers select up to 3 codes per title (primary first)
- First code = primary category (most important)
- Use NON000000 for non-content items (blank journals, etc.)

**Purpose:**
- Retailer shelving and online categorization
- Search filtering and book recommendations
- Enhanced discoverability across platforms

**Examples:**
- FIC027000 = Romance / Contemporary
- TRV025070 = TRAVEL / United States / South / General
- BUS025000 = BUSINESS & ECONOMICS / Entrepreneurship

---

### 3.2 Thema Classification (EU Standard)

**What is Thema?**
- International subject classification scheme
- Used primarily in European markets
- More granular than BISAC, multi-lingual support

**When to Use:**
- Publishing for European markets
- International distribution beyond North America
- Complementary to BISAC (can use both)

---

### 3.3 ONIX Format (Metadata Standard)

**What is ONIX?**
- Online Information eXchange
- International XML-based standard for publishing metadata
- Used to transmit book details to distributors, retailers, platforms

**Key Features:**
- Structured XML format for book metadata
- Includes BISAC codes (in `<Subject>` composite with `SubjectSchemeIdentifier="10"`)
- Covers all metadata: title, author, description, ISBN, price, publication date, categories, series info, etc.

**Integration:**
- BISAC codes embedded in ONIX files
- Ensures metadata flows seamlessly through supply chain
- Global standardization for book data exchange

---

### 3.4 Cover Design Best Practices

**General Principles:**
- **Single focal point:** One dominant image/character/symbol
- **Genre-appropriate imagery:** Signals book type immediately
- **Bold color schemes:** 1 main hue + 1 contrasting accent
- **Legible typography:** Must read clearly at thumbnail size
- **Uncluttered layout:** Elements need space to "breathe"

**Typography Specifications:**
- **Hierarchy:** Title largest → subtitle smaller → author name clear but secondary
- **Font Limit:** 2 fonts maximum (1 bold/decorative for title, 1 clean for support text)
- **Size:** Small elements (series title) minimum 12pt
- **Contrast:** High contrast between text and background
- **Genre-appropriate fonts:** Match reader expectations

**Printing Considerations:**
- **Bleed:** 0.125–0.25 inches beyond trim size
  - Extend imagery beyond final trim to account for printer variance
- **Safe Zones:** 0.25–0.5 inches inside trim edges
  - Keep all text, logos, key imagery inside safe zone to prevent cutoff
- **Color Mode:**
  - **Digital (eBook):** RGB
  - **Print:** CMYK, 300 DPI minimum

**Testing:**
- Test at thumbnail size (100px wide) for readability
- Convert to grayscale to verify contrast
- Check against genre bestsellers ("swipe file")

---

### 3.5 ISBN Assignment Workflow

**What is ISBN?**
- International Standard Book Number
- Unique 13-digit identifier for each book edition/format
- Required for most retail distribution

**When You Need Separate ISBNs:**
- Each format (paperback, hardcover, eBook, audiobook)
- Each edition (2nd edition, revised edition)
- Each platform (if using different publisher names)
- Exception: eBook formats of same edition can share 1 ISBN

**Purchasing ISBNs (US):**
- **Bowker MyIdentifiers:** Official US ISBN agency
- **Pricing (2024 rates):**
  - 1 ISBN: $125
  - 10 ISBNs: $295 ($29.50 each)
  - 100 ISBNs: $575 ($5.75 each)
  - 1000 ISBNs: Bulk pricing available
- **Bulk Advantage:** Significantly cheaper per unit

**Assignment Workflow:**
1. **Purchase block** via myidentifiers.com
2. **Log in** to MyIdentifiers dashboard
3. **Select ISBN** from unassigned block (assign sequentially)
4. **Fill metadata:**
   - Title, subtitle, author
   - Format (paperback, hardcover, eBook)
   - Genre/subject (BISAC)
   - Publication date
   - Price, currency
   - Trim size (for print)
   - Imprint (your publisher name)
   - Cover image upload
5. **Submit** (check digit auto-calculates)
6. **Add to book:** Print 13-digit ISBN on copyright page
7. **Enter during upload** to platforms (KDP, IngramSpark, etc.)

**Best Practices:**
- Prepare metadata before purchasing
- Assign only when ready to publish (permanent assignment)
- Use sequential numbering within your block
- Track assignments in spreadsheet

**International:**
- Non-US publishers: Use your country's ISBN agency
- ISBNs belong to publisher (not platform) permanently

---

## 4. NoorStudio Must-Have Features (SaaS)

### 4.1 Core Features

#### Book Metadata Management
- [ ] **Book Dashboard:** Central hub for all books in production
- [ ] **Title, Author, Description:** Rich text editor for descriptions
- [ ] **ISBN Management:** Track ISBNs by edition/format
  - [ ] Import existing ISBNs
  - [ ] Auto-assign from purchased bulk block
  - [ ] Track which ISBN assigned to which edition
- [ ] **Publication Date Tracking**
- [ ] **Pricing:** Multi-currency support
- [ ] **Rights & Licensing:** Track territories, languages

#### Series + Order Tracking
- [ ] **Series Creation:** Name, description, planned book count
- [ ] **Book Ordering:** Drag-and-drop to reorder books in series
- [ ] **Series Number Assignment:** Auto-assign or manual (Book 1, 2, 3, etc.)
- [ ] **Series Metadata Export:** Auto-populate platform series fields
- [ ] **Cross-linking:** "Also in this series" auto-generated

#### Cover Design + Upload
- [ ] **Cover Generator:** Templates for common genres
- [ ] **Upload Custom Covers:** JPG, PNG, TIFF support
- [ ] **Platform-Specific Validation:**
  - [ ] KDP: 2560×1600px (JPG/TIFF), RGB
  - [ ] Lulu: PDF with 0.125" bleed, CMYK, 300 DPI
  - [ ] Apple Books: 1400×2100px minimum
  - [ ] IngramSpark: CMYK, 300 PPI, 0.125" bleed, barcode placement check
- [ ] **Dimension Calculator:** Auto-calculate spine width based on page count + paper type
- [ ] **Bleed & Safe Zone Overlay:** Visual guides for cover design
- [ ] **Multi-Format Export:**
  - [ ] eBook cover (RGB, JPG)
  - [ ] Print cover (CMYK, PDF with bleed)
  - [ ] Storefront images (various sizes for Amazon, Apple, etc.)

#### Auto-Format for Multiple Platforms
- [ ] **EPUB Generation:** Clean, validated EPUB 3.3 from source
- [ ] **PDF Generation for Print:** CMYK, 300 DPI, configurable bleed
- [ ] **Kindle Format:** EPUB export (KDP converts)
- [ ] **Format Validation:**
  - [ ] EPUBCheck integration
  - [ ] PDF/X compliance check for print
- [ ] **Trim Size Templates:**
  - [ ] 6×9" (US Trade)
  - [ ] 5.5×8.5" (Digest)
  - [ ] 5×8" (Mass Market)
  - [ ] Other common sizes
- [ ] **Interior Formatting:**
  - [ ] Chapter headings, page numbers, headers/footers
  - [ ] Configurable margins, gutters, font choices
  - [ ] Scene breaks, section dividers

#### ISBN Integration
- [ ] **ISBN Purchase Integration:** Link to Bowker MyIdentifiers (or bulk purchase)
- [ ] **Bulk ISBN Import:** CSV upload of purchased ISBN block
- [ ] **Auto-Assignment Workflow:**
  - [ ] Book created → assign next available ISBN from pool
  - [ ] Track assignment history (which ISBN for which edition)
- [ ] **ISBN Display:** Show on copyright page auto-generation
- [ ] **Barcode Generation:** EAN-13 barcode for print covers

#### Category/Genre Selection (BISAC)
- [ ] **BISAC Category Browser:** Searchable, hierarchical tree
- [ ] **Up to 3 Category Selection:** Primary + 2 secondary
- [ ] **Genre Presets:** Quick-select for common genres (Romance/Contemporary, Thriller/Legal, etc.)
- [ ] **Validation:** Warn if categories don't match content
- [ ] **Thema Support (Future):** Add EU classification for international markets

#### Export to Publishing Platforms
- [ ] **Export to Kindle (KDP):**
  - [ ] EPUB file ready for upload
  - [ ] Metadata pre-filled (copy-paste fields)
  - [ ] Cover in correct format (2560×1600px JPG)
  - [ ] Series name + number ready
- [ ] **Export to Lulu:**
  - [ ] Print-ready PDF (interior + cover with bleed)
  - [ ] EPUB for eBook
  - [ ] Metadata checklist
- [ ] **Export to Apple Books:**
  - [ ] Validated EPUB 3.3
  - [ ] Embedded + storefront cover
  - [ ] Metadata for Apple Books Connect
- [ ] **Export to IngramSpark:**
  - [ ] CMYK PDF (interior + separate cover)
  - [ ] ISBN verification (unique per platform)
  - [ ] Barcode check (100% black on white)
- [ ] **Export to Barnes & Noble Press:**
  - [ ] EPUB or DOCX
  - [ ] Print PDF
  - [ ] Metadata ready
- [ ] **Export to Smashwords:**
  - [ ] DOCX formatted per Style Guide
  - [ ] Or validated EPUB
  - [ ] Smashwords branding compliance check

#### Distribution Dashboard
- [ ] **Platform Status Tracking:**
  - [ ] Which platforms book is live on
  - [ ] Publication dates per platform
  - [ ] Links to book pages
- [ ] **Sales Integration (Future):**
  - [ ] KDP sales reporting (via unofficial scraping or manual CSV upload)
  - [ ] Multi-platform aggregation
  - [ ] Revenue tracking
- [ ] **Review Aggregation (Future):**
  - [ ] Pull reviews from Amazon, Goodreads, Apple Books
  - [ ] Display in one dashboard

---

### 4.2 Advanced Features (Phase 2+)

#### AI Character Consistency (NoorStudio Secret Sauce)
- [ ] **Character Profile Management:**
  - [ ] Name, description, visual traits
  - [ ] Upload reference images
  - [ ] AI-generated character portraits (consistent across illustrations)
- [ ] **Illustrated Book Generation:**
  - [ ] AI generates scene illustrations based on character profiles
  - [ ] Maintains character visual consistency across all images
  - [ ] Export as print-ready illustrated book
- [ ] **Character Sheets for Merchandising:**
  - [ ] Export character designs for print-on-demand merch
  - [ ] Etsy shop auto-generation integration (?)

#### One-Click Multi-Platform Publishing
- [ ] **Publish Wizard:** Single workflow to generate all platform-specific files
- [ ] **Batch Export:** One click → all formats ready (EPUB, PDF, covers)
- [ ] **Platform-Specific Checklists:** Ensure all requirements met before export

#### Advanced ISBN Management
- [ ] **Bulk ISBN Purchase:** Direct integration with Bowker API (if available)
- [ ] **Auto-Assignment Rules:**
  - [ ] Auto-assign next ISBN when creating new edition
  - [ ] Reserve ISBNs for planned series books
- [ ] **ISBN History:** Track all assignments, changes, editions

#### Direct API Integrations (Phase 3)
- [ ] **KDP API (Unofficial/Workaround):**
  - [ ] Auto-upload files
  - [ ] Update metadata remotely
  - [ ] Price changes, promotions
- [ ] **Lulu API (If Available):**
  - [ ] Direct upload and publish
- [ ] **Draft2Digital Integration:**
  - [ ] Use D2D for wide distribution
  - [ ] Auto-sync metadata
- [ ] **Analytics Dashboard:**
  - [ ] Pull sales data from all platforms
  - [ ] Unified reporting
  - [ ] Revenue forecasting

---

## 5. Technical Integration Spec

### 5.1 API Endpoints & Availability

| Platform | API Status | Integration Options |
|----------|-----------|---------------------|
| **KDP** | ❌ No official API | • Unofficial tools (reverse-engineered)<br>• Amazon Ads API (for marketing only)<br>• Manual upload workflow<br>• Consider web scraping for sales data (fragile) |
| **Lulu** | ❌ No public API | • Manual upload via dashboard<br>• Export files from NoorStudio → user uploads manually |
| **Apple Books** | ⚠️ iTunes Producer (desktop tool) | • Not a REST API<br>• Desktop app for metadata/file upload<br>• Manual workflow |
| **IngramSpark** | ❌ No public API | • Manual upload<br>• NoorStudio generates compliant files → user uploads |
| **Barnes & Noble Press** | ❌ No public API | • Manual upload |
| **Smashwords** | ❌ No public API | • Manual upload (DOCX or EPUB) |
| **Draft2Digital** | ⚠️ Unknown | • Likely dashboard-based<br>• Investigate for aggregation use |

**Conclusion:** NoorStudio cannot directly publish to most platforms via API. Focus on generating **compliant, ready-to-upload files** and providing **metadata checklists** to streamline manual uploads.

---

### 5.2 Metadata Schema (Required Fields by Platform)

#### Universal Fields (All Platforms)
- Title (exact match to cover)
- Subtitle (optional)
- Author name(s)
- Description
- Language
- Publication date
- Price (per market)
- Copyright year

#### ISBN Fields
- **KDP eBook:** Optional (Amazon assigns ASIN)
- **KDP Print:** Required (free Amazon ISBN or custom)
- **Lulu:** Optional (free Lulu ISBN) or custom
- **Apple Books:** Required (custom only)
- **IngramSpark:** Required (must be unique, not reused from Amazon)
- **Barnes & Noble:** Required for commercial sale
- **Smashwords:** Optional

#### Series Fields
- **KDP:** Series name, series number (digits only)
- **Lulu:** Series name, book order
- **Apple Books:** Series metadata in EPUB + storefront
- **IngramSpark:** Series metadata supported
- **Others:** Standard series fields

#### Categories
- **KDP:** BISAC categories (Amazon maps to browse categories)
- **Lulu:** BISAC categories
- **Apple Books:** BISAC categories
- **IngramSpark:** BISAC categories
- **Barnes & Noble:** BISAC categories
- **Smashwords:** Genre/subject (BISAC compatible)

#### Additional Fields
- **Audience:** Age range, grade level
- **Content Warnings:** Sexual content, violence, etc.
- **Keywords:** Search terms (KDP allows 7, others vary)
- **Contributors:** Editors, illustrators, translators, etc.
- **Publisher/Imprint:** Your publishing name
- **Rights:** Territories where book can be sold

---

### 5.3 File Format Conversion Requirements

#### EPUB ↔ MOBI ↔ PDF Conversion

**EPUB as Source Format (Recommended):**
- Create books in **EPUB 3.3** as master format
- Most platforms accept EPUB (KDP, Apple Books, B&N, Smashwords)

**Conversion Pathways:**

1. **EPUB → Kindle (via KDP):**
   - KDP auto-converts EPUB to Kindle format
   - No manual MOBI conversion needed (MOBI deprecated)

2. **EPUB → PDF (for print):**
   - Not direct conversion (EPUB is reflowable, PDF is fixed)
   - NoorStudio workflow:
     - Author writes in visual editor or imports manuscript
     - NoorStudio generates **both EPUB (for digital)** and **PDF (for print)** from same source
   - PDF generation:
     - Trim size selection (6×9", 5.5×8.5", etc.)
     - Margin configuration (bleed, gutters, safety zones)
     - CMYK conversion, 300 DPI
     - Cover integration (full wrap for print)

3. **DOCX → EPUB:**
   - Accept manuscript uploads in DOCX
   - Convert to clean EPUB using libraries (Pandoc, Calibre engine, or custom)
   - Validate with EPUBCheck

4. **EPUB ↔ MOBI (Legacy):**
   - Use Calibre CLI (ebook-convert) if legacy MOBI needed
   - Not necessary for KDP (they handle conversion)

**Tools/Libraries for Conversion:**
- **EPUBCheck:** Validation tool (open source)
- **Pandoc:** Universal document converter (DOCX → EPUB, Markdown → EPUB)
- **Calibre CLI:** ebook-convert (all formats)
- **Custom PDF Engine:** For print-ready PDFs (use libraries like ReportLab, WeasyPrint, or Prince XML)

---

### 5.4 Cover Generation & Validation

**Cover Types Needed:**

1. **eBook Cover (RGB):**
   - KDP: 2560×1600px, JPG or TIFF
   - Apple Books: 1400×2100px+, JPG or PNG (embedded + storefront)
   - Others: Similar high-res requirements

2. **Print Cover (CMYK PDF):**
   - Full wrap: Front + Spine + Back
   - Dimensions calculated: (Trim Width + Spine Width + Trim Width) × Trim Height + Bleed
   - Example for 6×9" book with 0.125" bleed and 0.5" spine:
     - Width: 6" + 0.5" + 6" + 0.125" + 0.125" = 12.75"
     - Height: 9" + 0.125" + 0.125" = 9.25"

**Cover Validation Checks:**

- [ ] **Dimension Check:** Meets platform minimums
- [ ] **Resolution:** 300 DPI for print, 72+ DPI for digital
- [ ] **Color Mode:** RGB for digital, CMYK for print
- [ ] **File Format:** JPG/TIFF for KDP eBook, PDF for print
- [ ] **File Size:** <50MB (KDP limit)
- [ ] **Bleed:** 0.125" on all sides for print
- [ ] **Safe Zones:** Text/logos 0.25"+ inside trim line
- [ ] **Barcode Placement:** Reserved area for ISBN barcode (bottom right back cover)
- [ ] **Spine Width Accuracy:** Calculated correctly based on page count + paper type
- [ ] **Title Match:** Cover title matches metadata exactly

**NoorStudio Cover Workflow:**

1. **User uploads cover image** (or uses template generator)
2. **Select book specs:** Trim size, page count, paper type (white/cream, 50#/60#)
3. **Auto-calculate spine width**
4. **Generate templates:**
   - eBook cover (crop front only, resize to platform specs)
   - Print cover (full wrap with bleed guides, safe zone overlays)
5. **Validate before export:**
   - Check dimensions, DPI, color mode
   - Verify barcode placement
   - Confirm text safety margins
6. **Export:**
   - RGB JPG for eBook platforms
   - CMYK PDF for print platforms

---

### 5.5 ISBN Purchasing Workflow (Bulk SaaS Model)

**Option 1: User Manages ISBNs**
- User purchases ISBNs from Bowker (or local agency)
- Imports ISBNs into NoorStudio
- NoorStudio tracks assignments

**Option 2: NoorStudio Bulk Purchase (Advanced)**
- NoorStudio purchases ISBNs in bulk (1000+ for volume discount)
- Sells ISBNs to users at cost + small markup
- Auto-assigns from pool
- Tracks ownership and assignments

**Workflow for Option 2:**

1. **NoorStudio:**
   - Purchase 1000 ISBNs from Bowker (~$0.50-$1 each in bulk)
   - Resell to users at $5-$10 each (covers cost + admin)

2. **User:**
   - Click "Add ISBN" in book settings
   - Option 1: Import existing ISBN
   - Option 2: Purchase ISBN from NoorStudio ($5-$10)
   - Option 3: Use platform's free ISBN (KDP, Lulu)

3. **Auto-Assignment:**
   - User selects "Purchase ISBN"
   - NoorStudio assigns next available ISBN from pool
   - Updates Bowker metadata with user's book info
   - ISBN permanently assigned to user's book

4. **Tracking:**
   - Database tracks: ISBN → User → Book → Edition/Format
   - Generate ISBN reports for user
   - Display ISBN in copyright page template

**Legal Considerations:**
- ISBNs belong to publisher (NoorStudio or user's imprint)
- If NoorStudio purchases in bulk, books show "Published by NoorStudio" (or user's custom imprint if allowed)
- Check Bowker terms for resale/assignment rules

---

## 6. NoorStudio Competitive Advantage ("Secret Sauce")

### 6.1 Current Market Analysis

**Existing Tools:**

| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| **Reedsy** | Marketplace for publishing pros (editors, designers)<br>Free formatting tools (Reedsy Studio) | No distribution (pre-publishing only)<br>No direct platform integration |
| **Draft2Digital** | Easy wide distribution (Apple, Kobo, B&N, libraries)<br>Great aggregator | Limited formatting control<br>10% commission<br>No print support |
| **Vellum** | Beautiful book formatting (Mac/Windows)<br>One-click export to multiple formats | Expensive ($249.99)<br>No distribution or metadata management |
| **Atticus** | All-in-one writing + formatting<br>Affordable ($147 one-time) | Limited cover design tools<br>No direct publishing integration |
| **BookBaby** | Full-service publishing (design, editing, distribution)<br>Print + eBook | Very expensive (packages $1000+)<br>Not SaaS (per-book fees) |

**Market Gaps:**

1. **No AI-Powered Character/Visual Consistency:**
   - Existing tools don't help authors create illustrated books with consistent character designs
   - Authors who want visual novels, children's books, or illustrated fiction struggle with artist costs or inconsistent AI results

2. **Fragmented Workflow:**
   - Authors use separate tools for writing, formatting, cover design, ISBN, metadata, and distribution
   - No single platform handles end-to-end from manuscript → multi-platform publishing

3. **No Merchandising Integration:**
   - Authors with strong IP (characters, worlds) can't easily monetize beyond books
   - Print-on-demand merch (t-shirts, posters, stickers) requires separate platforms (Etsy, Redbubble)

4. **Manual Multi-Platform Publishing:**
   - Authors must manually upload to each platform (KDP, Lulu, Apple, etc.)
   - Metadata duplicated across platforms (error-prone)

5. **Expensive or Complex ISBN Management:**
   - Bowker ISBNs cost $125 each (or $295/10)
   - Free ISBNs from KDP/Lulu lock books to those platforms

---

### 6.2 NoorStudio Differentiation

**Core Value Proposition:**

> **"NoorStudio is the first all-in-one publishing platform that turns your story into a multi-platform empire — from AI-illustrated books to print-on-demand merchandise — with one-click publishing to Kindle, Apple Books, print distributors, and your own Etsy store."**

**Key Differentiators:**

#### 1. **AI Character Consistency Engine**

**Problem:** Authors who want illustrated books struggle with:
- Hiring expensive illustrators
- Using AI art that produces inconsistent character designs across images
- Visual novels, children's books, graphic novels require cohesive visuals

**NoorStudio Solution:**
- **Character Profile Builder:**
  - Author creates character profiles (name, description, visual traits)
  - Upload reference images or generate via AI
  - AI learns character appearance (face, hair, clothing, body type)
- **Consistent Illustration Generation:**
  - Author writes scene descriptions
  - AI generates illustrations with consistent character designs across entire book
  - Fine-tune with feedback loop (regenerate until perfect)
- **Export to Illustrated Book:**
  - Auto-layout text + images for print and eBook
  - Professional formatting for picture books, visual novels, graphic novels

**Market Impact:** Opens illustrated book publishing to solo authors (no $5,000+ illustrator fees)

#### 2. **One-Click Multi-Platform Publishing**

**Problem:** Authors waste hours uploading same book to 5+ platforms with different file requirements

**NoorStudio Solution:**
- **Single Source of Truth:** Author manages book metadata once
- **Platform-Specific File Generation:**
  - One click → Generate all formats:
    - KDP: EPUB + 2560×1600 JPG cover
    - Lulu: Print PDF with bleed + EPUB
    - Apple Books: Validated EPUB 3.3 + storefront cover
    - IngramSpark: CMYK PDF interior + cover with barcode
    - Barnes & Noble: EPUB or DOCX
- **Guided Upload Checklists:**
  - Since direct API unavailable, provide step-by-step guides per platform
  - Pre-filled metadata (copy-paste ready)
  - Validation checks before export (catch errors early)

**Market Impact:** Reduce multi-platform publishing from 6+ hours to 30 minutes

#### 3. **Character Sheets → Merchandising Pipeline**

**Problem:** Authors with strong IP can't easily monetize beyond books

**NoorStudio Solution:**
- **Character Merchandising Hub:**
  - Export character designs as print-ready files
  - Auto-generate Etsy shop listings (or integrate with Printful, Printify)
  - Offer t-shirts, posters, stickers, mugs with book characters
- **Book Cover → Merch:**
  - One-click export of book cover for posters, prints
  - Branded merchandise for super-fans

**Example Workflow:**
1. Author creates character profiles for fantasy series
2. AI generates consistent character art
3. Export to illustrated book
4. Export character portraits to merch templates
5. One-click Etsy shop creation → "Official [Series Name] Merchandise"

**Market Impact:** Authors become multimedia brands (books + merch) without learning Photoshop or managing suppliers

#### 4. **Bulk ISBN Management (SaaS-Owned Pool)**

**Problem:** Authors pay $125/ISBN or use free ISBNs that lock them to platforms

**NoorStudio Solution:**
- NoorStudio purchases ISBNs in bulk (1000+ at ~$0.50-$1 each)
- Sells to users at $5-$10 each (90% discount vs. Bowker retail)
- Auto-assigns from pool when user publishes
- Tracks ownership and usage

**Market Impact:** Lower barrier to multi-platform publishing (own your ISBNs for cheap)

#### 5. **Series Management & Cross-Promotion**

**Problem:** Authors writing series manually track order, metadata, and cross-linking

**NoorStudio Solution:**
- **Series Dashboard:**
  - Drag-and-drop book ordering
  - Auto-generate "Also in this series" pages
  - Track series-wide sales
- **Auto-Populate Series Metadata:**
  - Export to platforms with series name + number pre-filled
  - Consistent branding across all books

**Market Impact:** Easier series management = more authors write series = more books published

---

### 6.3 Competitive Matrix

| Feature | NoorStudio | Reedsy | Draft2Digital | Vellum | Atticus | BookBaby |
|---------|-----------|---------|---------------|--------|---------|----------|
| **Writing Tool** | ✅ (Basic) | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Formatting (EPUB/PDF)** | ✅ | ✅ (Free) | ✅ | ✅ | ✅ | ✅ (Service) |
| **Cover Design** | ✅ (Templates + Upload) | ❌ (Marketplace) | ❌ | ❌ | ⚠️ (Basic) | ✅ (Service) |
| **AI Illustrations** | ✅ (Character consistency) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ISBN Management** | ✅ (Bulk pool) | ❌ | ❌ | ❌ | ❌ | ✅ (Service) |
| **Multi-Platform Export** | ✅ (One-click) | ⚠️ (EPUB only) | ✅ (Distribution) | ✅ (Files only) | ✅ (Files only) | ✅ (Service) |
| **Distribution** | ⚠️ (File export) | ❌ | ✅ (Aggregator) | ❌ | ❌ | ✅ (Service) |
| **Merchandising** | ✅ (Etsy integration) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Series Management** | ✅ | ❌ | ⚠️ (Basic) | ❌ | ❌ | ❌ |
| **Pricing** | SaaS ($19-49/mo?) | Free tools, $$ for pros | 10% commission | $249.99 one-time | $147 one-time | $1000+ per book |

---

### 6.4 Target Audiences

**Primary:**
1. **Self-Publishing Authors (Series Writers):**
   - Writing multi-book series (fantasy, romance, sci-fi)
   - Need series management, consistent branding, multi-platform distribution
   - Pain: Manual metadata duplication, expensive ISBNs

2. **Illustrated Book Creators:**
   - Children's book authors
   - Visual novel/graphic novel creators
   - Authors who want illustrations but can't afford $5,000+ illustrators
   - Pain: Inconsistent AI art, expensive human illustrators

3. **Author-Preneurs (IP Builders):**
   - Building brands beyond books (merch, courses, communities)
   - Want to monetize characters, worlds, fan communities
   - Pain: No easy path from book → merchandise

**Secondary:**
4. **Small Publishers/Imprints:**
   - Managing 10-100 authors
   - Need bulk ISBN management, multi-author dashboard
   - Pain: Expensive tools, fragmented workflows

---

## 7. MVP vs. Full Feature Set

### 7.1 MVP (Launch) — 3-6 Months

**Goal:** Prove core value — streamlined multi-platform publishing for series authors

**Features:**

✅ **Core Metadata Management:**
- Title, author, description, price, publication date
- Series name + number tracking
- BISAC category selection (up to 3)

✅ **ISBN Import:**
- Users import ISBNs they already own
- Track ISBN → Book → Edition/Format

✅ **File Upload:**
- Manuscript upload (DOCX)
- Cover upload (JPG/PNG)

✅ **Basic Formatting:**
- Convert DOCX → EPUB (validated)
- Generate print PDF (6×9" trim, standard margins)

✅ **Export to 2 Platforms:**
- **KDP (Kindle):** EPUB + JPG cover (2560×1600)
- **Lulu (Print):** Print PDF + EPUB

✅ **Export Checklists:**
- Step-by-step guides for manual upload
- Pre-filled metadata (copy-paste)

**Tech Stack:**
- Backend: Node.js/Python + PostgreSQL
- File Processing: Pandoc (DOCX → EPUB), WeasyPrint (PDF generation)
- Storage: AWS S3 (book files, covers)
- Hosting: Vercel/Heroku

**Success Metrics:**
- 100 authors sign up
- 500 books formatted + exported
- 80%+ user satisfaction ("Would recommend")

---

### 7.2 Phase 2 (6-12 Months Post-Launch)

**Goal:** Add differentiation features (AI, merchandising) + expand platform support

**Features:**

✅ **AI Character Consistency:**
- Character profile builder
- AI illustration generation (via Midjourney/DALL-E/Stable Diffusion API)
- Consistent character rendering across images

✅ **Illustrated Book Formatting:**
- Auto-layout text + images
- Export illustrated EPUBs and print PDFs

✅ **Bulk ISBN Purchase:**
- NoorStudio buys ISBNs in bulk
- Sells to users at $5-$10 each
- Auto-assign from pool

✅ **Additional Platform Support:**
- **Apple Books:** Validated EPUB 3.3 + storefront cover
- **IngramSpark:** CMYK PDF with bleed + barcode placement
- **Barnes & Noble Press:** EPUB/DOCX + print PDF

✅ **Cover Generator:**
- Genre-based templates
- Drag-and-drop editor
- Auto-validation (dimensions, DPI, color mode)

✅ **Series Cross-Linking:**
- Auto-generate "Also in this series" pages
- Export ready-to-use back matter

**Success Metrics:**
- 500+ authors
- 2,000+ books published
- 50+ illustrated books created
- $5,000+ revenue from ISBN sales

---

### 7.3 Phase 3 (12-24 Months Post-Launch)

**Goal:** Full-featured publishing ecosystem + merchandising integration

**Features:**

✅ **Direct Distribution Integration:**
- Partner with Draft2Digital for wide distribution (if no direct APIs available)
- Explore unofficial KDP API integrations (risky but high value)

✅ **Merchandising Hub:**
- Export character art → print-ready merch templates
- Etsy shop auto-generation (or Printful/Printify integration)
- Merch dashboard (track sales, designs)

✅ **Analytics Dashboard:**
- Pull sales data from platforms (KDP via scraping or manual CSV upload)
- Multi-platform aggregation
- Revenue forecasting

✅ **Advanced Cover Tools:**
- 3D mockup generator (show book on shelf, in hand)
- A/B testing (upload 2 covers, get feedback from community)

✅ **Community Features:**
- Author forums, beta reader matching
- Book discovery (NoorStudio marketplace)

✅ **Publisher Tier:**
- Multi-author management
- Bulk operations (upload 10 books at once)
- White-label option (custom branding)

**Success Metrics:**
- 2,000+ authors
- 10,000+ books published
- $50,000+ MRR (Monthly Recurring Revenue)
- 100+ authors using merchandising hub

---

## 8. Implementation Recommendations

### 8.1 Build vs. Integrate

**Build In-House:**
- Metadata management (core differentiator)
- Series tracking (unique feature)
- Cover validation (custom logic per platform)
- Export file generation (EPUB, PDF)

**Integrate/Use Libraries:**
- **EPUB Conversion:** Pandoc, Calibre CLI
- **PDF Generation:** WeasyPrint, Prince XML, ReportLab
- **EPUBCheck:** Validation (open-source tool)
- **AI Illustrations:** API integrations (Midjourney, DALL-E 3, Stable Diffusion)
- **Barcode Generation:** Open-source libraries (python-barcode, JsBarcode)
- **Cover Templates:** Canva API (if available) or build custom editor

**Avoid:**
- Building custom AI models (too expensive for MVP)
- Creating own ISBN agency (use Bowker, resell if legal)
- Reverse-engineering KDP API (risky, fragile)

---

### 8.2 Pricing Model

**Freemium:**
- **Free Tier:**
  - 1 book
  - Basic formatting (EPUB + PDF)
  - Export to KDP + Lulu
  - Watermarked covers from templates
- **Pro Tier ($19/month):**
  - Unlimited books
  - All platform exports
  - Series management
  - Remove watermarks
  - Priority support
- **Pro+ Tier ($49/month):**
  - AI character consistency (10 illustrations/month)
  - Bulk ISBN purchase at discount
  - Merchandising hub access
  - Advanced analytics

**Add-Ons:**
- ISBN purchase: $5-$10 each
- Extra AI illustrations: $2-$5 per image
- Professional cover design: $50-$200 (marketplace)

---

### 8.3 Go-to-Market Strategy

**Phase 1: Launch (MVP)**
1. **Beta Program:**
   - Recruit 50 authors from Reddit (r/selfpublish), Facebook groups
   - Free access in exchange for feedback
2. **Content Marketing:**
   - Blog: "How to Publish on 5 Platforms in 1 Hour"
   - YouTube: Tutorials on using NoorStudio
3. **Partnerships:**
   - Collaborate with Draft2Digital, Reedsy (complementary tools)
   - Guest posts on author blogs (Jane Friedman, The Creative Penn)

**Phase 2: Growth**
1. **SEO:** Target "self-publishing tools", "EPUB converter", "ISBN for books"
2. **Paid Ads:** Facebook/Google targeting "self-publishing authors"
3. **Affiliate Program:** Authors refer friends, earn $10/signup

**Phase 3: Scale**
1. **Publisher Outreach:** Pitch to small presses, imprints
2. **Community Building:** Author forum, showcase published books
3. **Conferences:** Attend NINC, 20BooksTo50K, Self-Publishing Summit

---

## 9. Technical Challenges & Solutions

### 9.1 Challenge: No Official APIs

**Problem:** Cannot directly publish to KDP, Lulu, Apple Books via API

**Solutions:**
1. **Generate Compliant Files:** Focus on perfect file export (users upload manually)
2. **Guided Workflows:** Step-by-step checklists reduce upload friction
3. **Future:** Explore unofficial APIs (KDP scraping tools exist but risky)
4. **Partnership:** Integrate with Draft2Digital (they have distribution APIs)

---

### 9.2 Challenge: AI Character Consistency

**Problem:** Current AI models (DALL-E, Midjourney) struggle with consistent characters across images

**Solutions:**
1. **LoRA Training (Stable Diffusion):**
   - Train custom LoRA models on character reference images
   - Generate new images with consistent character appearance
   - Requires compute (GPU servers)
2. **Prompt Engineering:**
   - Detailed prompts with character traits
   - Use same seed + prompt template for consistency
3. **Manual Refinement:**
   - Allow users to regenerate until satisfied
   - Store successful prompts for reuse
4. **Future:** As AI models improve (GPT-5 vision, DALL-E 4), consistency will get easier

---

### 9.3 Challenge: ISBN Bulk Purchase Legality

**Problem:** Bowker may restrict resale/reassignment of ISBNs

**Solutions:**
1. **Check Bowker Terms:** Verify if bulk purchase → resale is allowed
2. **Publisher Model:** NoorStudio as publisher of record (ISBNs under "NoorStudio Imprints")
   - Users get ISBN assigned to their book but NoorStudio listed as publisher
3. **Referral Model:** Earn affiliate commission from Bowker for referring users (avoid resale)
4. **User-Owned ISBNs:** Users purchase from Bowker directly, import into NoorStudio

---

### 9.4 Challenge: Cover Generation Quality

**Problem:** Auto-generated covers often look amateur

**Solutions:**
1. **High-Quality Templates:** Hire designers to create 50+ genre-specific templates
2. **Canva Integration:** Let users design in Canva, import to NoorStudio
3. **Marketplace:** Connect authors with cover designers (like Reedsy)
4. **AI Cover Generation (Future):** Use DALL-E 3 for custom cover art (hit-or-miss currently)

---

## 10. Conclusion & Next Steps

### 10.1 Key Takeaways

1. **No Direct APIs:** Focus on generating perfect export files + guided manual uploads
2. **BISAC Categories Essential:** All platforms require BISAC subject codes
3. **ISBN Strategy Critical:** Bulk purchase could be major value-add (if legal)
4. **AI Character Consistency = Differentiator:** Biggest competitive advantage if executed well
5. **MVP Should Focus on KDP + Lulu:** Most popular platforms for self-publishers

---

### 10.2 Recommended MVP Scope

**Must-Have (3 Months):**
- [ ] Metadata management (title, author, description, BISAC categories, series)
- [ ] DOCX → EPUB conversion (validated)
- [ ] Print PDF generation (6×9" trim, standard margins)
- [ ] Cover upload + validation
- [ ] Export to KDP (EPUB + JPG cover)
- [ ] Export to Lulu (Print PDF + EPUB)
- [ ] ISBN import/tracking
- [ ] Basic user authentication + dashboard

**Nice-to-Have (6 Months):**
- [ ] Cover generator (templates)
- [ ] Apple Books export (EPUB 3.3)
- [ ] IngramSpark export (CMYK PDF)
- [ ] Bulk ISBN purchase integration
- [ ] Series cross-linking (auto-generate "Also in this series" pages)

**Phase 2 (12 Months):**
- [ ] AI character consistency
- [ ] Illustrated book formatting
- [ ] Merchandising hub (Etsy integration)
- [ ] Analytics dashboard

---

### 10.3 Next Steps

1. **Validate Demand:**
   - Survey 100 self-published authors: Would you pay $19/mo for this?
   - Post concept in r/selfpublish, get feedback

2. **Prototype Core Features:**
   - Build DOCX → EPUB converter (use Pandoc)
   - Build print PDF generator (use WeasyPrint)
   - Create platform export checklists (KDP, Lulu)

3. **Test ISBN Workflow:**
   - Contact Bowker: Can we resell ISBNs?
   - Alternative: Referral/affiliate model

4. **AI Illustration Proof-of-Concept:**
   - Train LoRA model on 5 character reference images
   - Generate 10 illustrations, test consistency
   - If successful, this becomes core differentiator

5. **Build Landing Page:**
   - Headline: "Publish Your Book on 5 Platforms in 1 Hour"
   - Waitlist signup → validate demand before building

---

## 11. Appendix: Resources & References

### 11.1 Platform Documentation

- **KDP:** https://kdp.amazon.com/help
- **Lulu:** https://help.lulu.com/ + https://www.lulu.com/products (specs)
- **Apple Books:** https://help.apple.com/itc/booksassetguide/
- **IngramSpark:** https://www.ingramspark.com/plan-your-book + File Creation Guide (PDF)
- **Barnes & Noble Press:** https://press.barnesandnoble.com/
- **Smashwords:** https://www.smashwords.com/about/supportfaq

### 11.2 Industry Standards

- **BISAC Subject Headings:** https://www.bisg.org/complete-bisac-subject-headings-list
- **Bowker (ISBN):** https://www.myidentifiers.com/
- **ONIX Format:** https://www.editeur.org/83/Overview/
- **EPUBCheck:** https://www.w3.org/publishing/epubcheck/

### 11.3 Competitor Tools

- **Reedsy:** https://reedsy.com/
- **Draft2Digital:** https://www.draft2digital.com/
- **Vellum:** https://vellum.pub/
- **Atticus:** https://www.atticus.io/
- **BookBaby:** https://www.bookbaby.com/

### 11.4 Conversion Tools

- **Pandoc:** https://pandoc.org/ (universal document converter)
- **Calibre:** https://calibre-ebook.com/ (ebook management + conversion)
- **EPUBCheck:** https://github.com/w3c/epubcheck
- **WeasyPrint:** https://weasyprint.org/ (HTML/CSS → PDF)
- **Prince XML:** https://www.princexml.com/ (advanced PDF generation)

---

**End of Document**

---

**Document Prepared By:** OpenClaw Research Agent  
**For:** NoorStudio Publishing Platform  
**Date:** February 4, 2026  
**Version:** 1.0
