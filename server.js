require('dotenv').config();
const express = require('express');
const path    = require('path');
const { buscarProdutos, buscarRelampago } = require('./automacoes/services/mercadolivre');
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS para dev ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// ─── Serve o frontend buildado ────────────────────────────────────────────────
// Após rodar `npm run build` no frontend, copie o dist/ para backend/public/
app.use(express.static(path.join(__dirname, 'public')));

// ─── Cache em memória ─────────────────────────────────────────────────────────
const cache = {
  relampago: { data: null, expiresAt: 0 },
  busca:     {},
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// ─── GET /api/relampago ───────────────────────────────────────────────────────
app.get('/api/relampago', async (req, res) => {
  try {
    const agora = Date.now();

    if (cache.relampago.data && agora < cache.relampago.expiresAt) {
      return res.json({ ok: true, cached: true, total: cache.relampago.data.length, data: cache.relampago.data });
    }

    const ofertas = await buscarRelampago();
    cache.relampago = { data: ofertas, expiresAt: agora + CACHE_TTL };

    res.json({ ok: true, cached: false, total: ofertas.length, data: ofertas });
  } catch (err) {
    console.error('❌ /api/relampago:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── GET /api/buscar?q=termo ──────────────────────────────────────────────────
app.get('/api/buscar', async (req, res) => {
  const termo = req.query.q?.trim();
  if (!termo) return res.status(400).json({ ok: false, error: 'Parâmetro ?q= obrigatório' });

  try {
    const agora    = Date.now();
    const cacheKey = termo.toLowerCase();

    if (cache.busca[cacheKey] && agora < cache.busca[cacheKey].expiresAt) {
      return res.json({ ok: true, cached: true, termo, total: cache.busca[cacheKey].data.length, data: cache.busca[cacheKey].data });
    }

    const produtos = await buscarProdutos(termo);
    cache.busca[cacheKey] = { data: produtos, expiresAt: agora + CACHE_TTL };

    res.json({ ok: true, cached: false, termo, total: produtos.length, data: produtos });
  } catch (err) {
    console.error('❌ /api/buscar:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── GET /api/status ──────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    ok:     true,
    status: 'online',
    uptime: `${Math.round(process.uptime())}s`,
    cache: {
      relampago: cache.relampago.data
        ? `${cache.relampago.data.length} ofertas · expira em ${Math.round((cache.relampago.expiresAt - Date.now()) / 1000)}s`
        : 'vazio',
      buscas: Object.keys(cache.busca).length,
    },
    env: {
      ML_CLIENT_ID:   process.env.ML_CLIENT_ID   ? '✓' : '✗ faltando',
      TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ? '✓' : '✗ faltando',
    },
  });
});

// ─── Fallback SPA ─────────────────────────────────────────────────────────────
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});



app.listen(PORT, () => {
  console.log(`\n🟢 Server em http://localhost:${PORT}`);
  console.log(`   /api/relampago  → ofertas`);
  console.log(`   /api/buscar?q=  → busca`);
  console.log(`   /api/status     → health check\n`);
});

module.exports = app;
