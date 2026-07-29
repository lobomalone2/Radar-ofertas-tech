import React, { useState, useEffect } from 'react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', // Exemplo Tênis
      link: '/sneakers',
      alt: 'Drop de Tênis'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop', // Exemplo Streetwear
      link: '/roupas',
      alt: 'Coleção Streetwear'
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [banners.length]);

  return (
    <div style={{
      width: '100%', maxWidth: '1280px', margin: isMobile ? '10px auto' : '20px auto',
      position: 'relative', overflow: 'hidden', aspectRatio: isMobile ? '16 / 9' : '21 / 9', 
      background: '#111', borderRadius: isMobile ? '0' : '0' // Sem bordas arredondadas para parecer mais editorial
    }}>
      {banners.map((banner, index) => (
        <div key={banner.id} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          opacity: currentSlide === index ? 1 : 0, transition: 'opacity 0.8s ease-in-out',
          zIndex: currentSlide === index ? 1 : 0,
        }}>
          <a href={banner.link}>
            <img src={banner.image} alt={banner.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </a>
        </div>
      ))}

      {/* Indicadores */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 10
      }}>
        {banners.map((_, index) => (
          <div key={index} style={{
            width: currentSlide === index ? '30px' : '10px', height: '4px',
            background: currentSlide === index ? '#FF5500' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>
    </div>
  );
}