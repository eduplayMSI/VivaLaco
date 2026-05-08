// Painel do cuidador
let currentRotinaIdCuidador = null;
let editingFamiliarId = null;
let editingAtividadeId = null;

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.renderCuidador = async function() {
    const main = document.getElementById('main-content');
    const hoje = new Date().toDateString();
    let rotinas = await getAll('rotinas');
    let rotinaHoje = rotinas.find(r => r.dia === hoje);
    
    if (!rotinaHoje) {
        const novoId = await saveItem('rotinas', { dia: hoje, atividades: [] });
        rotinaHoje = { id: novoId, dia: hoje, atividades: [] };
    }
    currentRotinaIdCuidador = rotinaHoje.id;
    
    const familiares = await getAll('familiares');
    
    // ---------- Dados do Usuário (paciente) ----------
    let perfilUsuario = await getById('configuracoes', 'usuario');
    if (!perfilUsuario) perfilUsuario = { chave: 'usuario', valor: { nome: '', cidade: '', profissao: '', fotoBlob: null } };
    const userFotoUrl = perfilUsuario.valor.fotoBlob ? URL.createObjectURL(perfilUsuario.valor.fotoBlob) : null;
    
    let html = `
        <div class="screen cuidador-screen">
            <h2>🔧 Painel do Cuidador</h2>
            
            <!-- Seção Dados do Paciente -->
            <div class="card">
                <h3>🧑‍🦳 Sobre quem cuidamos</h3>
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    ${userFotoUrl ? `<img src="${userFotoUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%;">` : ''}
                    <div style="flex:1">
                        <label>Nome: <input type="text" id="user-nome" value="${escapeHtml(perfilUsuario.valor.nome || '')}"></label><br>
                        <label>Cidade: <input type="text" id="user-cidade" value="${escapeHtml(perfilUsuario.valor.cidade || '')}"></label><br>
                        <label>Profissão: <input type="text" id="user-profissao" value="${escapeHtml(perfilUsuario.valor.profissao || '')}"></label><br>
                        <button id="user-foto-btn" class="btn-sec">📷 Selecionar Foto</button>
                        <button id="user-salvar" class="btn-prim">💾 Salvar Dados</button>
                    </div>
                </div>
            </div>
            
            <!-- Seção Familiares -->
            <div class="card">
                <h3>👪 Gerenciar Familiares</h3>
                <div id="lista-familiares">
    `;
    
    for (let fam of familiares) {
        const fotoUrl = fam.fotoBlob ? URL.createObjectURL(fam.fotoBlob) : null;
        html += `
            <div style="border-bottom:1px solid #ccc; margin-bottom:1rem; padding-bottom:0.5rem; display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
                ${fotoUrl ? `<img src="${fotoUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;">` : ''}
                <div style="flex:1">
                    <strong>${escapeHtml(fam.nome)}</strong> (${escapeHtml(fam.relacao)})<br>
                </div>
                <div>
                    <button class="btn-sec btn-selecionar-foto" data-id="${fam.id}">📷 Foto</button>
                    <button class="btn-sec btn-gravar-audio-familiar" data-id="${fam.id}">🎙️ Áudio</button>
                    ${fam.audioBlob ? `<button class="btn-sec btn-ouvir-audio-familiar" data-id="${fam.id}">🔊 Ouvir</button>` : ''}
                    <button class="btn-remover btn-remover-familiar" data-id="${fam.id}">🗑️ Remover</button>
                </div>
            </div>
        `;
    }
    
    html += `
                </div>
                <div style="margin-top:1rem;">
                    <input type="text" id="novo-nome" placeholder="Nome do familiar">
                    <input type="text" id="nova-relacao" placeholder="Relação">
                    <button id="add-familiar-cuidador" class="btn-prim">➕ Adicionar Familiar</button>
                </div>
            </div>

            <!-- Seção Música de Fundo -->
            <div class="card">
                <h3>🎵 Música de Fundo</h3>
                <label>
                    <input type="checkbox" id="musica-fundo-toggle" ${localStorage.getItem('musica-fundoEnabled') !== 'false' ? 'checked' : ''}>
                    Ativar música ambiente
                </label>
            </div>
            
            <!-- Seção Rotina -->
            <div class="card">
                <h3>📋 Rotina de Hoje</h3>
                <div id="lista-atividades-cuidador">
    `;
    
    for (let atv of rotinaHoje.atividades) {
        const imgUrl = atv.imagemBlob ? URL.createObjectURL(atv.imagemBlob) : null;
        html += `
            <div style="margin-bottom:1rem; padding:0.5rem; background:#f9f3e9; border-radius:24px; display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
                ${imgUrl ? `<img src="${imgUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 12px;">` : ''}
                <div style="flex:1">
                    <strong>${escapeHtml(atv.texto)}</strong> ${escapeHtml(atv.imagem || '')}
                </div>
                <div>
                    <button class="btn-sec btn-gravar-audio-atividade" data-id="${atv.id}">🎙️ Áudio (30s)</button>
                    ${atv.audioBlob ? `<button class="btn-sec btn-ouvir-audio-atividade" data-id="${atv.id}">🔊 Ouvir</button>` : ''}
                    <button class="btn-sec btn-imagem-atividade" data-id="${atv.id}">🖼️ Imagem</button>
                    <button class="btn-remover remover-atv" data-id="${atv.id}">Remover</button>
                </div>
            </div>
        `;
    }
    
    html += `
                </div>
                <div style="margin-top:1rem;">
                    <input type="text" id="nova-atividade-texto" placeholder="Nova atividade">
                    <input type="text" id="nova-atividade-imagem" placeholder="Emoji">
                    <button id="adicionar-atividade" class="btn-prim">➕ Adicionar</button>
                </div>
            </div>
            
            <!-- Seção Histórias -->
            <div class="card">
                <h3>📖 Minha História</h3>
                <div id="lista-historias">
    `;
    
    const historias = await getAll('historias');
    for (let h of historias) {
        // Miniaturas das imagens (até 4)
        let miniaturasHtml = '';
        if (h.imagensBlob && h.imagensBlob.length) {
            miniaturasHtml = '<div style="display:flex; flex-wrap:wrap; gap:5px; margin:5px 0;">';
            const maxPreview = Math.min(h.imagensBlob.length, 4);
            for (let i = 0; i < maxPreview; i++) {
                const url = URL.createObjectURL(h.imagensBlob[i]);
                miniaturasHtml += `<img src="${url}" style="width:40px; height:40px; object-fit:cover; border-radius:8px;">`;
            }
            if (h.imagensBlob.length > 4) {
                miniaturasHtml += `<span style="font-size:12px; background:#eee; padding:4px 8px; border-radius:20px;">+${h.imagensBlob.length-4}</span>`;
            }
            miniaturasHtml += '</div>';
        }
        html += `
            <div style="margin-bottom:1rem; border-bottom:1px solid #ccc; padding-bottom:0.5rem;" data-historia-id="${h.id}">
                <strong>${escapeHtml(h.titulo)}</strong><br>
                <small>${escapeHtml(h.descricao)}</small><br>
                <button class="btn-sec btn-gravar-audio-historia" data-id="${h.id}">🎙️ Gravar Áudio (5min)</button>
                ${h.audioBlob ? `<button class="btn-sec btn-ouvir-audio-historia" data-id="${h.id}">🔊 Ouvir</button>` : ''}
                <button class="btn-sec btn-selecionar-imagens-historia" data-id="${h.id}">📷 Selecionar Imagens (até 20)</button>
                ${miniaturasHtml}
                <button class="btn-remover btn-remover-historia" data-id="${h.id}">🗑️ Remover</button>
            </div>
        `;
    }
    
    html += `
                </div>
                <input type="text" id="hist-titulo" placeholder="Título">
                <textarea id="hist-desc" placeholder="Descrição"></textarea>
                <button id="add-historia-cuidador" class="btn-prim">➕ Adicionar História</button>
            </div>
        </div>
    `;
    
    main.innerHTML = html;
    
    // ---------- Event Listeners ----------
    
    // Salvar dados do usuário
    const btnUserSalvar = document.getElementById('user-salvar');
    if (btnUserSalvar) {
        btnUserSalvar.addEventListener('click', async () => {
            const nome = document.getElementById('user-nome').value;
            const cidade = document.getElementById('user-cidade').value;
            const profissao = document.getElementById('user-profissao').value;
            let usuario = await getById('configuracoes', 'usuario');
            if (!usuario) usuario = { chave: 'usuario', valor: {} };
            usuario.valor = { 
                nome, 
                cidade, 
                profissao, 
                fotoBlob: usuario.valor.fotoBlob || null 
            };
            await saveItem('configuracoes', usuario);
            alert('Dados do usuário salvos!');
            renderCuidador();
        });
    }
    
    // Selecionar foto do usuário
    const btnUserFoto = document.getElementById('user-foto-btn');
    if (btnUserFoto) {
        btnUserFoto.addEventListener('click', () => {
            selectImageFile(async (file) => {
                let usuario = await getById('configuracoes', 'usuario');
                if (!usuario) usuario = { chave: 'usuario', valor: {} };
                usuario.valor.fotoBlob = file;
                await saveItem('configuracoes', usuario);
                alert('Foto salva!');
                renderCuidador();
            });
        });
    }
    
    // -------- Familiares ----------
    document.querySelectorAll('.btn-selecionar-foto').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            selectImageFile(async (fileBlob) => {
                const familiar = await getById('familiares', id);
                familiar.fotoBlob = fileBlob;
                await saveItem('familiares', familiar);
                renderCuidador();
            });
        });
    });
    
    document.querySelectorAll('.btn-gravar-audio-familiar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            if (isRecording('familiar', id)) {
                await startRecordingWithOption(60, 'familiar', id, async (audioBlob) => {
                    const familiar = await getById('familiares', id);
                    familiar.audioBlob = audioBlob;
                    await saveItem('familiares', familiar);
                    renderCuidador();
                });
            } else {
                await startRecordingWithOption(60, 'familiar', id, async (audioBlob) => {
                    const familiar = await getById('familiares', id);
                    familiar.audioBlob = audioBlob;
                    await saveItem('familiares', familiar);
                    renderCuidador();
                });
            }
        });
    });
    
    document.querySelectorAll('.btn-ouvir-audio-familiar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            const familiar = await getById('familiares', id);
            if (familiar && familiar.audioBlob) playAudioBlob(familiar.audioBlob);
        });
    });
    
    document.querySelectorAll('.btn-remover-familiar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            await deleteItem('familiares', id);
            renderCuidador();
        });
    });
    
    const addFamiliarBtn = document.getElementById('add-familiar-cuidador');
    if (addFamiliarBtn) {
        addFamiliarBtn.addEventListener('click', async () => {
            const nome = document.getElementById('novo-nome').value.trim();
            const relacao = document.getElementById('nova-relacao').value.trim();
            if (nome) {
                await saveItem('familiares', { nome, relacao, fotoBlob: null, audioBlob: null });
                renderCuidador();
            } else {
                alert('Informe o nome do familiar.');
            }
        });
    }
    
    // -------- Atividades ----------
    document.querySelectorAll('.btn-imagem-atividade').forEach(btn => {
        btn.addEventListener('click', async () => {
            const atvId = parseInt(btn.dataset.id);
            selectImageFile(async (file) => {
                const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
                const atividade = rotinaObj.atividades.find(a => a.id === atvId);
                if (atividade) {
                    atividade.imagemBlob = file;
                    await saveItem('rotinas', rotinaObj);
                    renderCuidador();
                }
            });
        });
    });
    
    document.querySelectorAll('.btn-gravar-audio-atividade').forEach(btn => {
        btn.addEventListener('click', async () => {
            const atvId = parseInt(btn.dataset.id);
            if (isRecording('atividade', atvId)) {
                await startRecordingWithOption(30, 'atividade', atvId, async (audioBlob) => {
                    const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
                    const atividade = rotinaObj.atividades.find(a => a.id === atvId);
                    if (atividade) {
                        atividade.audioBlob = audioBlob;
                        await saveItem('rotinas', rotinaObj);
                        renderCuidador();
                    }
                });
            } else {
                await startRecordingWithOption(30, 'atividade', atvId, async (audioBlob) => {
                    const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
                    const atividade = rotinaObj.atividades.find(a => a.id === atvId);
                    if (atividade) {
                        atividade.audioBlob = audioBlob;
                        await saveItem('rotinas', rotinaObj);
                        renderCuidador();
                    }
                });
            }
        });
    });
    
    document.querySelectorAll('.btn-ouvir-audio-atividade').forEach(btn => {
        btn.addEventListener('click', async () => {
            const atvId = parseInt(btn.dataset.id);
            const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
            const atividade = rotinaObj.atividades.find(a => a.id === atvId);
            if (atividade && atividade.audioBlob) playAudioBlob(atividade.audioBlob);
        });
    });
    
    document.querySelectorAll('.remover-atv').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
            rotinaObj.atividades = rotinaObj.atividades.filter(a => a.id !== id);
            await saveItem('rotinas', rotinaObj);
            renderCuidador();
        });
    });
    
    const addAtividadeBtn = document.getElementById('adicionar-atividade');
    if (addAtividadeBtn) {
        addAtividadeBtn.addEventListener('click', async () => {
            const texto = document.getElementById('nova-atividade-texto').value.trim();
            const imagem = document.getElementById('nova-atividade-imagem').value.trim() || "📌";
            if (!texto) return;
            const rotinaObj = await getById('rotinas', currentRotinaIdCuidador);
            const novoId = Date.now();
            rotinaObj.atividades.push({ id: novoId, texto, imagem, concluido: false, audioBlob: null, imagemBlob: null });
            await saveItem('rotinas', rotinaObj);
            renderCuidador();
        });
    }
    
    // -------- Histórias ----------
    const addHistoriaBtn = document.getElementById('add-historia-cuidador');
    if (addHistoriaBtn) {
        addHistoriaBtn.addEventListener('click', async () => {
            const titulo = document.getElementById('hist-titulo').value.trim();
            const desc = document.getElementById('hist-desc').value.trim();
            if (titulo) {
                await saveItem('historias', { 
                    titulo, 
                    descricao: desc, 
                    fotoUrl: "📖", 
                    audioBlob: null,
                    imagensBlob: [] 
                });
                renderCuidador();
            } else {
                alert('Informe o título da história.');
            }
        });
    }
    
    document.querySelectorAll('.btn-gravar-audio-historia').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            if (isRecording('historia', id)) {
                await startRecordingWithOption(300, 'historia', id, async (audioBlob) => {
                    const historia = await getById('historias', id);
                    if (historia) {
                        historia.audioBlob = audioBlob;
                        await saveItem('historias', historia);
                        renderCuidador();
                    }
                });
            } else {
                await startRecordingWithOption(300, 'historia', id, async (audioBlob) => {
                    const historia = await getById('historias', id);
                    if (historia) {
                        historia.audioBlob = audioBlob;
                        await saveItem('historias', historia);
                        renderCuidador();
                    }
                });
            }
        });
    });
    
    document.querySelectorAll('.btn-ouvir-audio-historia').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            const historia = await getById('historias', id);
            if (historia && historia.audioBlob) playAudioBlob(historia.audioBlob);
        });
    });
    
    document.querySelectorAll('.btn-remover-historia').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            await deleteItem('historias', id);
            renderCuidador();
        });
    });
    
    document.querySelectorAll('.btn-selecionar-imagens-historia').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = async (event) => {
                const files = Array.from(event.target.files);
                if (files.length === 0) return;
                const historia = await getById('historias', id);
                if (!historia) return;
                if (!historia.imagensBlob) historia.imagensBlob = [];
                if (historia.imagensBlob.length + files.length > 20) {
                    alert(`Máximo de 20 imagens. Você já tem ${historia.imagensBlob.length}.`);
                    return;
                }
                for (let file of files) {
                    historia.imagensBlob.push(file);
                }
                await saveItem('historias', historia);
                renderCuidador();
            };
            input.click();
        });
    });
    
    // -------- Música de fundo ----------
const bgToggle = document.getElementById('musica-fundo-toggle');
const bgMusic = document.getElementById('bg-music');

if (bgToggle && bgMusic) {
    // Função para tentar tocar a música (respeitando autoplay)
    function toggleMusic(play) {
        if (play) {
            bgMusic.play().catch(e => {
                console.log('Autoplay bloqueado. Toque no checkbox novamente se necessário.');
                // Se falhar, tentamos novamente com um pequeno delay (opcional)
                setTimeout(() => bgMusic.play().catch(e => console.log('Falha ao tocar música')), 100);
            });
        } else {
            bgMusic.pause();
        }
    }
    
    // Estado inicial
    const isEnabled = localStorage.getItem('musica-fundoEnabled') !== 'false';
    bgToggle.checked = isEnabled;
    if (isEnabled) {
        toggleMusic(true);
    }
    
    // Evento de mudança
    bgToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('musica-fundoEnabled', enabled);
        toggleMusic(enabled);
    });
}
}