import { useState, useEffect, useMemo } from 'react'
import OfferCard from './components/OfferCard'
import { OFFERS as FAKE_OFFERS } from './data/offers'

const API = 'http://localhost:3000'

export default function App() {
  const [offers,    setOffers]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [categoria, setCategoria] = useState('Todos')
  const [busca,     setBusca]     = useState('')
  const [modo,      setModo]      = useState('') // 'api' | 'demo'

  useEffect(() => {
    const carregarOfertas = async () => {
      try {
        const response = await fetch(`${API}/api/relampago`)

        // se o servidor respondeu mas com erro (ex: 500), lança exceção
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const json = await response.json()

        // se a API retornou mas sem dados, também cai no fallback
        if (!json.data || json.data.length === 0) throw new Error('Sem dados')

        setOffers(json.data)
        setModo('api')

      } catch (err) {
        // qualquer falha — servidor offline, sem internet, erro 500, etc.
        // cai aqui e usa os dados locais silenciosamente
        console.warn('Backend indisponível, usando dados demo:', err.message)
        setOffers(FAKE_OFFERS)
        setModo('demo')

      } finally {
        // sempre executa — para o loading independente do resultado
        setLoading(false)
      }
    }

    carregarOfertas()
  }, [])

  const categorias = ['Todos', ...new Set(offers.map(o => o.categoria))]

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
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 2rem', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(8px)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 13,
            fontWeight: 500, letterSpacing: '0.06em', color: '#f0f0f0',
          }}>
            MEU RADAR<span style={{ color: '#e8ff57' }}>.</span>TECH
          </span>

          {/* indicador de modo — discreto, só para dev */}
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

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)} style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
              borderColor: categoria === cat
                ? 'rgba(232,255,87,0.5)' : 'rgba(255,255,255,0.08)',
              background: categoria === cat
                ? 'rgba(232,255,87,0.08)' : 'transparent',
              color: categoria === cat ? '#e8ff57' : '#6b6b6b',
            }}>
              {cat}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto', fontFamily: 'var(--font-mono)',
            fontSize: 11, color: '#4a4a4a', alignSelf: 'center',
          }}>
            {filtrados.length} produto{filtrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
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
