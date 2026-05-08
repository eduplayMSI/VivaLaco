// Minha família com fotos e áudios
window.renderFamilia = async function() {
    const main = document.getElementById('main-content');
    let familiares = await getAll('familiares');
    let html = `<div class="screen familia-screen"><h2>👪 Minha Família</h2><div class="familia-grid">`;
    
    for (let f of familiares) {
        // Criar URL da foto se existir blob
        let fotoHTML = '';
        if (f.fotoBlob) {
            const fotoURL = URL.createObjectURL(f.fotoBlob);
            fotoHTML = `<img src="${fotoURL}" alt="foto" style="width:70px;height:70px;border-radius:50%;object-fit:cover;">`;
            // Revogar URL depois que a imagem carregar? Podemos armazenar e revogar ao sair da tela, mas para simplificar, deixamos.
        } else {
            fotoHTML = `<span style="font-size:3rem">👤</span>`;
        }
        
        html += `
            <div class="familiar-card">
                <div class="familiar-foto">
                    ${fotoHTML}
                </div>
                <div class="familiar-info">
                    <strong>${f.nome}</strong><br>${f.relacao}
                </div>
                <button class="btn-audio" data-id="${f.id}" data-nome="${f.nome}" data-relacao="${f.relacao}">
                <img class="audio-icon" src="assets/icons/ouvir-normal.webp" alt="Ouvir" width="48" height="48"> </button>
            </div>
        `;
    }
    
    html += `</div></div>`;
    main.innerHTML = html;
    
    // Adicionar eventos para os botões de áudio
    for (let f of familiares) {
        const btn = document.querySelector(`.btn-audio[data-id="${f.id}"]`);
        if (btn) {
            btn.addEventListener('click', () => {
                const textoFala = `${f.nome}, ${f.relacao}`;
                speakThenPlayAudio(textoFala, f.audioBlob);
            });
        }
        window.dispatchEvent(new Event('scripts-loaded'));
    }
}