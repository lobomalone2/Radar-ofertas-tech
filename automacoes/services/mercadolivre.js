const axios = require('axios');

// ─── Afiliado ─────────────────────────────────────────────────────────────────
const TRACKING_ID = process.env.ML_TRACKING_ID || 'cdbfghaec46766';
// Adiciona o parâmetro de afiliado ao permalink do produto
function linkAfiliado(permalink) {
  const url = new URL(permalink);
  url.searchParams.set('matt_tool', TRACKING_ID);
  return url.toString();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function obterAccessToken() {
  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
      grant_type:    'client_credentials',
      client_id:     process.env.ML_CLIENT_ID,
      client_secret: process.env.ML_CLIENT_SECRET,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro de autenticação ML:', error.response?.data || error.message);
    return null;
  }
}

// ─── Busca por termo ──────────────────────────────────────────────────────────
async function buscarProdutos(termo) {
  const token = await obterAccessToken();
  if (!token) return [];

  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=3`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.results.map(item => ({
      id:     item.id,
      titulo: item.title,
      preco:  item.price,
      link:   linkAfiliado(item.permalink),
      foto:   item.thumbnail.replace('-I.jpg', '-O.jpg'),
    }));
  } catch (error) {
    console.error('❌ Erro na busca:', error.message);
    return [];
  }
}

// ─── Ofertas relâmpago ────────────────────────────────────────────────────────
const CATEGORIAS_HARDWARE = [
  'MLB1648', // Computação
  'MLB1051', // Eletrônicos
];

async function buscarRelampago() {
  const token = await obterAccessToken();
  if (!token) return [];

  const resultados = [];

  for (const cat of CATEGORIAS_HARDWARE) {
    try {
      const url = `https://api.mercadolibre.com/sites/MLB/search?category=${cat}&sort=relevance&promotions=deal&limit=5`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ofertas = response.data.results
        .filter(item => item.original_price && item.price < item.original_price)
        .map(item => {
          const precoOriginal = item.original_price;
          const preco         = item.price;
          const desconto      = Math.round(((precoOriginal - preco) / precoOriginal) * 100);
          return {
            id:            item.id,
            titulo:        item.title,
            preco,
            precoOriginal,
            desconto,
            link:          linkAfiliado(item.permalink),
            foto:          item.thumbnail.replace('-I.jpg', '-O.jpg'),
            categoria:     cat,
            hot:           desconto >= 30,
            expiresAt:     Date.now() + 2 * 60 * 60 * 1000,
          };
        })
        .filter(item => item.desconto >= 10);

      resultados.push(...ofertas);
    } catch (error) {
      console.error(`❌ Erro categoria ${cat}:`, error.message);
    }
  }

  return resultados
    .sort((a, b) => b.desconto - a.desconto)
    .slice(0, 12);
}

module.exports = { buscarProdutos, buscarRelampago };