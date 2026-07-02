import React, { useState, useEffect } from 'react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

 const banners = [
    {
      id: 1,
      image: 'https://private-us-east-1.manuscdn.com/sessionFile/SAcwbItTS1PkjMEgHlIz74/sandbox/HDLH6DwzEXFG9k3c484DOg_1781969006811_na1fn_L2hvbWUvdWJ1bnR1L2Jhbm5lcl9jYXJvdXNlbF9tb2RlbA.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvU0Fjd2JJdFRTMVBrak1FZ0hsSXo3NC9zYW5kYm94L0hETEg2RHd6RVhGRzlrM2M0ODRET2dfMTc4MTk2OTAwNjgxMV9uYTFmbl9MMmh2YldVdmRXSjFiblIxTDJKaGJtNWxjbDlqWVhKdmRYTmxiRjl0YjJSbGJBLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mNZ-CiVcsApq-Z2JYcEd32~gjIOQwHYPggmSgktaDCUbS7HM4GMRcP3zQ9OIgj3FYh-tszTs9m0b2sCGD3tiJb4kTlSzzXsoEoVK2Atuc~oY3gsJQDgEp8PsfDXliKwhmV-IFLHj3ZO8MdWBhXJD8Byg8OM2~dtmHnIWN3VmvG1B9i6uWQbXaCQrOcarYd2ghuH4wzxUwPi84kGR8cz6iECLsTFy1RIQmnSb4FOXIQsE2e8wl6Sph8E59QzA-Z7NY0N3mwO8Izk1Wy06Cl4S9Acq64sIN2EADW0k~PaS2Tb2LRdCD5lyxCp45rfoemlCUqkbBafRLSW-rlyYe~t5dQ__', // hero_banner_radar_tech.png
      link: '/hardware',
      alt: 'Hardware de Elite'
    },
    {
      id: 2,
      image: 'https://private-us-east-1.manuscdn.com/sessionFile/SAcwbItTS1PkjMEgHlIz74/sandbox/gTPmWLt0UsjOVV5qDvtAPM_1781967645291_na1fn_L2hvbWUvdWJ1bnR1L3Byb21vX2Jhbm5lcl9ncHU.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvU0Fjd2JJdFRTMVBrak1FZ0hsSXo3NC9zYW5kYm94L2dUUG1XTHQwVXNqT1ZWNXFEdnRBUE1fMTc4MTk2NzY0NTI5MV9uYTFmbl9MMmh2YldVdmRXSjFiblIxTDNCeWIyMXZYMkpoYm01bGNsOW5jSFUucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XGYSMMkADvFJ1ZqfVWYjo~7JqO4t3feCAs17sCzExMQ6UOlXWvghO08f-4MH9Z9BmBfbkvOhNPjflH0ATmP4BrRSZZqfKPWeH~mL7D-Md4-mIZAY-m0ihug22pDTzzA5MSsdZlGbM2TXCFf4y1hG0oe6b4-wK1VHoImG-JivDMHhDgbgF7zCExUxlNxd4MMbOO7IjKXash0cNu2woeWr67ohIF7nKhJUEu8UrtIKjp09zx-B~mDRBWD8E5UBi~PZrAWUOcJMxoPX7PoDIMpVbi7h3TR7XrtJYnIPl6lpfMipkH48SD29kofrJwzQGmOXofx4G6iV~ofBdp-HhvrIkQ__', // banner_carousel_model.png
      link: '/setups',
      alt: 'Monte seu Setup'
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
      width: '100%',
      maxWidth: '1280px',
      margin: isMobile ? '10px auto' : '20px auto',
      position: 'relative',
      borderRadius: isMobile ? '12px' : '24px',
      overflow: 'hidden',
      aspectRatio: isMobile ? '16 / 9' : '21 / 9', // Formato mais alto no mobile para melhor visibilidade
      background: '#000'
    }}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: currentSlide === index ? 1 : 0,
          }}
        >
          <a href={banner.link}>
            <img
              src={banner.image}
              alt="Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </a>
        </div>
      ))}

      {/* Indicadores (Pontinhos) */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '10px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 10
      }}>
        {banners.map((_, index) => (
          <div
            key={index}
            style={{
              width: currentSlide === index ? (isMobile ? '15px' : '30px') : (isMobile ? '6px' : '10px'),
              height: isMobile ? '4px' : '10px',
              borderRadius: '5px',
              background: currentSlide === index ? '#CCFF00' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Setas Reduzidas para Mobile */}
      <button 
        onClick={() => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
        style={arrowButtonStyle('left', isMobile)}
      >
        ‹
      </button>
      <button 
        onClick={() => setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1)}
        style={arrowButtonStyle('right', isMobile)}
      >
        ›
      </button>
    </div>
  );
}

const arrowButtonStyle = (side, isMobile) => ({
  position: 'absolute',
  top: '50%',
  [side]: isMobile ? '8px' : '20px', // Mais perto da borda no mobile
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(4px)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '50%',
  width: isMobile ? '28px' : '44px', // Bem menores no mobile
  height: isMobile ? '28px' : '44px',
  fontSize: isMobile ? '18px' : '28px',
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s',
  opacity: isMobile ? 0.7 : 1 // Mais discretas no mobile
});
