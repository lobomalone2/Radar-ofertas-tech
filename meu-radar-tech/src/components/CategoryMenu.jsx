export default function CategoryMenu({
  categorias,
  categoria,
  setCategoria,
  isOpen,
  setIsOpen,
  totalProdutos,
}) {
  return (
    <>
      {/* OVERLAY ESCURO (Clica fora para fechar) */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto z-40"
            : "opacity-0 pointer-events-none z-40"
        }`}
        aria-hidden="true"
      />

      {/* PAINEL LATERAL (DRAWER) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Cabeçalho do Menu Lateral */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-wider text-[var(--color-text)] uppercase">
                Categorias
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-surface2)] text-[var(--color-accent)] border border-[rgba(232,255,87,0.2)]">
                {totalProdutos}
              </span>
            </div>

            {/* Botão Fechar (X) */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-colors"
              aria-label="Fechar menu"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Lista de Categorias */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
            {categorias.map((cat) => {
              const isActive = categoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoria(cat);
                    setIsOpen(false); // Fecha a gaveta ao selecionar
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[rgba(232,255,87,0.1)] text-[var(--color-accent)] border border-[rgba(232,255,87,0.4)] font-medium"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface2)] hover:text-[var(--color-text)] border border-transparent"
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_#e8ff57]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Menu */}
        <div className="pt-4 border-t border-[var(--color-border)] text-center font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">
          MEU RADAR TECH
        </div>
      </aside>
    </>
  );
}