// Rotina guiada com passos
let currentRotinaId = null; // guarda o id da rotina do dia

window.renderRotina = async function() {
    const main = document.getElementById('main-content');
    const hoje = new Date().toDateString();
    let todasRotinas = await getAll('rotinas');
    let rotinaHoje = todasRotinas.find(r => r.dia === hoje);
    
    if (!rotinaHoje) {
        const novaRotina = { dia: hoje, atividades: [] };
        const novoId = await saveItem('rotinas', novaRotina);
        rotinaHoje = { id: novoId, ...novaRotina };
    }
    currentRotinaId = rotinaHoje.id;
    const atividades = rotinaHoje.atividades || [];
    
    let html = `<div class="screen rotina-screen"><h2>📋 Minha Rotina de Hoje</h2>`;
    if (atividades.length === 0) html += `<p>Nenhuma atividade programada. ❤️</p>`;
    for (let atv of atividades) {
        const concluidoClass = atv.concluido ? 'passo-concluido' : '';
        html += `
            <div class="passo-item ${concluidoClass}">
                <span style="font-size:2rem">${atv.imagem || '✅'}</span>
                <div style="flex:1"><strong>${atv.texto}</strong></div>
                ${!atv.concluido ? `<button class="btn-concluir" data-id="${atv.id}"><img class="concluir-icon" src="assets/icons/concluido-normal.webp" alt="Concluir" width="48" height="48"></button>` : `<span>✔️ feito</span>`}
                <button class="btn-audio-passo" data-id="${atv.id}" data-texto="${atv.texto}">
                <img class="audio-icon" src="assets/icons/ouvir-normal.webp" alt="Ouvir" width="48" height="48"> </button>
            </div>
        `;
    }
    html += `<button id="btn-nova-rotina" class="btn-large btn-secondary" style="margin-top:1rem">➕ Adicionar atividade (cuidador)</button></div>`;
    main.innerHTML = html;
    
    // Concluir atividade
    document.querySelectorAll('.btn-concluir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(btn.dataset.id);
            const rotinaObj = await getById('rotinas', currentRotinaId);
            const atv = rotinaObj.atividades.find(a => a.id === id);
            if (atv) atv.concluido = true;
            await saveItem('rotinas', rotinaObj);
            renderRotina();
            speakText(`Atividade ${atv.texto} concluída. Parabéns!`);
        });
    });
    
    // Áudio da atividade (personalizado ou TTS)
    for (let atv of atividades) {
        const btn = document.querySelector(`.btn-audio-passo[data-id="${atv.id}"]`);
        if (btn) {
            btn.addEventListener('click', () => {
                const textoAtividade = atv.texto;
                speakThenPlayAudio(textoAtividade, atv.audioBlob);
            });
        }
    }

    const novaRotinaBtn = document.getElementById('btn-nova-rotina');
    if (novaRotinaBtn) novaRotinaBtn.addEventListener('click', () => window.loadScreen('cuidador'));
    window.dispatchEvent(new Event('scripts-loaded'));
}