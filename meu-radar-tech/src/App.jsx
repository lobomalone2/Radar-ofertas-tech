import { useState, useEffect, useMemo } from 'react'
import OfferCard from './components/OfferCard'
import HeroCarousel from './components/hotBanner' // Substituí o HotBanner pelo seu Carousel
import CategoryMenu from './components/CategoryMenu'
import { OFFERS as FAKE_OFFERS } from './data/offers'

const API = 'https://underpay-uptake-native.ngrok-free.dev';

// Paleta de cores Premium Streetwear
const theme = {
  bg: '#000000',
  surface: '#111111',
  text: '#FFFFFF',
  muted: '#888888',
  accent: '#FF5500', // Laranja da águia
  border: '#222222'
};

export default function App() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [modo, setModo] = useState('')
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    const carregarOfertas = async () => {
      try {
        const response = await fetch(`${API}/api/relampago`, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true', 
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = await response.json()
        if (!json.data || json.data.length === 0) throw new Error('Sem dados')
        setOffers(json.data)
        setModo('api')
      } catch (err) {
        console.warn('Backend indisponível, usando dados demo:', err.message)
        setOffers(FAKE_OFFERS)
        setModo('demo')
      } finally {
        setLoading(false)
      }
    }
    carregarOfertas()
  }, [])

  const categorias = useMemo(() => {
    return ['Todos', ...new Set(offers.map(o => o.categoria).filter(Boolean))]
  }, [offers])

  const filtrados = useMemo(() =>
    offers.filter(o => {
      const matchCat = categoria === 'Todos' || o.categoria === categoria
      const matchBusca = !busca || o.titulo.toLowerCase().includes(busca.toLowerCase())
      return matchCat && matchBusca
    }),
    [offers, categoria, busca]
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER FIXO */}
      <header style={{
        borderBottom: `1px solid ${theme.border}`,
        padding: '0 2rem', height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: theme.bg, zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          
          <button
            onClick={() => setMenuAberto(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}
            aria-label="Abrir Menu"
          >
            <svg width="26" height="26" viewBox="2 2 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {/* LOGO GARIMPOS ORIGINAIS */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            {/* Substitua este bloco por: <img src="/logo.png" alt="Logo" style={{height: 35}} /> */}
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, color: theme.text, letterSpacing: '1px' }}>
              GARIMPOS
            </span>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 12, color: theme.accent, letterSpacing: '3px', marginTop: '-4px' }}>
              ORIGINAIS
            </span>
          </div>

          {modo === 'demo' && (
            <span style={{ fontSize: 10, color: theme.muted, border: `1px solid ${theme.border}`, padding: '2px 6px', textTransform: 'uppercase' }}>
              Demo
            </span>
          )}
        </div>

        {/* Busca Minimalista */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: theme.surface, border: `1px solid ${theme.border}`,
          padding: '8px 16px', width: 260, transition: 'border 0.2s',
        }}
        className="hover:border-gray-600"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke={theme.muted} strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke={theme.muted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Procurar..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: theme.text, fontSize: 13, width: '100%',
            }}
          />
        </div>
      </header>

      <CategoryMenu
        categorias={categorias}
        categoria={categoria}
        setCategoria={setCategoria}
        isOpen={menuAberto}
        setIsOpen={setMenuAberto}
        totalProdutos={filtrados.length}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Banner Carousel */}
        {!loading && <HeroCarousel />}

        {/* Título da Seção / Filtro Ativo */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          margin: '3rem 0 2rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '1rem'
        }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 32, textTransform: 'uppercase', color: theme.text }}>
            {categoria === 'Todos' ? 'Todos os Garimpos' : categoria}
          </h2>
          <div style={{ color: theme.muted, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            {filtrados.length} ITENS
          </div>
        </div>

        {/* Grid de Ofertas */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: theme.muted, fontFamily: "'Anton', sans-serif", fontSize: 20 }}>
            CARREGANDO...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: theme.muted, fontFamily: "'Anton', sans-serif", fontSize: 20 }}>
            NENHUM ITEM ENCONTRADO.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtrados.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer style={{
        textAlign: 'center', padding: '4rem 2rem',
        fontFamily: "'Anton', sans-serif", fontSize: 14,
        color: theme.muted, letterSpacing: '2px', textTransform: 'uppercase',
        borderTop: `1px solid ${theme.border}`
      }}>
        Garimpos Originais © {new Date().getFullYear()}<br/>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0', textTransform: 'none' }}>
          Autenticidade e estilo em cada detalhe.
        </span>
      </footer>
    </div>
  )
}