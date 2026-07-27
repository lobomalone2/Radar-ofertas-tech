const LINK_GRUPO = "https://chat.whatsapp.com/KRUPdha04CWGBZ454CL7b9";

// Configura o link do botão de CTA
const ctaBtn = document.getElementById('cta-btn');
if (ctaBtn) {
  ctaBtn.href = LINK_GRUPO;
}

document.getElementById('cta-btn').addEventListener('click', function(e) {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }
  });
