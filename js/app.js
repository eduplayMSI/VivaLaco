// Roteamento simples, navegação, inicialização do PWA
let currentScreen = 'agora';

window.loadScreen = async (screenName) => {
    console.log('[loadScreen] mudando para:', screenName);
    
    const quickMenu = document.getElementById('quick-menu');
    if (quickMenu) quickMenu.hidden = true;
    
    if (window.currentAgoraImageURL) {
        URL.revokeObjectURL(window.currentAgoraImageURL);
        window.currentAgoraImageURL = null;
    }
    
    currentScreen = screenName;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-btn[data-nav="${screenName}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    const headerTitle = document.getElementById('app-title');
    const backBtn = document.getElementById('btn-voltar');
    
    try {
        if (screenName === 'agora') {
            if (headerTitle) headerTitle.innerText = 'VivaLaço';
            if (backBtn) backBtn.style.display = 'none';
            await window.renderAgora();
        } else {
            if (backBtn) backBtn.style.display = 'flex';
            if (headerTitle) headerTitle.innerText = getTitleForScreen(screenName);
            if (screenName === 'rotina') await window.renderRotina();
            else if (screenName === 'familia') await window.renderFamilia();
            else if (screenName === 'historia') await window.renderHistoria();
            else if (screenName === 'confuso') await window.renderConfuso();
            else if (screenName === 'cuidador') await window.renderCuidador();
        }
    } catch (err) {
        console.error(`[loadScreen] erro em ${screenName}:`, err);
    }
    
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (window.calmAudioGlobal) {
        window.calmAudioGlobal.pause();
        window.calmAudioGlobal = null;
    }
};

function getTitleForScreen(screen) {
    const map = { rotina: 'Minha Rotina', familia: 'Minha Família', historia: 'Minha História', confuso: 'Acalme-se', cuidador: 'Configurações' };
    return map[screen] || 'VivaLaço';
}

// ========== INÍCIO DA INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[app] DOMContentLoaded');
    await initDatabase();
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.log("SW error:", err));
    }
    
    // Navegação por delegação de eventos
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (btn) {
                const screen = btn.dataset.nav;
                console.log('[NAV] botão clicado:', screen);
                if (screen) window.loadScreen(screen);
            }
        });
    } else {
        console.error('[NAV] .bottom-nav não encontrado');
    }
    
    // Menu rápido
    const menuBtn = document.getElementById('btn-menu');
        // Menu rápido (quick-menu) - navegação
    const quickMenuContainer = document.getElementById('quick-menu');
    if (quickMenuContainer) {
        quickMenuContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const screen = btn.dataset.nav;
            if (screen) {
                console.log('[QUICK-MENU] botão clicado:', screen);
                window.loadScreen(screen);
                // Fecha o menu após clicar (opcional, mas boa UX)
                quickMenuContainer.hidden = true;
            }
        });
    } else {
        console.warn('[QUICK-MENU] elemento #quick-menu não encontrado');
    }
    // Dentro do DOMContentLoaded, após criar o menuBtn
function closeMenu() { 
    if (quickMenuContainer) quickMenuContainer.hidden = true; 
}
function toggleMenu() { 
    if (quickMenuContainer) quickMenuContainer.hidden = !quickMenuContainer.hidden; 
}
if (menuBtn && quickMenuContainer) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que o clique no botão feche o menu imediatamente
        toggleMenu();
    });
}
// Fechar menu ao clicar em qualquer lugar fora do menu e fora do botão
document.addEventListener('click', (event) => {
    if (quickMenuContainer && !quickMenuContainer.hidden) {
        // Se o clique não foi dentro do menu e nem no botão que abre
        if (!quickMenuContainer.contains(event.target) && event.target !== menuBtn) {
            closeMenu();
        }
    }
});
// Previne que cliques dentro do menu fechem o menu (propagação)
if (quickMenuContainer) {
    quickMenuContainer.addEventListener('click', (e) => e.stopPropagation());
}
    
    // Botão voltar
    const backBtn = document.getElementById('btn-voltar');
    if (backBtn) backBtn.addEventListener('click', () => window.loadScreen('agora'));
    
    // Carrega tela inicial
    await window.loadScreen('agora');
    
    // Cria o botão flutuante de microfone (uma única vez)
    criarBotaoMicrofone();
    
    // Música de fundo
    const bgMusic = document.getElementById('bg-music');
    const bgMusicEnabled = localStorage.getItem('bgMusicEnabled') !== 'false';
    if (bgMusic && bgMusicEnabled) {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(e => console.log("Autoplay bloqueado:", e));
    }
    
    // Fechar diálogo de fonte caso aberto
    const fontDialog = document.getElementById('font-dialog');
    if (fontDialog) fontDialog.hidden = true;
});

// ========== CRIAÇÃO DO BOTÃO DE MICROFONE (DEFINITIVA) ==========
function criarBotaoMicrofone() {
    if (document.querySelector('.fab-mic-permanente')) return;
    
    const btn = document.createElement('button');
    btn.className = 'fab-mic-permanente fab-mic';
    btn.setAttribute('aria-label', 'Comando de voz');
    
    // Estilos inline (já existentes)
    btn.style.position = 'fixed';
    btn.style.bottom = '80px';
    btn.style.right = '16px';
    btn.style.width = '56px';
    btn.style.height = '56px';
    btn.style.borderRadius = '50%';
    btn.style.backgroundColor = 'transparent';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '10000';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.fontSize = '32px';
    btn.style.outline = 'none';
    
    // Criar elemento de imagem para melhor controle
    const img = document.createElement('img');
    img.id = 'mic-icon-img';
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.objectFit = 'contain';
    // Usa caminho relativo à raiz (certifique-se de que o arquivo existe em /assets/icons/microfone.png)
    img.src = '/assets/icons/microfone.png';
    img.alt = 'Microfone';
    img.onerror = () => {
        // Fallback para emoji caso a imagem não exista
        btn.textContent = '🎤';
        btn.style.fontSize = '32px';
        img.style.display = 'none';
    };
    btn.appendChild(img);
    
    // Evento de clique (igual ao original)
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof startVoiceCommand === 'function') {
            startVoiceCommand(processVoiceCommand);
        } else {
            if (typeof speakText === 'function') speakText('Função de voz não disponível');
        }
    });
    
    document.body.appendChild(btn);
    
    // Reagir a mudanças no alto contraste para trocar a imagem
    const observer = new MutationObserver(() => {
        const isHighContrast = document.body.classList.contains('high-contrast');
        const micImg = document.getElementById('mic-icon-img');
        if (micImg) {
            micImg.src = isHighContrast ? '/assets/icons/microfone-highcontrast.png' : '/assets/icons/microfone.png';
        }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    console.log('[MIC] Botão com imagem adicionado');
}

// ========== INSTALAÇÃO PWA ==========
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt disparado');
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('btn-install');
    if (installBtn) {
        installBtn.style.display = 'flex';
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') console.log('[PWA] Instalação aceita');
                deferredPrompt = null;
            });
        });
    }
});