import React from 'react';

/**
 * Componente OfferCard atualizado com o novo padrão visual da Radar.Tech
 * Estilo: Dark Tech, Glassmorphism, Neon Lime Green
 */
export default function OfferCard({ offer, index }) {
  const economia = offer.precoOriginal - offer.preco;

  // Definição das cores da nova identidade
  const colors = {
    neonGreen: '#CCFF00',
    cardBg: 'rgba(22, 22, 22, 0.7)',
    border: 'rgba(204, 255, 0, 0.15)',
    borderHover: 'rgba(204, 255, 0, 0.5)',
    textPrimary: '#F0F0F0',
    textSecondary: '#A0A0A0',
    priceOriginal: '#4A4A4A',
  };

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer"
      className="fade-up group block"
      style={{ 
        animationDelay: `${index * 50}ms`, 
        textDecoration: 'none',
        display: 'block'
      }}
    >
      <div style={{
        background: colors.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${colors.border}`,
        borderRadius: 20, // Cantos mais arredondados como no mockup
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = colors.borderHover;
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(204, 255, 0, 0.15)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      }}
      >
        {/* Container da Imagem */}
        <div style={{
          background: 'radial-gradient(circle, rgba(40,40,40,1) 0%, rgba(15,15,15,1) 100%)',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
        }}>
          <img
            src={offer.foto}
            alt={offer.titulo}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
            }}
            onError={e => { e.target.style.opacity = '0.2' }}
          />
          
          {/* Badge de Desconto Estilizado */}
          <div style={{
            position: 'absolute',
            top: 15, 
            left: 15,
            background: colors.neonGreen,
            color: '#000',
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 100, // Estilo pílula
            boxShadow: `0 0 15px ${colors.neonGreen}44`,
            letterSpacing: '-0.02em',
          }}>
            -{offer.desconto}%
          </div>

          {/* Ícone de Favorito (Estético como no mockup) */}
          <div style={{
            position: 'absolute',
            top: 15,
            right: 15,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 18
          }}>
            ♡
          </div>
        </div>

        {/* Informações do Produto */}
        <div style={{ padding: '20px' }}>
          {/* Marca / Categoria */}
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: colors.neonGreen,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 8,
            opacity: 0.9
          }}>
            {offer.categoria}
          </div>

          {/* Título do Produto */}
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: colors.textPrimary,
            lineHeight: 1.3,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}>
            {offer.titulo}
          </p>

          {/* Seção de Preço */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{
              fontSize: 12,
              color: colors.priceOriginal,
              textDecoration: 'line-through',
              fontFamily: 'monospace'
            }}>
              R$ {offer.precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              justifyContent: 'space-between' 
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 800,
                color: colors.neonGreen,
                lineHeight: 1,
              }}>
                <span style={{ fontSize: 14, marginRight: 2 }}>R$</span>
                {offer.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              
              {/* Botão de Compra Discreto (Aparece no hover no mockup real) */}
              <div className="buy-button" style={{
                background: colors.neonGreen,
                color: '#000',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                opacity: 0,
                transition: 'opacity 0.3s'
              }}>
                🛒 COMPRAR
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilo CSS Adicional para o efeito do botão */}
      <style>{`
        .group:hover .buy-button {
          opacity: 1 !important;
        }
      `}</style>
    </a>
  );
}
