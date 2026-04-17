export default function OfferCard({ offer, index }) {
  const economia = offer.precoOriginal - offer.preco

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer"
      className="fade-up group block"
      style={{ animationDelay: `${index * 50}ms`, textDecoration: 'none' }}
    >
      <div style={{
        background: '#181818',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      >
        {/* Imagem */}
        <div style={{
          background: '#111',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          position: 'relative',
        }}>
          <img
            src={offer.foto}
            alt={offer.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => { e.target.style.opacity = '0.2' }}
          />
          {/* Badge desconto */}
          <div style={{
            position: 'absolute',
            top: 12, right: 12,
            background: '#e8ff57',
            color: '#0f0f0f',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: 4,
            letterSpacing: '0.02em',
          }}>
            -{offer.desconto}%
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 16px' }}>
          {/* Categoria */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: '#6b6b6b',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 6,
          }}>
            {offer.categoria}
          </div>

          {/* Título */}
          <p style={{
            fontSize: 13,
            fontWeight: 400,
            color: '#d0d0d0',
            lineHeight: 1.4,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
          }}>
            {offer.titulo}
          </p>

          {/* Preços */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 500,
                color: '#f0f0f0',
                lineHeight: 1,
                marginBottom: 3,
              }}>
                R$ {offer.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#4a4a4a',
                textDecoration: 'line-through',
              }}>
                R$ {offer.precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#e8ff57',
              opacity: 0.8,
            }}>
              −R$ {economia.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}