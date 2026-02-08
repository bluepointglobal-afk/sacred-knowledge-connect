/**
 * NoorStudio End-to-End Character Consistency Test
 * Tests the seed capture and reuse mechanism across 3 chapters
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://localhost:3002';
const ARTIFACTS_DIR = '/Users/architect/.openclaw/workspace/06_EXECUTION/artifacts';
const CHAPTERS_DIR = path.join(ARTIFACTS_DIR, 'NoorStudio_chapters');

// Ensure directories exist
if (!fs.existsSync(CHAPTERS_DIR)) {
  fs.mkdirSync(CHAPTERS_DIR, { recursive: true });
}

// Test configuration
const TEST_CONFIG = {
  bookTitle: "Luna the Moon Cat",
  genre: "Adventure",
  ageRange: "4-8",
  mainCharacter: "Luna (a mystical cat)",
  premise: "Luna discovers a magical forest"
};

// Results tracker
const testResults = {
  setup: { success: false, errors: [] },
  chapter1: { success: false, seed: null, imageUrl: null, text: null, errors: [] },
  chapter2: { success: false, seed: null, imageUrl: null, text: null, seedReused: false, errors: [] },
  chapter3: { success: false, seed: null, imageUrl: null, text: null, seedReused: false, errors: [] },
  consistency: { verdict: "Not tested", notes: [] }
};

/**
 * Make HTTP request
 */
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Test server connectivity
 */
async function testServerConnection() {
  console.log('🔍 Testing server connection...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/ai/status',
      method: 'GET'
    });

    if (response.statusCode === 200) {
      console.log('✅ Server is running');
      console.log('   Text Provider:', response.data.textProvider);
      console.log('   Image Provider:', response.data.imageProvider);
      console.log('   Claude Configured:', response.data.claudeConfigured);
      console.log('   NanoBanana Configured:', response.data.nanobananaConfigured);
      testResults.setup.success = true;
      return true;
    } else {
      throw new Error(`Server returned status ${response.statusCode}`);
    }
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    testResults.setup.errors.push(error.message);
    return false;
  }
}

/**
 * Generate chapter text
 */
async function generateChapterText(chapterNumber, context = '') {
  console.log(`\n📝 Generating text for Chapter ${chapterNumber}...`);
  
  const system = `You are a children's book author specializing in adventure stories for ages 4-8. Write engaging, age-appropriate content with vivid imagery and simple language.`;
  
  const prompt = `Write Chapter ${chapterNumber} of "${TEST_CONFIG.bookTitle}".

Premise: ${TEST_CONFIG.premise}
Main Character: ${TEST_CONFIG.mainCharacter}
${context ? `Previous Context: ${context}` : ''}

Write a complete chapter (300-400 words) that:
- Features Luna the mystical moon cat prominently
- Describes Luna's appearance clearly (for illustration purposes)
- Has an exciting adventure moment
- Is appropriate for ages ${TEST_CONFIG.ageRange}

Return the chapter text in JSON format:
{
  "chapter_title": "Chapter ${chapterNumber}: [Title]",
  "chapter_number": ${chapterNumber},
  "text": "[Full chapter text here]",
  "character_description": "[Brief visual description of Luna for illustration]"
}`;

  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/ai/text',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      system,
      prompt,
      maxOutputTokens: 1500,
      stage: 'chapters'
    });

    if (response.statusCode === 200) {
      const result = JSON.parse(response.data.text);
      console.log(`✅ Chapter ${chapterNumber} text generated (${result.text.length} chars)`);
      return result;
    } else {
      throw new Error(`Text generation failed: ${response.statusCode}`);
    }
  } catch (error) {
    console.error(`❌ Chapter ${chapterNumber} text generation failed:`, error.message);
    throw error;
  }
}

/**
 * Generate chapter illustration
 */
