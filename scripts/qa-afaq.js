const { chromium } = require('playwright');

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://afaq-esg-navigator.vercel.app';
  const results = [];
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  // Test 1: Homepage loads
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  results.push({ test: 'Homepage 200', pass: resp.status() === 200 });

  // Test 2: Auth page exists
  try {
    await page.goto(`${url}/auth`, { waitUntil: 'networkidle', timeout: 15000 });
    results.push({ test: 'Auth page accessible', pass: true });
  } catch { results.push({ test: 'Auth page accessible', pass: false }); }

  // Test 3: Dashboard accessible (might need auth)
  try {
    const dashResp = await page.goto(`${url}/dashboard`, { timeout: 15000 });
    results.push({ test: 'Dashboard accessible', pass: dashResp.status() === 200 });
  } catch { results.push({ test: 'Dashboard accessible', pass: false }); }

  // Test 4: No critical console errors
  results.push({ test: 'No critical errors', pass: errors.length < 5 });

  await browser.close();

  const passed = results.filter(r => r.pass).length;
  console.log(`AFAQ QA: ${passed}/${results.length} (${Math.round(passed/results.length*100)}%)`);
  results.forEach(r => console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.test}`));
}
runQA().catch(e => console.error('QA ERROR:', e.message));
