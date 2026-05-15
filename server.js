require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

const JSON_PATH = path.join(__dirname, 'automacoes', 'services', 'ofertas_mercadolivre.json');

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});


function lerOfertas() {
  try {
    if (!fs.existsSync(JSON_PATH)) return [];
    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    return data.map(item => ({
      ...item,
      expiresAt: item.expiresAt || Date.now() + 2 * 60 * 60 * 1000,
    }));
  } catch (err) {
    console.error('Erro ao ler JSON:', err.message);
    return [];
  }
}


app.get('/api/relampago', (req, res) => {
  const ofertas = lerOfertas();
  res.json({ ok: true, total: ofertas.length, data: ofertas });
});


app.get('/api/buscar', (req, res) => {
  const termo = req.query.q?.trim().toLowerCase();
  if (!termo) return res.status(400).json({ ok: false, error: 'Parametro ?q= obrigatorio' });

  const filtrado = lerOfertas().filter(o =>
    o.titulo?.toLowerCase().includes(termo) ||
    o.categoria?.toLowerCase().includes(termo)
  );
  res.json({ ok: true, total: filtrado.length, data: filtrado });
});


app.get('/api/status', (req, res) => {
  const existe = fs.existsSync(JSON_PATH);
  res.json({
    ok:            true,
    status:        'online',
    uptime:        `${Math.round(process.uptime())}s`,
    json_existe:   existe,
    total_ofertas: existe ? lerOfertas().length : 0,
  });
});

// ─── Frontend ─────────────────────────────────────────────────────────────────
const distPath = path.join(__dirname, 'meu-radar-tech', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  
} else {
  
  app.get('/', (req, res) => res.json({
    ok:  true,
    msg: 'API online.',
    endpoints: ['/api/relampago', '/api/buscar?q=', '/api/status'],
  }));
}



app.listen(PORT, () => {
  console.log(`\nServidor em http://localhost:${PORT}`);
  console.log(`  /api/relampago  -> serve ofertas_mercadolivre.json`);
  console.log(`  /api/buscar?q=  -> filtra por termo`);
  console.log(`  /api/status     -> health check\n`);
  
});
