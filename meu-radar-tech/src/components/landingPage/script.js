const LINK_GRUPO = "https://chat.whatsapp.com/KRUPdha04CWGBZ454CL7b9"; // ← troque aqui
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbws-nEgQE_n0ZEeF4xlax-U4uOYynrIez75rqvGrt_tNePEAu5vdMSmALHSuFpN9Lb2/exec"; // ← SUBSTITUA COM SUA URL DO GOOGLE APPS SCRIPT

const overlay    = document.getElementById('overlay');
const form       = document.getElementById('capture-form');
const nomeInput  = document.getElementById('nome');
const sobreInput = document.getElementById('sobrenome');
const emailInput = document.getElementById('email');
const nomeErr    = document.getElementById('nome-error');
const sobreErr   = document.getElementById('sobrenome-error');
const emailErr   = document.getElementById('email-error');
const submitBtn  = document.getElementById('submit-btn');
const mainContent = document.getElementById('main-content');
const notif      = document.getElementById('notif');

// Configura o link do botão de CTA
if (document.getElementById('cta-btn')) {
  document.getElementById('cta-btn').href = LINK_GRUPO;
}

function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validar() {
  let ok = true;

  if (nomeInput.value.trim().length < 2) {
    nomeInput.classList.add('error'); nomeErr.textContent = 'Digite seu nome'; ok = false;
  } else { nomeInput.classList.remove('error'); nomeErr.textContent = ''; }

  if (sobreInput.value.trim().length < 2) {
    sobreInput.classList.add('error'); sobreErr.textContent = 'Digite seu sobrenome'; ok = false;
  } else { sobreInput.classList.remove('error'); sobreErr.textContent = ''; }

  if (!validarEmail(emailInput.value.trim())) {
    emailInput.classList.add('error'); emailErr.textContent = 'Digite um e-mail válido'; ok = false;
  } else { emailInput.classList.remove('error'); emailErr.textContent = ''; }

  return ok;
}

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validar()) return;

    // Remove o foco de qualquer input ativo para fechar o teclado do celular imediatamente
    document.activeElement.blur();

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Preparar dados para enviar
    const formData = {
      nome: nomeInput.value.trim(),
      sobrenome: sobreInput.value.trim(),
      email: emailInput.value.trim()
    };

    // Enviar para Google Apps Script
    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    })
    .then(() => {
      console.log('Dados enviados (modo no-cors)');
      
      localStorage.setItem('radar_lead', JSON.stringify({
        ...formData,
        ts: new Date().toISOString()
      }));

      finalizarFluxo();
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
      finalizarFluxo();
    });
  });
}

function finalizarFluxo() {
  setTimeout(() => {
    overlay.classList.add('hiding');
    setTimeout(() => {
      overlay.style.display = 'none';
      
      // Remove classes ou estilos restritivos no body/html que possam travar o mobile
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.documentElement.style.overflow = 'auto';
      
      // Ativa o conteúdo principal
      mainContent.classList.add('unlocked');
      
      // Força o navegador do celular a recalcular o scroll
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 4000);
      }, 1500);
    }, 400);
  }, 800);
}

// Remover erro ao digitar
[nomeInput, sobreInput, emailInput].forEach((inp, i) => {
  const errs = [nomeErr, sobreErr, emailErr];
  if (inp) {
    inp.addEventListener('input', () => { 
      inp.classList.remove('error'); 
      if (errs[i]) errs[i].textContent = ''; 
    });
  }
});

/* REMOVIDO O FOCO AUTOMÁTICO PARA EVITAR QUE O TECLADO DO CELULAR
  ABRA SOZINHO E TRAVE A POSIÇÃO DA TELA DO DISPOSITIVO
*/