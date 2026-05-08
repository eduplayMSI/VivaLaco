// accessibility.js - versão super robusta
(function() {
    // Configurações
    let currentFont = localStorage.getItem('fontSize') || 'medium';
    let highContrast = localStorage.getItem('highContrast') === 'true';

    function applyAccessibility() {
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        document.body.classList.add(`font-${currentFont}`);
        if (highContrast) document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');
        localStorage.setItem('fontSize', currentFont);
        localStorage.setItem('highContrast', highContrast);
    }

    function setFontSize(size) {
        if (['small', 'medium', 'large', 'xlarge'].includes(size)) {
            currentFont = size;
            applyAccessibility();
        }
    }

    function updateIconsForHighContrast() {
    const isHighContrast = document.body.classList.contains('high-contrast');
    const audioIcons = document.querySelectorAll('.audio-icon');
    const concluirIcons = document.querySelectorAll('.concluir-icon');
    const newAudioSrc = isHighContrast ? 'assets/icons/ouvir-highcontrast.webp' : 'assets/icons/ouvir-normal.webp';
    const newConcluirSrc = isHighContrast ? 'assets/icons/concluido-highcontrast.webp' : 'assets/icons/concluido-normal.webp';
    audioIcons.forEach(img => img.src = newAudioSrc);
    concluirIcons.forEach(img => img.src = newConcluirSrc);
    }

    function toggleHighContrast() {
        highContrast = !highContrast;
        applyAccessibility();
        updateIconsForHighContrast();
    }

    // Leitura de tela
    function readWholeScreen() {
        const main = document.querySelector('#main-content');
        if (!main) return;
        const text = main.innerText || '';
        if (window.speechSynthesis && text.trim()) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    // Controle do diálogo
    const dialog = document.getElementById('font-dialog');
    const btnOpen = document.getElementById('btn-tamanho-fonte');
    const btnClose = document.getElementById('close-font-dialog');

    // FECHAR diálogo de todas as formas
    function closeDialog() {
        if (dialog) dialog.hidden = true;
    }

    function openDialog() {
        if (dialog) dialog.hidden = false;
    }

    // Garantir que o diálogo comece fechado (mesmo se o HTML falhar)
    if (dialog) dialog.hidden = true;

    // Abrir
    if (btnOpen) btnOpen.addEventListener('click', openDialog);

    // Fechar com botão
    if (btnClose) btnClose.addEventListener('click', closeDialog);

    // Fechar ao clicar fora
    if (dialog) {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeDialog();
        });
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog && !dialog.hidden) closeDialog();
    });

    // Ações dos botões de tamanho
    document.querySelectorAll('[data-font]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setFontSize(e.target.dataset.font);
            closeDialog();
        });
    });

    // Botão contraste
    const btnContraste = document.getElementById('btn-alto-contraste');
    if (btnContraste) btnContraste.addEventListener('click', toggleHighContrast);

    // Leitura de tela
    const btnLeitura = document.getElementById('btn-leitura-tela');
    if (btnLeitura) btnLeitura.addEventListener('click', readWholeScreen);

    // Aplicar preferências salvas
    applyAccessibility();
})();