async function generateChapterIllustration(chapterNumber, characterDescription, seed = null) {
  console.log(`🎨 Generating illustration for Chapter ${chapterNumber}${seed ? ` (with seed: ${seed})` : ' (first generation)'}...`);
  
  const prompt = `Children's book illustration in Pixar 3D style: ${characterDescription}

Luna is a mystical moon cat with:
- Soft, fluffy white fur with subtle silver shimmer
- Large, expressive green eyes
- Small crescent moon marking on forehead
- Delicate pink nose
- Graceful, feline body
- Wearing a tiny star-shaped collar

Scene: Magical forest setting with soft lighting, child-friendly atmosphere, warm colors, whimsical details.

Style: High-quality Pixar 3D render, soft lighting, detailed textures, child-friendly, no text or words.`;

  const requestBody = {
    task: 'illustration',
    prompt,
    style: 'pixar-3d',
    size: { width: 1024, height: 768 },
    count: 1,
    stage: 'illustrations'
  };

  // If seed is provided, add it for consistency
  if (seed !== null) {
    requestBody.seed = seed;
    requestBody.referenceStrength = 0.9;
  }

  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/ai/image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, requestBody);

    if (response.statusCode === 200) {
      const imageUrl = response.data.imageUrl;
      const returnedSeed = response.data.providerMeta?.seed;
      
      console.log(`✅ Chapter ${chapterNumber} illustration generated`);
      console.log(`   Image URL: ${imageUrl}`);
      console.log(`   Seed: ${returnedSeed || 'Not provided'}`);
      
      return { imageUrl, seed: returnedSeed };
    } else {
      throw new Error(`Image generation failed: ${response.statusCode} - ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error(`❌ Chapter ${chapterNumber} illustration failed:`, error.message);
    throw error;
  }
}

/**
 * Download and save image
 */
async function saveImage(imageUrl, chapterNumber) {
  // For now, just save the URL since images might be base64 or need special handling
  const metadata = {
    chapter: chapterNumber,
    imageUrl,
    downloadedAt: new Date().toISOString()
  };
  
  const metadataPath = path.join(CHAPTERS_DIR, `chapter_${chapterNumber}_metadata.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`   Metadata saved: ${metadataPath}`);
}

/**
 * Generate a single chapter (text + illustration)
 */
async function generateChapter(chapterNumber, previousContext = '', seedToReuse = null) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`CHAPTER ${chapterNumber} GENERATION`);
  console.log('='.repeat(60));
  
  const chapterKey = `chapter${chapterNumber}`;
  
  try {
    // 1. Generate text
    const textResult = await generateChapterText(chapterNumber, previousContext);
    testResults[chapterKey].text = textResult.text;
    testResults[chapterKey].success = true;
    
    // 2. Generate illustration
    const illustrationResult = await generateChapterIllustration(
      chapterNumber,
      textResult.character_description || TEST_CONFIG.mainCharacter,
      seedToReuse
    );
    
    testResults[chapterKey].imageUrl = illustrationResult.imageUrl;
    testResults[chapterKey].seed = illustrationResult.seed;
    
    if (seedToReuse && illustrationResult.seed === seedToReuse) {
      testResults[chapterKey].seedReused = true;
      console.log('✅ Seed successfully reused for character consistency');
    } else if (seedToReuse) {
      console.log('⚠️  Seed mismatch - character consistency may be affected');
      testResults[chapterKey].errors.push('Seed was not reused as expected');
    }
    
    // 3. Save artifacts
    await saveImage(illustrationResult.imageUrl, chapterNumber);
    
    // Save chapter text
    const textPath = path.join(CHAPTERS_DIR, `chapter_${chapterNumber}_text.txt`);
    fs.writeFileSync(textPath, `${textResult.chapter_title}\n\n${textResult.text}`);
    console.log(`   Text saved: ${textPath}`);
    
    return {
      text: textResult.text,
      seed: illustrationResult.seed,
      imageUrl: illustrationResult.imageUrl
    };
    
  } catch (error) {
    testResults[chapterKey].errors.push(error.message);
    throw error;
  }
}

/**
 * Generate test report
 */
