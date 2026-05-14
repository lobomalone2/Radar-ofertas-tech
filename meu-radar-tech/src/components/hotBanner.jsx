import React from 'react';

export default function HotBanner({ offers }) {
  // Filtra as ofertas mais quentes (maior desconto) e pega as 6 primeiras
  const hotOffers = offers
    .sort((a, b) => b.desconto - a.desconto)
    .slice(0, 6);

  if (hotOffers.length === 0) {
    return null; // Não renderiza se não houver ofertas quentes
  }

  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1rem',
      background: 'linear-gradient(90deg, rgba(232,255,87,0.05) 0%, rgba(15,15,15,0) 100%)',
      borderRadius: 12,
      border: '1px solid rgba(232,255,87,0.1)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 16,
        fontWeight: 600,
        color: '#e8ff57',
        marginBottom: '1rem',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        🔥 Ofertas Mais Quentes do Dia 🔥
      </h2>
      <div style={{
        display: 'flex',
        overflowX: 'auto', // Habilita o scroll horizontal
        gap: '1rem',
        paddingBottom: '10px', // Espaço para a barra de scroll
        // Estilo para a barra de rolagem (compatibilidade cross-browser)
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#e8ff57 #181818', // Firefox
        WebkitOverflowScrolling: 'touch', // iOS
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#181818',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#e8ff57',
          borderRadius: '10px',
          border: '2px solid #181818',
        },
      }}>
        {hotOffers.map((offer) => (
          <a
            key={offer.id}
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0, // Impede que os itens encolham
              width: '200px', // Largura fixa para cada card
              background: '#1e1e1e',
              borderRadius: 8,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <img
              src={offer.foto}
              alt={offer.titulo}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'contain',
                borderRadius: 4,
                marginBottom: '0.5rem',
              }}
            />
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              textAlign: 'center',
              marginBottom: '0.5rem',
              height: '3em', // Limita a altura para 2 linhas
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {offer.titulo}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#e8ff57',
              }}>
                R$ {offer.preco.toFixed(2).replace('.', ',')}
              </span>
              {offer.precoOriginal > offer.preco && (
                <span style={{
                  fontSize: 12,
                  color: '#6b6b6b',
                  textDecoration: 'line-through',
                }}>
                  R$ {offer.precoOriginal.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            {offer.desconto > 0 && (
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#e8ff57',
                background: 'rgba(232,255,87,0.15)',
                padding: '4px 8px',
                borderRadius: 4,
              }}>
                {offer.desconto}% OFF
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}