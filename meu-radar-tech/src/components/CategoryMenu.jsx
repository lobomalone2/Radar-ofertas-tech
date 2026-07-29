export default function CategoryMenu({
  categorias, categoria, setCategoria, isOpen, setIsOpen, totalProdutos
}) {
  const theme = {
    bg: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    muted: '#888888',
    accent: '#FF5500',
    border: '#222222'
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s', zIndex: 40
        }}
      />

      <aside
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: 320, maxWidth: '85vw',
          backgroundColor: theme.bg, borderRight: `1px solid ${theme.border}`, padding: 24,
          zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Categorias
            </span>
            <button onClick={() => setIsOpen(false)} style={{ color: theme.muted, background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            {categorias.map((cat) => {
              const isActive = categoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategoria(cat); setIsOpen(false); }}
                  style={{
                    textAlign: 'left', padding: '12px 16px', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: isActive ? theme.accent : theme.text,
                    backgroundColor: isActive ? theme.surface : 'transparent',
                    border: 'none', borderLeft: isActive ? `4px solid ${theme.accent}` : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ paddingTop: 20, borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", color: theme.muted, fontSize: 12, letterSpacing: '2px' }}>
            GARIMPOS ORIGINAIS
          </span>
        </div>
      </aside>
    </>
  );
}