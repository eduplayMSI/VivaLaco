// Modo emergência emocional: segurança, música calmante, contato
let calmAudio = null;
window.renderConfuso = async function() {
    const main = document.getElementById('main-content');
    const html = `
        <div class="screen confuso-screen">
            <div class="confuso-container">
                <div style="font-size:4rem">🕊️</div>
                <h2>Você está seguro(a) em casa</h2>
                <p class="mensagem-calma">Respire fundo. Tudo está bem.</p>
                <button id="play-calming" class="btn-large">🎵 Música calmante</button>
                <button id="stop-calming" class="btn-large btn-secondary">⏹️ Parar música</button>
                <button id="contact-caregiver" class="btn-large btn-secondary">📞 Falar com familiar</button>
                <button id="back-home" class="btn-large">⬅️ Voltar ao início</button>
            </div>
        </div>
    `;
    main.innerHTML = html;
    if (calmAudio) {
        calmAudio.pause();
        calmAudio = null;
    }
    const playBtn = document.getElementById('play-calming');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!calmAudio) {
                calmAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                calmAudio.loop = true;
                calmAudio.volume = 0.3;
            }
            calmAudio.play().catch(e => console.log("áudio não pôde ser reproduzido"));
            speakText("Você está em casa. Fique calmo, sua família está perto.");
        });
    }
    const stopBtn = document.getElementById('stop-calming');
    if (stopBtn) stopBtn.addEventListener('click', () => { if(calmAudio) calmAudio.pause(); });
    const contactBtn = document.getElementById('contact-caregiver');
    if (contactBtn) contactBtn.addEventListener('click', () => speakText("Contate seu cuidador ou ligue para alguém da sua família. O número está na geladeira."));
    const backBtn = document.getElementById('back-home');
    if (backBtn) backBtn.addEventListener('click', () => window.loadScreen('agora'));

    window.dispatchEvent(new Event('scripts-loaded'));
}