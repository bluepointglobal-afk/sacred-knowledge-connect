const { chromium } = require('playwright');

const projects = [
  { name: 'AFAQ', url: 'https://afaq-esg-navigator.vercel.app' },
  { name: 'Noorstudio', url: 'https://noorstudio-staging.vercel.app' },
];

async function qaProject(name, url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    await page.waitForTimeout(2000);
    console.log(`[${name}] ${resp.status()} | title: "${title}" | console errors: ${errors.length}`);
  } catch (e) {
    console.log(`[${name}] ERROR: ${e.message}`);
  }
  await browser.close();
}

(async () => {
  for (const p of projects) await qaProject(p.name, p.url);
})();
