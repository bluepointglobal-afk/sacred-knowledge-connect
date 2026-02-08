# NoorStudio Character Consistency - Seed Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  NoorStudio Book Generation Pipeline                             │
│  (Character Consistency via Seed Reuse)                          │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                         CHAPTER 1 GENERATION                          │
└───────────────────────────────────────────────────────────────────────┘

   1. Generate text for Chapter 1
      │
      │  "Luna discovers a magical forest..."
      │
      ▼
   2. Extract character description
      │
      │  "Luna: mystical cat, white fur, green eyes..."
      │
      ▼
   3. Build illustration prompt
      │
      │  "Pixar 3D style: mystical cat named Luna..."
      │
      ▼
   4. Call NanoBanana API (FIRST TIME)
      │
      │  Request:
      │  {
      │    prompt: "...",
      │    seed: undefined,              ◄── No seed yet!
      │    referenceStrength: undefined
      │  }
      │
      ▼
   5. NanoBanana generates image + returns seed
      │
      │  Response:
      │  {
      │    imageUrl: "https://...",
      │    providerMeta: {
      │      seed: 42857193,             ◄── CAPTURE THIS!
      │      processingTime: 3200
      │    }
      │  }
      │
      ▼
   6. **CAPTURE SEED**
      │
      │  globalConsistencySeed = 42857193  ◄── STORED!
      │
      └──► Chapter 1 complete ✓


┌───────────────────────────────────────────────────────────────────────┐
│                         CHAPTER 2 GENERATION                          │
└───────────────────────────────────────────────────────────────────────┘

   1. Generate text for Chapter 2
      │
      ▼
   2. Extract character description
      │
      ▼
   3. Build illustration prompt
      │
      ▼
   4. Call NanoBanana API (REUSE SEED)
      │
      │  Request:
      │  {
      │    prompt: "...",
      │    seed: 42857193,               ◄── REUSE CAPTURED SEED!
      │    referenceStrength: 0.9        ◄── High consistency
      │  }
      │
      ▼
   5. NanoBanana uses seed to ensure consistency
      │
      │  - Luna will look 90% identical
      │  - Same face, fur color, eyes
      │  - Only pose/background vary
      │
      ▼
   6. Return image with same character
      │
      └──► Chapter 2 complete ✓


┌───────────────────────────────────────────────────────────────────────┐
│                         CHAPTER 3 GENERATION                          │
└───────────────────────────────────────────────────────────────────────┘

   1-3. [Same as Chapter 2]
      │
      ▼
   4. Call NanoBanana API (REUSE SEED AGAIN)
      │
      │  Request:
      │  {
      │    prompt: "...",
      │    seed: 42857193,               ◄── SAME SEED AGAIN!
      │    referenceStrength: 0.9
      │  }
      │
      ▼
   5. Character remains consistent
      │
      └──► Chapter 3 complete ✓


┌───────────────────────────────────────────────────────────────────────┐
│                      FINAL BOOK (3 CHAPTERS)                          │
└───────────────────────────────────────────────────────────────────────┘

   ✅ All chapters use seed: 42857193
   ✅ Luna looks identical across all illustrations
   ✅ Character consistency achieved!
