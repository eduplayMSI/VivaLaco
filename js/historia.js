// Tela "Minha História" com carrossel horizontal automático e loop infinito
window.renderHistoria = async function() {
    const main = document.getElementById('main-content');
    const historias = await getAll('historias');
    const configs = await getAll('configuracoes');
    const user = configs.find(c => c.chave === 'usuario')?.valor || { nome: "Usuário", cidade: "", profissao: "" };
    
    let html = `<div class="screen historia-screen">
        <h2>📖 Minha História</h2>
        <div class="card"><p><strong>${escapeHtml(user.nome)}</strong> | ${escapeHtml(user.cidade)} | ${escapeHtml(user.profissao)}</p></div>
        <div class="historias-grid">`;
    
    for (let h of historias) {
        const fotoHtml = h.fotoUrl ? (h.fotoUrl.startsWith('http') ? `<img src="${h.fotoUrl}" alt="foto" style="width:70px;height:70px;object-fit:cover;">` : `<span style="font-size:3rem">${h.fotoUrl}</span>`) : '<span style="font-size:3rem">📖</span>';
        
        html += `
            <div class="historia-card" data-historia-id="${h.id}">
                <div class="historia-foto">${fotoHtml}</div>
                <div class="historia-info">
                    <strong>${escapeHtml(h.titulo)}</strong><br>
                    <small>${escapeHtml(h.descricao)}</small>
                </div>
                <button class="btn-audio-historia" data-id="${h.id}" data-titulo="${escapeHtml(h.titulo)}" data-desc="${escapeHtml(h.descricao)}">
                    <img class="audio-icon" src="assets/icons/ouvir-normal.webp" alt="Ouvir" width="48" height="48">
                </button>
                <!-- Container do carrossel (inicialmente oculto) -->
                <div class="carrossel-wrapper" id="carrossel-wrapper-${h.id}" style="display: none; width: 100%; margin-top: 1rem; overflow: hidden;">
                    <div class="carrossel-track" id="carrossel-track-${h.id}" style="display: flex; transition: none; will-change: transform;"></div>
                </div>
            </div>
        `;
    }
    html += `</div></div>`;
    main.innerHTML = html;
    
    // Para cada história, configurar o carrossel
    for (let h of historias) {
        const btn = document.querySelector(`.btn-audio-historia[data-id="${h.id}"]`);
        const wrapper = document.getElementById(`carrossel-wrapper-${h.id}`);
        const track = document.getElementById(`carrossel-track-${h.id}`);
        if (!btn || !wrapper || !track) continue;
        
        let imagens = h.imagensBlob || [];
        let animationId = null;
        let currentX = 0;
        let speed = 0.5; // pixels por frame (lento)
        let totalWidth = 0;
        
        function stopCarousel() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        function startCarousel() {
            if (!imagens.length) return;
            if (animationId) stopCarousel();
            buildTrack();
            function step() {
                currentX -= speed;
                // Loop infinito: quando ultrapassar metade da largura total, reseta
                if (Math.abs(currentX) >= totalWidth / 2) {
                    currentX = 0;
                }
                track.style.transform = `translateX(${currentX}px)`;
                animationId = requestAnimationFrame(step);
            }
            animationId = requestAnimationFrame(step);
        }
        
        function buildTrack() {
            track.innerHTML = '';
            if (imagens.length === 0) return;
            // Clona as imagens 3 vezes para efeito infinito suave
            const repetitions = 3;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < repetitions; i++) {
                for (let blob of imagens) {
                    const url = URL.createObjectURL(blob);
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'carrossel-img';
                    img.style.width = '180px';
                    img.style.height = '150px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '0 8px';
                    img.style.borderRadius = '16px';
                    img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    fragment.appendChild(img);
                }
            }
            track.appendChild(fragment);
            // Calcula velocidade baseada na largura da primeira imagem
            const firstImg = track.querySelector('img');
            if (firstImg) {
                const imgWidth = firstImg.offsetWidth + 16; // largura + margem
                const imagesPerSet = imagens.length;
                totalWidth = imgWidth * imagesPerSet * repetitions;
                speed = imgWidth / 120; // velocidade lenta (atravessa uma imagem em ~2 segundos a 60fps)
                currentX = 0;
            }
        }
        
        // Evento do botão "Ouvir"
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textoFala = `${h.titulo}. ${h.descricao}`;
            speakThenPlayAudio(textoFala, h.audioBlob);
            
            if (!imagens.length) {
                wrapper.style.display = 'none';
                return;
            }
            
            if (wrapper.style.display === 'block') {
                // Ocultar e parar animação
                stopCarousel();
                wrapper.style.display = 'none';
                // Liberar URLs das imagens
                const imgs = track.querySelectorAll('img');
                imgs.forEach(img => {
                    if (img.src && img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
                });
                track.innerHTML = '';
            } else {
                wrapper.style.display = 'block';
                startCarousel();
            }
        });
    }
    window.dispatchEvent(new Event('scripts-loaded'));
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}