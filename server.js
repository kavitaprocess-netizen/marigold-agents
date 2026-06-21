const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Lazily require @vercel/kv so the app still boots locally / before KV is configured.
let kv = null;
try {
  kv = require('@vercel/kv').kv;
} catch (e) {
  console.warn('Vercel KV package not available \u2014 save/load routes will return a clear error until configured.');
}

function normalizeEmail(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().toLowerCase();
  // simple, permissive email shape check \u2014 not exhaustive RFC validation, just enough to avoid garbage keys
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

app.post('/api/save-plan', async (req, res) => {
  if (!kv) {
    return res.status(500).json({ error: { message: 'Storage is not configured yet. Enable Vercel KV and set its environment variables, then redeploy.' } });
  }
  const email = normalizeEmail(req.body.email);
  if (!email) {
    return res.status(400).json({ error: { message: 'A valid email is required to save.' } });
  }
  const data = req.body.data;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: { message: 'No plan data provided.' } });
  }
  try {
    const record = { data, savedAt: Date.now() };
    await kv.set('marigold:plan:' + email, JSON.stringify(record));
    res.json({ ok: true, savedAt: record.savedAt });
  } catch (e) {
    res.status(500).json({ error: { message: 'Could not save: ' + e.message } });
  }
});

app.get('/api/load-plan', async (req, res) => {
  if (!kv) {
    return res.status(500).json({ error: { message: 'Storage is not configured yet. Enable Vercel KV and set its environment variables, then redeploy.' } });
  }
  const email = normalizeEmail(req.query.email);
  if (!email) {
    return res.status(400).json({ error: { message: 'A valid email is required to load.' } });
  }
  try {
    const raw = await kv.get('marigold:plan:' + email);
    if (!raw) {
      return res.json({ ok: true, found: false });
    }
    const record = typeof raw === 'string' ? JSON.parse(raw) : raw;
    res.json({ ok: true, found: true, data: record.data, savedAt: record.savedAt });
  } catch (e) {
    res.status(500).json({ error: { message: 'Could not load: ' + e.message } });
  }
});

app.post('/api/delete-plan', async (req, res) => {
  if (!kv) {
    return res.status(500).json({ error: { message: 'Storage is not configured yet. Enable Vercel KV and set its environment variables, then redeploy.' } });
  }
  const email = normalizeEmail(req.body.email);
  if (!email) {
    return res.status(400).json({ error: { message: 'A valid email is required to delete.' } });
  }
  try {
    await kv.del('marigold:plan:' + email);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: { message: 'Could not delete: ' + e.message } });
  }
});

app.post('/api/chat', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY environment variable not set.' } });
  }

  const payload = JSON.stringify({
    model: req.body.model || 'claude-sonnet-4-6',
    max_tokens: req.body.max_tokens || 1000,
    system: req.body.system || '',
    messages: req.body.messages || []
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'anthropic-version': '2023-06-01',
      'x-api-key': key
    }
  };

  const pr = https.request(options, ar => {
    let data = '';
    ar.on('data', chunk => data += chunk);
    ar.on('end', () => {
      res.status(ar.statusCode).set('Content-Type', 'application/json').send(data);
    });
  });

  pr.on('error', e => res.status(500).json({ error: { message: e.message } }));
  pr.write(payload);
  pr.end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Marigold running on port ' + PORT));
