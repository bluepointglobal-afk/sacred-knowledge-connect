# tasks-database-schema.md

## Feature: F01 - Database Schema for Book Creator

**Priority:** P0 (Critical - Foundation)
**Effort:** 8 hours
**Dependencies:** None (this is the foundation)

---

## Overview

Create the Supabase database schema for the Islamic Children's Book Creator. This includes all tables, relationships, RLS policies, triggers, and seed data needed for the book creation features.

---

## Tasks

### 1. Create Migration File

- [ ] 1.1 Create `supabase/migrations/005_book_creator.sql`
- [ ] 1.2 Add migration header with description and date

### 2. Create Core Tables

- [ ] 2.1 Create `themes` table
  ```sql
  - id UUID PRIMARY KEY
  - name TEXT NOT NULL
  - colors JSONB (primary, secondary, background, text)
  - fonts JSONB (heading_family, body_family, sizes)
  - is_default BOOLEAN DEFAULT false
  - created_at TIMESTAMPTZ
  ```

- [ ] 2.2 Create `books` table
  ```sql
  - id UUID PRIMARY KEY
  - creator_id UUID REFERENCES profiles(id)
  - title TEXT NOT NULL
  - description TEXT
  - cover_image_url TEXT
  - status book_status ('draft', 'published', 'archived')
  - age_group TEXT ('3-5', '6-8', '9-12', '13+')
  - language TEXT DEFAULT 'en'
  - theme_id UUID REFERENCES themes(id)
  - total_pages INTEGER DEFAULT 0
  - is_compliant BOOLEAN DEFAULT true
  - compliance_score INTEGER
  - created_at TIMESTAMPTZ
  - updated_at TIMESTAMPTZ
  ```

- [ ] 2.3 Create `book_pages` table
  ```sql
  - id UUID PRIMARY KEY
  - book_id UUID REFERENCES books(id) ON DELETE CASCADE
  - page_number INTEGER NOT NULL
  - title TEXT
  - text_content TEXT (rich text HTML from TipTap)
  - layout_type TEXT ('text-only', 'text-left', 'text-right', 'image-full', 'text-over-image')
  - background_color TEXT
  - sort_order INTEGER NOT NULL
  - created_at TIMESTAMPTZ
  - updated_at TIMESTAMPTZ
  - UNIQUE(book_id, page_number)
  ```

- [ ] 2.4 Create `illustrations` table
  ```sql
  - id UUID PRIMARY KEY
  - book_id UUID REFERENCES books(id) ON DELETE CASCADE
  - page_id UUID REFERENCES book_pages(id) ON DELETE CASCADE
  - source illustration_source ('ai-generated', 'user-upload', 'template')
  - image_url TEXT NOT NULL
  - thumbnail_url TEXT
  - alt_text TEXT
  - prompt TEXT (for AI-generated)
  - style TEXT (watercolor, cartoon, realistic, islamic-art)
  - position JSONB (x, y, width, height)
  - created_at TIMESTAMPTZ
  ```

- [ ] 2.5 Create `generation_logs` table
  ```sql
  - id UUID PRIMARY KEY
  - book_id UUID REFERENCES books(id) ON DELETE CASCADE
  - user_id UUID REFERENCES profiles(id)
  - generation_type TEXT ('story', 'image', 'cover', 'compliance')
  - model TEXT (claude-3, gpt-4, dall-e-3)
  - prompt TEXT NOT NULL
  - output JSONB
  - tokens_used INTEGER
  - cost_cents INTEGER
  - status generation_status ('pending', 'completed', 'failed')
  - error_message TEXT
  - created_at TIMESTAMPTZ
  ```

### 3. Update Existing Tables

- [ ] 3.1 Add columns to `profiles` table
  ```sql
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creator_tier TEXT DEFAULT 'free';
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS generation_credits INTEGER DEFAULT 100;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_reset_at TIMESTAMPTZ;
  ```

### 4. Create Enum Types

- [ ] 4.1 Create `book_status` enum
  ```sql
  CREATE TYPE book_status AS ENUM ('draft', 'published', 'archived');
  ```

- [ ] 4.2 Create `illustration_source` enum
  ```sql
  CREATE TYPE illustration_source AS ENUM ('ai-generated', 'user-upload', 'template');
  ```

- [ ] 4.3 Create `generation_status` enum
  ```sql
  CREATE TYPE generation_status AS ENUM ('pending', 'completed', 'failed');
  ```

### 5. Create Indexes

