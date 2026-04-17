import { useState, useMemo } from 'react'
import OfferCard from './components/OfferCard'
import { OFFERS, CATEGORIAS } from './data/offers'

export default function App() {
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(() =>
    OFFERS.filter(o => {
      const matchCat = categoria === 'Todos' || o.categoria === categoria
      const matchBusca = !busca || o.titulo.toLowerCase().includes(busca.toLowerCase())
      return matchCat && matchBusca
    }),
    [categoria, busca]
  )

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 2rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(15,15,15,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: '#f0f0f0',
        }}>
          RADAR
          <span style={{ color: '#e8ff57' }}>.</span>
          TECH
        </span>

        {/* Busca */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#181818',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
          padding: '6px 12px',
          width: 220,
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
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#f0f0f0',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              width: '100%',
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

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>

        {/* Filtros de categoria */}
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: categoria === cat ? 'rgba(232,255,87,0.5)' : 'rgba(255,255,255,0.08)',
                background: categoria === cat ? 'rgba(232,255,87,0.08)' : 'transparent',
                color: categoria === cat ? '#e8ff57' : '#6b6b6b',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}

          {/* Contador */}
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#4a4a4a',
            alignSelf: 'center',
          }}>
            {filtrados.length} produto{filtrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {filtrados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 0',
            color: '#4a4a4a',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
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

      {/* Footer minimalista */}
      <footer style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: '#2a2a2a',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        RADAR OFERTAS TECH · Mercado Livre · {new Date().getFullYear()}
      </footer>
    </div>
  )
}