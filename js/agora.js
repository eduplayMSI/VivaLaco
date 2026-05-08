// Tela "Agora" - mostra atividade atual com base na rotina do dia
window.renderAgora = async function() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const rotinas = await getAll('rotinas');
    const hoje = new Date().toDateString();
    let rotinaHoje = rotinas.find(r => r.dia === hoje);
    
    if (!rotinaHoje) {
        const novaId = await saveItem('rotinas', { dia: hoje, atividades: [] });
        rotinaHoje = { id: novaId, dia: hoje, atividades: [] };
    }
    
    const atividadesNaoConcluidas = rotinaHoje.atividades.filter(a => !a.concluido);
    let atividadeAtual = atividadesNaoConcluidas[0];
    if (!atividadeAtual && rotinaHoje.atividades.length > 0) atividadeAtual = rotinaHoje.atividades[rotinaHoje.atividades.length-1];
    if (!atividadeAtual) atividadeAtual = { texto: "Hora de descansar", imagem: "🛋️", audioBlob: null };
    
    // 👇 Verifica se existe imagem personalizada (blob)
    let imagemHTML = '';
    let imagemURL = null;
    if (atividadeAtual.imagemBlob) {
        imagemURL = URL.createObjectURL(atividadeAtual.imagemBlob);
        // Armazena a URL para revogar depois (evita vazamento)
        if (window.currentAgoraImageURL) URL.revokeObjectURL(window.currentAgoraImageURL);
        window.currentAgoraImageURL = imagemURL;
        imagemHTML = `<img src="${imagemURL}" alt="Imagem da atividade" style="max-width: 300px; max-height: 200px; border-radius: 24px; margin: 0 auto; display: block;">`;
    } else {
        // Mantém o emoji padrão
        imagemHTML = `<div style="font-size: 5rem;">${atividadeAtual.imagem || "⏰"}</div>`;
    }
    
    const html = `
        <div class="screen agora-screen">
            <div class="card" style="text-align:center">
                ${imagemHTML}
                <h2 style="font-size:2rem; margin:1rem 0">${atividadeAtual.texto}</h2>
                <button id="ouvir-instrucao" class="btn-large" aria-label="Ouvir instrução" data-texto="${atividadeAtual.texto}" data-blob="${!!atividadeAtual.audioBlob}">🔊 Ouvir instrução</button>
                <div style="margin-top: 1rem">
                    <button id="btn-ir-rotina" class="btn-large btn-secondary">📋 Minha rotina completa</button>
                </div>
            </div>
            <div class="card">
                <p><strong>Dica:</strong> Você pode dizer "O que faço agora?" ou tocar no microfone.</p>
                <button id="btn-mic-comando" class="btn-large btn-secondary" style="background:#4a90e2">🎤 Comando de voz</button>
            </div>
        </div>
    `;

    // Saudação apenas uma vez por sessão
    if (!sessionStorage.getItem('saudacaoExibida')) {
    await playWelcomeGreeting();   // aguarda a saudação terminar (opcional)
    sessionStorage.setItem('saudacaoExibida', 'true');
    }
    main.innerHTML = html;
    
    const ouvirBtn = document.getElementById('ouvir-instrucao');
    if (ouvirBtn) {
        ouvirBtn.addEventListener('click', () => {
            const textoFala = `Sua atividade atual: ${atividadeAtual.texto}`;
            speakThenPlayAudio(textoFala, atividadeAtual.audioBlob);
        });
    }
    
    const irRotina = document.getElementById('btn-ir-rotina');
    if (irRotina) irRotina.addEventListener('click', () => window.loadScreen('rotina'));
    
    const micBtn = document.getElementById('btn-mic-comando');
    if (micBtn) micBtn.addEventListener('click', () => startVoiceCommand(processVoiceCommand));

    window.dispatchEvent(new Event('scripts-loaded'));

    // dentro de renderAgora, após o HTML
    if (!speechAllowed) {
    const toast = document.createElement('div');
    toast.innerText = '👆 Toque em qualquer lugar para ouvir as instruções em voz alta.';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#4A90E2';
    toast.style.color = 'white';
    toast.style.padding = '12px';
    toast.style.borderRadius = '28px';
    toast.style.textAlign = 'center';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
    }
}