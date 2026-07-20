import { useState, useEffect, useMemo } from 'react'
import OfferCard from './components/OfferCard'
import HotBanner from './components/hotBanner'
import CategoryMenu from './components/CategoryMenu'
import { OFFERS as FAKE_OFFERS } from './data/offers'

const API = 'https://underpay-uptake-native.ngrok-free.dev';

export default function App() {
  const [offers,     setOffers]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [categoria,  setCategoria]  = useState('Todos')
  const [busca,      setBusca]      = useState('')
  const [modo,       setModo]       = useState('')
  const [menuAberto, setMenuAberto] = useState(false) // Controle global do menu lateral

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
      const matchCat   = categoria === 'Todos' || o.categoria === categoria
      const matchBusca = !busca ||
        o.titulo.toLowerCase().includes(busca.toLowerCase())
      return matchCat && matchBusca
    }),
    [offers, categoria, busca]
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#05070a' }}>

      {/* HEADER FIXO GLOBAL */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 1.5rem', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(8px)', zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* BOTÃO HAMBÚRGUER (Abre a gaveta em qualquer lugar do site) */}
          <button
            onClick={() => setMenuAberto(true)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              color: '#f0f0f0'
            }}
            aria-label="Abrir Menu de Categorias"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 13,
            fontWeight: 500, letterSpacing: '0.06em', color: '#f0f0f0',
          }}>
            MEU RADAR<span style={{ color: '#e8ff57' }}>.</span>TECH
          </span>

          {modo === 'demo' && (
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-mono)',
              color: '#6b6b6b', border: '1px solid rgba(255,255,255,0.08)',
              padding: '2px 6px', borderRadius: 3,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              demo
            </span>
          )}
        </div>

        {/* Busca */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#181818', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8, padding: '6px 12px', width: 220,
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#6b6b6b" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: '#f0f0f0', fontFamily: 'var(--font-sans)',
              fontSize: 13, width: '100%',
            }}
          />
          {busca && (
            <button onClick={() => setBusca('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b6b6b', fontSize: 16, lineHeight: 1, padding: 0,
            }}>×</button>
          )}
        </div>
      </header>

      {/* GAVETA DE CATEGORIAS (Sobrepõe toda a tela com z-index elevado) */}
      <CategoryMenu
        categorias={categorias}
        categoria={categoria}
        setCategoria={setCategoria}
        isOpen={menuAberto}
        setIsOpen={setMenuAberto}
        totalProdutos={filtrados.length}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Status da Categoria Ativa / Indicador no topo da página */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}>
          <div style={{ color: '#6b6b6b' }}>
            CATEGORIA: <span style={{ color: '#e8ff57', fontWeight: 600 }}>{categoria.toUpperCase()}</span>
          </div>
          <div style={{ color: '#4a4a4a', fontSize: 11 }}>
            {filtrados.length} produto{filtrados.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Hot Banner */}
        {!loading && <HotBanner offers={offers} />}

        {/* Grid de Ofertas */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '5rem 0',
            color: '#4a4a4a', fontFamily: 'var(--font-mono)', fontSize: 13,
          }}>
            Carregando...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 0',
            color: '#4a4a4a', fontFamily: 'var(--font-mono)', fontSize: 13,
          }}>
            Nenhum produto encontrado.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            {filtrados.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer style={{
        textAlign: 'center', padding: '3rem 2rem',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: '#2a2a2a', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Meu Radar Tech · Mercado Livre · {new Date().getFullYear()}
      </footer>
    </div>
  )
}