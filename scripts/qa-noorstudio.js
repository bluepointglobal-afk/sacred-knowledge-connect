const { chromium } = require('playwright');

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://noorstudio-staging.vercel.app';
  const results = [];
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  // Test 1: Homepage loads
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  results.push({ test: 'Homepage 200', pass: resp.status() === 200 });

  // Test 2: Pricing page
  try {
    await page.goto(`${url}/pricing`, { waitUntil: 'networkidle', timeout: 15000 });
    results.push({ test: 'Pricing page accessible', pass: true });
  } catch { results.push({ test: 'Pricing page accessible', pass: false }); }

  // Test 3: Examples page
  try {
    await page.goto(`${url}/examples`, { timeout: 15000 });
    results.push({ test: 'Examples page accessible', pass: true });
  } catch { results.push({ test: 'Examples page accessible', pass: false }); }

  // Test 4: No critical errors
  results.push({ test: 'No critical errors', pass: errors.length < 5 });

  await browser.close();

  const passed = results.filter(r => r.pass).length;
  console.log(`Noorstudio QA: ${passed}/${results.length} (${Math.round(passed/results.length*100)}%)`);
  results.forEach(r => console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.test}`));
}
runQA().catch(e => console.error('QA ERROR:', e.message));
