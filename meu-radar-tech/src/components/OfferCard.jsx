import React, { useState, useEffect } from 'react';

/**
 * Componente OfferCard Corrigido para Vite/PostCSS
 * Usa apenas estilos inline dinâmicos para evitar erros de @import ou ordem de CSS.
 */
export default function OfferCard({ offer, index }) {
  const [isMobile, setIsMobile] = useState(false);
  const economia = offer.precoOriginal - offer.preco;

  // Detecta mobile sem quebrar o build do Vite
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const colors = {
    neonGreen: '#CCFF00',
    cardBg: 'rgba(22, 22, 22, 0.7)',
    border: 'rgba(204, 255, 0, 0.15)',
    borderHover: 'rgba(204, 255, 0, 0.5)',
    textPrimary: '#F0F0F0',
    priceOriginal: '#4A4A4A',
  };

  // Estilos dinâmicos baseados no tamanho da tela
  const cardStyles = {
    background: colors.cardBg,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border}`,
    borderRadius: isMobile ? '12px' : '20px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        animationDelay: `${index * 50}ms`, 
        textDecoration: 'none',
        display: 'block',
        width: '100%'
      }}
      className="fade-up group"
    >
      <div 
        style={cardStyles}
        onMouseEnter={e => {
          if (!isMobile) {
            e.currentTarget.style.borderColor = colors.borderHover;
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = `0 10px 30px rgba(204, 255, 0, 0.1)`;
          }
        }}
        onMouseLeave={e => {
          if (!isMobile) {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
          }
        }}
      >
        {/* Container da Imagem */}
        <div style={{
          background: 'radial-gradient(circle, rgba(40,40,40,1) 0%, rgba(15,15,15,1) 100%)',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '0.8rem' : '1.5rem',
          position: 'relative',
        }}>
          <img
            src={offer.foto}
            alt={offer.titulo}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))'
            }}
            onError={e => { e.target.style.opacity = '0.2' }}
          />
          
          <div style={{
            position: 'absolute',
            top: isMobile ? 8 : 12, 
            left: isMobile ? 8 : 12,
            background: colors.neonGreen,
            color: '#000',
            fontSize: isMobile ? 9 : 11,
            fontWeight: 800,
            padding: isMobile ? '2px 6px' : '3px 8px',
            borderRadius: 6,
            boxShadow: `0 0 10px ${colors.neonGreen}33`,
          }}>
            -{offer.desconto}%
          </div>
        </div>

        {/* Informações */}
        <div style={{ padding: isMobile ? '10px' : '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: isMobile ? 8 : 10,
            fontWeight: 700,
            color: colors.neonGreen,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 4,
            opacity: 0.8
          }}>
            {offer.categoria}
          </div>

          <p style={{
            fontSize: isMobile ? 12 : 14,
            fontWeight: 500,
            color: colors.textPrimary,
            lineHeight: 1.3,
            marginBottom: isMobile ? 8 : 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}>
            {offer.titulo}
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              fontSize: isMobile ? 10 : 11,
              color: colors.priceOriginal,
              textDecoration: 'line-through',
              marginBottom: 2
            }}>
              R$ {offer.precoOriginal.toLocaleString('pt-BR')}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div style={{
                fontSize: isMobile ? 16 : 20,
                fontWeight: 800,
                color: colors.neonGreen,
                lineHeight: 1,
              }}>
                <span style={{ fontSize: isMobile ? 10 : 12, marginRight: 2 }}>R$</span>
                {offer.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