function generateReport() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('TEST REPORT');
  console.log('='.repeat(60));
  
  const report = [];
  report.push('# NoorStudio End-to-End Character Consistency Test Results');
  report.push(`\n**Test Date:** ${new Date().toISOString()}`);
  report.push(`\n**Book:** ${TEST_CONFIG.bookTitle}`);
  report.push(`\n## Test Configuration\n`);
  report.push(`- Genre: ${TEST_CONFIG.genre}`);
  report.push(`- Age Range: ${TEST_CONFIG.ageRange}`);
  report.push(`- Main Character: ${TEST_CONFIG.mainCharacter}`);
  report.push(`- Premise: ${TEST_CONFIG.premise}`);
  
  report.push(`\n## Setup\n`);
  report.push(`- Status: ${testResults.setup.success ? '✅ Success' : '❌ Failed'}`);
  if (testResults.setup.errors.length > 0) {
    report.push(`- Errors: ${testResults.setup.errors.join(', ')}`);
  }
  
  // Chapter results
  for (let i = 1; i <= 3; i++) {
    const key = `chapter${i}`;
    const chapter = testResults[key];
    report.push(`\n## Chapter ${i}\n`);
    report.push(`- Text Generation: ${chapter.text ? '✅ Success' : '❌ Failed'}`);
    report.push(`- Image Generation: ${chapter.imageUrl ? '✅ Success' : '❌ Failed'}`);
    report.push(`- Seed Captured: ${chapter.seed || 'N/A'}`);
    if (i > 1) {
      report.push(`- Seed Reused: ${chapter.seedReused ? '✅ Yes' : '❌ No'}`);
    }
    if (chapter.errors.length > 0) {
      report.push(`- Errors: ${chapter.errors.join(', ')}`);
    }
  }
  
  // Character consistency analysis
  report.push(`\n## Character Consistency Analysis\n`);
  
  const allSeeds = [
    testResults.chapter1.seed,
    testResults.chapter2.seed,
    testResults.chapter3.seed
  ].filter(s => s !== null);
  
  const uniqueSeeds = [...new Set(allSeeds)];
  
  if (uniqueSeeds.length === 1 && allSeeds.length === 3) {
    testResults.consistency.verdict = 'Perfect';
    report.push('- **Verdict: PERFECT** ✅');
    report.push(`- All 3 chapters used the same seed: ${uniqueSeeds[0]}`);
    report.push('- Character appearance should be identical across all chapters');
  } else if (uniqueSeeds.length === 1 && allSeeds.length > 0) {
    testResults.consistency.verdict = 'Good';
    report.push('- **Verdict: GOOD** ⚠️');
    report.push(`- Seed was consistent where present: ${uniqueSeeds[0]}`);
    report.push('- Some chapters may be missing seed data');
  } else if (uniqueSeeds.length > 1) {
    testResults.consistency.verdict = 'Needs Work';
    report.push('- **Verdict: NEEDS WORK** ❌');
    report.push(`- Multiple seeds used: ${uniqueSeeds.join(', ')}`);
    report.push('- Character appearance may vary between chapters');
    report.push('- Seed reuse mechanism may not be working correctly');
  } else {
    testResults.consistency.verdict = 'Failed';
    report.push('- **Verdict: FAILED** ❌');
    report.push('- No seeds were captured from any chapter');
    report.push('- Character consistency cannot be verified');
  }
  
  // Final verdict
  report.push(`\n## Final Verdict\n`);
  
  const allChaptersSucceeded = 
    testResults.chapter1.success && 
    testResults.chapter2.success && 
    testResults.chapter3.success;
  
  const seedConsistencyGood = 
    testResults.consistency.verdict === 'Perfect' || 
    testResults.consistency.verdict === 'Good';
  
  if (allChaptersSucceeded && seedConsistencyGood) {
    report.push('**✅ READY TO SHIP**');
    report.push('\nAll systems operational:');
    report.push('- ✅ Text generation working');
    report.push('- ✅ Image generation working');
    report.push('- ✅ Seed capture and reuse working');
    report.push('- ✅ Character consistency achieved');
  } else {
    report.push('**❌ NEEDS FIXES**');
    report.push('\nIssues to address:');
    if (!allChaptersSucceeded) {
      report.push('- ❌ Some chapters failed to generate');
    }
    if (!seedConsistencyGood) {
      report.push('- ❌ Character consistency mechanism needs fixing');
    }
  }
  
  // Save report
  const reportPath = path.join(ARTIFACTS_DIR, 'NoorStudio_E2E_TEST_RESULTS_2026-02-04.md');
  fs.writeFileSync(reportPath, report.join('\n'));
  console.log(`\n📄 Report saved: ${reportPath}`);
  
  // Also print to console
  console.log('\n' + report.join('\n'));
}

/**
 * Main test execution
 */
async function runTest() {
  console.log('🚀 Starting NoorStudio End-to-End Character Consistency Test\n');
  
  try {
    // 1. Test server connection
    const serverOk = await testServerConnection();
    if (!serverOk) {
      throw new Error('Server not available');
    }
    
    // 2. Generate Chapter 1 (capture initial seed)
    const chapter1 = await generateChapter(1);
    const masterSeed = chapter1.seed;
    
    if (!masterSeed) {
      console.warn('⚠️  WARNING: No seed captured from Chapter 1! Character consistency cannot be verified.');
    }
    
    // 3. Generate Chapter 2 (reuse seed)
    await generateChapter(2, chapter1.text.substring(0, 200), masterSeed);
    
    // 4. Generate Chapter 3 (reuse seed)
    await generateChapter(3, testResults.chapter2.text?.substring(0, 200), masterSeed);
    
    // 5. Generate final report
    generateReport();
    
    console.log('\n✅ Test completed successfully!');
    console.log(`\nArtifacts saved to: ${ARTIFACTS_DIR}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    generateReport(); // Generate report even on failure
    process.exit(1);
  }
}

// Run the test
runTest();