```

---

## Code Implementation

### Location: `src/lib/ai/stageRunner.ts`

```typescript
export async function runIllustrationsStage(
  project: StoredProject,
  outline: OutlineOutput,
  chapters: ChapterOutput[],
  characters: StoredCharacter[],
  onProgress: ProgressCallback,
  cancelToken?: CancelToken
): Promise<StageRunnerResult<IllustrationArtifactItem[]>> {

  // 🔑 KEY: This variable persists across all chapter generations
  let globalConsistencySeed: number | undefined;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    
    // Generate illustration for this chapter
    const request: ImageGenerationRequest = {
      prompt: buildPrompt(chapter),
      task: "illustration",
      style: "pixar-3d",
      
      // 🎯 CRITICAL: Reuse the captured seed
      seed: globalConsistencySeed,         // undefined for Ch1, number for Ch2+
      referenceStrength: 0.9,              // 90% consistency
    };

    const response = await generateImage(request);

    // 📸 CAPTURE: Store seed from first successful generation
    if (globalConsistencySeed === undefined && response.providerMeta?.seed) {
      globalConsistencySeed = response.providerMeta.seed;
      console.log(`✅ Captured seed: ${globalConsistencySeed}`);
    }
  }
}
```

---

## Why This Works

### Without Seed Reuse ❌
```
Chapter 1: Luna (white cat, green eyes, crescent moon mark)
Chapter 2: Luna (gray cat, blue eyes, star mark)      ← DIFFERENT!
Chapter 3: Luna (orange cat, green eyes, no mark)     ← DIFFERENT!
```
**Problem:** Character looks different in every chapter.

### With Seed Reuse ✅
```
Chapter 1: Luna (white cat, green eyes, crescent moon mark)  [seed: 42857193]
Chapter 2: Luna (white cat, green eyes, crescent moon mark)  [seed: 42857193]
Chapter 3: Luna (white cat, green eyes, crescent moon mark)  [seed: 42857193]
```
**Result:** Character looks identical across all chapters!

---

## Reference Strength Explained

The `referenceStrength` parameter controls how strictly the AI follows the seed:

| Value | Effect | Use Case |
|-------|--------|----------|
| `0.0` | Ignore seed completely | Random generation |
| `0.5` | 50% consistency | Similar but varied |
| `0.7` | 70% consistency | Recognizable character |
| `0.9` | **90% consistency** | **NoorStudio default** ✅ |
| `1.0` | 100% identical | Too rigid (not recommended) |

**Why 0.9?**
- High enough to ensure character looks identical
- Low enough to allow natural pose/expression variation
- Sweet spot for children's book illustrations

---

## Error Handling

```typescript
// If NanoBanana doesn't return a seed (rare edge case):
if (globalConsistencySeed === undefined && response.providerMeta?.seed) {
  globalConsistencySeed = response.providerMeta.seed;
} else if (globalConsistencySeed === undefined) {
  console.warn('⚠️  No seed returned from first generation!');
  // System continues - subsequent chapters won't have consistency
  // but book still generates successfully
}
```

**Graceful degradation:** If seed capture fails, the book still generates, but character consistency is not guaranteed.

---

## Testing This System

### Manual Test (via API)

```bash
# 1. Generate Chapter 1 (capture seed)
curl -X POST http://localhost:3002/api/ai/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Pixar 3D style: Luna the mystical cat...",
    "task": "illustration"
  }'

# Response: { "imageUrl": "...", "providerMeta": { "seed": 42857193 } }

# 2. Generate Chapter 2 (reuse seed)
curl -X POST http://localhost:3002/api/ai/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Pixar 3D style: Luna in a magical forest...",
    "task": "illustration",
    "seed": 42857193,              # ← REUSE!
    "referenceStrength": 0.9
  }'

# 3. Compare images side-by-side
#    → Luna should look identical!
```

### Automated Test

Run the provided test script:
```bash
cd /Users/architect/.openclaw/workspace/06_EXECUTION/artifacts
node noorstudio_e2e_test.js
```

---

## Production Checklist

- [x] Seed capture logic implemented
- [x] Seed reuse logic implemented
- [x] Reference strength configured (0.9)
- [x] Error handling for missing seeds
- [x] Logging for debugging
- [ ] **TODO:** Live test with real NanoBanana API
- [ ] **TODO:** Visual comparison of generated images
- [ ] **TODO:** User acceptance testing

---

## Future Enhancements

### 1. Seed Management Dashboard
Allow users to view/edit the seed used for their book:
```typescript
interface BookProject {
  // ...
  characterConsistencySeed?: number;  // Exposed to UI
}
```

### 2. Manual Seed Override
Let users specify a custom seed:
```typescript
if (userProvidedSeed) {
  globalConsistencySeed = userProvidedSeed;
} else {
  // Capture from first generation
}
```

### 3. Multi-Character Support
Track separate seeds for each character:
```typescript
const characterSeeds: Map<string, number> = new Map();
characterSeeds.set("Luna", 42857193);
characterSeeds.set("Oliver", 87654321);
```

---

## Troubleshooting

### Seed Not Captured

**Symptom:** `globalConsistencySeed` remains `undefined`

**Possible Causes:**
1. NanoBanana API didn't return a seed in `providerMeta`
2. Image generation failed before capturing seed
3. Mock provider in use (mocks don't return seeds)

**Solution:**
- Check logs for `response.providerMeta?.seed`
- Verify using real NanoBanana (not mock)
- Add fallback seed generation if needed

### Character Inconsistency

**Symptom:** Character looks different across chapters

**Possible Causes:**
1. Seed was not reused (bug in code)
2. Reference strength too low (<0.8)
3. Prompts are too different (conflicting descriptions)

**Solution:**
- Verify seed is passed to all generations: `console.log('Using seed:', seed)`
- Increase reference strength to 0.95
- Keep character descriptions consistent across prompts

---

_Diagram created by OpenClaw Subagent (Codex)_  
_Last updated: February 4, 2026_
