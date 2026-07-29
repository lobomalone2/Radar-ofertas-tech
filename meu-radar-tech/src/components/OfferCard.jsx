import React, { useState, useEffect } from 'react';

export default function OfferCard({ offer, index }) {
  const economia = offer.precoOriginal - offer.preco;

  const colors = {
    accent: '#FF5500', // Laranja
    cardBg: '#0a0a0a',
    surface: '#111111',
    border: '#1a1a1a',
    borderHover: '#333333',
    textPrimary: '#FFFFFF',
    textSecondary: '#999999',
    priceOriginal: '#555555',
  };

  const cardStyles = {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block', width: '100%' }}
    >
      <div 
        style={cardStyles}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = colors.borderHover;
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Container da Imagem - Estilo Lookbook */}
        <div style={{
          background: colors.surface,
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <img
            src={offer.foto}
            alt={offer.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => { e.target.style.opacity = '0.1' }}
          />
          
          {/* Tag de Desconto Estilo Reserva/Adidas */}
          <div style={{
            position: 'absolute',
            top: 12, left: 12,
            background: colors.accent,
            color: '#000000',
            fontSize: 11,
            fontWeight: 900,
            padding: '4px 8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            -{offer.desconto}%
          </div>
        </div>

        {/* Informações */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: colors.textSecondary,
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8
          }}>
            {offer.categoria}
          </div>

          <p style={{
            fontSize: 14, fontWeight: 500, color: colors.textPrimary,
            lineHeight: 1.4, marginBottom: 16,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.5em', fontFamily: "'Inter', sans-serif"
          }}>
            {offer.titulo}
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              fontSize: 12, color: colors.priceOriginal,
              textDecoration: 'line-through', marginBottom: 4, fontFamily: "'Inter', sans-serif"
            }}>
              R$ {offer.precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <div style={{
                fontSize: 24, fontWeight: 900, color: colors.textPrimary, lineHeight: 1, fontFamily: "'Inter', sans-serif"
              }}>
                <span style={{ fontSize: 14, marginRight: 2 }}>R$</span>
                {offer.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}