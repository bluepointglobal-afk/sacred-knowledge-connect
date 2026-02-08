import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8899;

const WORKSPACE = process.env.WORKSPACE || process.cwd();
// WORKSPACE is expected to be .../.openclaw/workspace
// Sessions live at .../.openclaw/agents/main/sessions
const SESSIONS_DIR = path.resolve(WORKSPACE, '../agents/main/sessions');

function safeJsonParse(line) {
  try { return JSON.parse(line); } catch { return null; }
}

function listJsonlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => path.join(dir, f));
}

function summarizeSession(jsonlPath) {
  const base = path.basename(jsonlPath);
  const content = fs.readFileSync(jsonlPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);

  let firstTs = null;
  let lastTs = null;
  let label = null;
  let model = null;
  let provider = null;
  let total = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: 0 };
  let counts = { user: 0, assistant: 0, tool: 0 };

  for (const line of lines) {
    const obj = safeJsonParse(line);
    if (!obj) continue;

    // session metadata (best-effort)
    if (obj.label && !label) label = obj.label;

    const msg = obj.message || obj;
    const role = msg.role;
    if (role === 'user') counts.user++;
    if (role === 'assistant') counts.assistant++;
    if (role === 'tool' || (msg.content && Array.isArray(msg.content) && msg.content.some(c => c.type === 'toolCall'))) counts.tool++;

    const ts = msg.timestamp || obj.timestamp;
    if (ts) {
      if (!firstTs) firstTs = ts;
      lastTs = ts;
    }

    if (msg.model && !model) model = msg.model;
    if (msg.provider && !provider) provider = msg.provider;

    const usage = msg.usage;
    if (usage) {
      total.input += usage.input || 0;
      total.output += usage.output || 0;
      total.cacheRead += usage.cacheRead || 0;
      total.cacheWrite += usage.cacheWrite || 0;
      total.totalTokens += usage.totalTokens || 0;
      const costObj = usage.cost;
      if (costObj) {
        total.cost += (costObj.total ?? 0);
      }
    }
  }

  return {
    file: base,
    path: jsonlPath,
    label: label || '(none)',
    model: model || '(unknown)',
    provider: provider || '(unknown)',
    firstTs,
    lastTs,
    counts,
    usage: total,
    lines: lines.length
  };
}

function computeStats(summaries) {
  const byModel = {};
  let grand = { cost: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0 };

  for (const s of summaries) {
    const m = s.model || '(unknown)';
    if (!byModel[m]) byModel[m] = { sessions: 0, cost: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0 };
    byModel[m].sessions++;
    byModel[m].cost += s.usage.cost;
    byModel[m].input += s.usage.input;
    byModel[m].output += s.usage.output;
    byModel[m].cacheRead += s.usage.cacheRead;
    byModel[m].cacheWrite += s.usage.cacheWrite;
    byModel[m].totalTokens += s.usage.totalTokens;

    grand.cost += s.usage.cost;
    grand.input += s.usage.input;
    grand.output += s.usage.output;
    grand.cacheRead += s.usage.cacheRead;
    grand.cacheWrite += s.usage.cacheWrite;
    grand.totalTokens += s.usage.totalTokens;
  }

  return { grand, byModel };
}

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/sessions', (_req, res) => {
  const files = listJsonlFiles(SESSIONS_DIR);
  const summaries = files
    .map(summarizeSession)
    .sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0));
  res.json({ sessionsDir: SESSIONS_DIR, count: summaries.length, sessions: summaries });
});

app.get('/api/sessions/:file', (req, res) => {
  const file = req.params.file;
  const target = path.join(SESSIONS_DIR, file);
  if (!target.startsWith(SESSIONS_DIR)) return res.status(400).json({ error: 'bad path' });
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  const content = fs.readFileSync(target, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);
  const events = lines.map(safeJsonParse).filter(Boolean);
  res.json({ file, events });
});

app.get('/api/stats', (_req, res) => {
  const files = listJsonlFiles(SESSIONS_DIR);
  const summaries = files.map(summarizeSession);
  res.json(computeStats(summaries));
});

app.listen(PORT, () => {
  console.log(`Control Center running on http://localhost:${PORT}`);
  console.log(`Sessions dir: ${SESSIONS_DIR}`);
});
