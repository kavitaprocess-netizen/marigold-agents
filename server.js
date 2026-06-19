const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