- [ ] 5.1 Index on `books.creator_id`
- [ ] 5.2 Index on `books.status`
- [ ] 5.3 Index on `book_pages.book_id`
- [ ] 5.4 Index on `book_pages.sort_order`
- [ ] 5.5 Index on `illustrations.book_id`
- [ ] 5.6 Index on `illustrations.page_id`
- [ ] 5.7 Index on `generation_logs.book_id`
- [ ] 5.8 Index on `generation_logs.user_id`

### 6. Create RLS Policies

- [ ] 6.1 `themes` policies
  - SELECT: Public (anyone can view themes)
  - INSERT/UPDATE/DELETE: Admin only

- [ ] 6.2 `books` policies
  - SELECT: Creator can view own books
  - SELECT: Public can view published books
  - INSERT: Authenticated users can create
  - UPDATE: Creator can update own books
  - DELETE: Creator can delete own books

- [ ] 6.3 `book_pages` policies
  - SELECT: Via book access (creator or public if published)
  - INSERT: Creator of parent book
  - UPDATE: Creator of parent book
  - DELETE: Creator of parent book

- [ ] 6.4 `illustrations` policies
  - SELECT: Via book access
  - INSERT: Creator of parent book
  - UPDATE: Creator of parent book
  - DELETE: Creator of parent book

- [ ] 6.5 `generation_logs` policies
  - SELECT: User can view own logs
  - INSERT: Authenticated users
  - UPDATE: None (immutable)
  - DELETE: None (audit trail)

### 7. Create Triggers

- [ ] 7.1 `handle_updated_at` trigger for books
- [ ] 7.2 `handle_updated_at` trigger for book_pages
- [ ] 7.3 `update_book_page_count` trigger
  - After INSERT/DELETE on book_pages
  - Updates books.total_pages

- [ ] 7.4 `deduct_generation_credits` trigger
  - After INSERT on generation_logs WHERE status = 'completed'
  - Decrements profiles.generation_credits

### 8. Create Helper Functions

- [ ] 8.1 `get_user_books(user_id)` - List books for a user
- [ ] 8.2 `get_book_with_pages(book_id)` - Book with all pages
- [ ] 8.3 `check_generation_credits(user_id)` - Returns remaining credits
- [ ] 8.4 `reset_daily_credits()` - Scheduled function for credit reset

### 9. Seed Default Data

- [ ] 9.1 Seed default themes
  ```sql
  INSERT INTO themes (name, colors, fonts, is_default) VALUES
  ('Classic', '{"primary":"#1a365d","secondary":"#2b6cb0","background":"#ffffff","text":"#1a202c"}', '{"heading":"Georgia","body":"Georgia"}', true),
  ('Playful', '{"primary":"#9f7aea","secondary":"#ed64a6","background":"#faf5ff","text":"#44337a"}', '{"heading":"Comic Sans MS","body":"Arial"}', false),
  ('Islamic', '{"primary":"#047857","secondary":"#059669","background":"#ecfdf5","text":"#064e3b"}', '{"heading":"Amiri","body":"Noto Sans Arabic"}', false),
  ('Modern', '{"primary":"#3182ce","secondary":"#63b3ed","background":"#f7fafc","text":"#2d3748"}', '{"heading":"Inter","body":"Inter"}', false);
  ```

### 10. TypeScript Types

- [ ] 10.1 Update `/src/types/database.ts` with new types
  ```typescript
  export type BookStatus = 'draft' | 'published' | 'archived';
  export type IllustrationSource = 'ai-generated' | 'user-upload' | 'template';
  export type GenerationStatus = 'pending' | 'completed' | 'failed';

  export interface Book { ... }
  export interface BookPage { ... }
  export interface Theme { ... }
  export interface Illustration { ... }
  export interface GenerationLog { ... }
  ```

---

## Acceptance Criteria

- [ ] Migration file executes without errors on fresh Supabase instance
- [ ] All tables created with correct columns and types
- [ ] Foreign key relationships work correctly
- [ ] RLS policies enforce correct access control
- [ ] Triggers fire and update counts/credits correctly
- [ ] Default themes are seeded
- [ ] TypeScript types match database schema
- [ ] `npm run build` passes with new types

---

## Verification Commands

```bash
# Apply migration locally
supabase db reset

# Check tables created
supabase db dump --schema public

# Test RLS policies
supabase test db

# Verify TypeScript types
npm run build
```

---

## Notes

- Use `gen_random_uuid()` for all UUID primary keys
- All timestamps use `TIMESTAMPTZ` with `DEFAULT now()`
- RLS is enabled by default on all tables
- Generation logs are immutable for audit purposes
- Credits reset daily at midnight UTC
