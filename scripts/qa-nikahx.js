const { chromium } = require('playwright');

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://nikahplus-app.vercel.app';
  const results = [];
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  // Test 1: Homepage loads with 200
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  results.push({ test: 'Homepage loads (200)', pass: resp.status() === 200, detail: `status ${resp.status()}` });

  // Test 2: Title is not error page
  const title = await page.title();
  results.push({ test: 'Title is not error', pass: !title.includes('failed') && !title.includes('404'), detail: title });

  // Test 3: Body has content
  const bodyText = await page.textContent('body');
  results.push({ test: 'Body has content', pass: bodyText.length > 100, detail: `${bodyText.length} chars` });

  // Test 4: No critical console errors
  await page.waitForTimeout(3000);
  results.push({ test: 'No critical console errors', pass: errors.length < 3, detail: `${errors.length} errors` });

  // Test 5: Navigation links exist
  const links = await page.$$('a');
  results.push({ test: 'Has navigation links', pass: links.length > 0, detail: `${links.length} links` });

  await browser.close();

  const passed = results.filter(r => r.pass).length;
  console.log(`\n=== NikahX QA: ${passed}/${results.length} passed ===\n`);
  results.forEach(r => console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.test} — ${r.detail}`));
}
runQA().catch(e => console.error('QA ERROR:', e.message));
