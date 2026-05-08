// Templates de saudação
const templates = [
    "{{saudacao}}, {{nome}}! {{emoji}} Vamos começar o dia?",
    "Olá {{nome}}, que bom ver você! Agora é hora de {{atividade}}.",
    "{{saudacao}}, {{nome}}! Você sabia que hoje temos {{atividade}}?",
    "Oi {{nome}}! {{emoji}} Já tomou café? Sua próxima atividade é {{atividade}}.",
    "Que bom ter você aqui, {{nome}}. Vamos fazer {{atividade}} juntos?",
    "{{saudacao}}! {{nome}}, o que acha de começarmos com {{atividade}}?",
    "Ei {{nome}}, estou aqui para ajudar. Vamos fazer {{atividade}}?",
    "{{nome}}, você está se lembrando de {{atividade}}? Vamos tentar?",
    "Olá {{nome}}, sorria! {{emoji}} É hora de {{atividade}}.",
    "{{nome}}, sua família e eu estamos torcendo por você. Vamos para {{atividade}}?"
];

function getSaudacaoByHour() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

function getRandomEmoji() {
    const emojis = ["😊", "🌟", "💙", "🌞", "🌸", "🍃", "☕", "🎵"];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function mostrarEmojiComFade() {
    const emojis = ["😊", "🌟", "💙", "🌞", "🌸", "🍃", "☕", "🎵"];
    const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
    const overlay = document.getElementById('emoji-overlay');
    if (!overlay) return;
    
    overlay.textContent = emojiAleatorio;
    overlay.style.opacity = '1';
    
    // Fade out após 1.5 segundos
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 1500);
}

async function getAtividadeAtualLabel() {
    const rotinas = await getAll('rotinas');
    const hoje = new Date().toDateString();
    let rotinaHoje = rotinas.find(r => r.dia === hoje);
    if (!rotinaHoje) return "descansar um pouco";
    const atividadesNaoConcluidas = rotinaHoje.atividades.filter(a => !a.concluido);
    if (atividadesNaoConcluidas.length > 0) return atividadesNaoConcluidas[0].texto.toLowerCase();
    if (rotinaHoje.atividades.length > 0) return rotinaHoje.atividades[rotinaHoje.atividades.length-1].texto.toLowerCase();
    return "relaxar e aproveitar o dia";
}

async function getNomeUsuario() {
    const configs = await getAll('configuracoes');
    const user = configs.find(c => c.chave === 'usuario');
    return user?.valor?.nome || "amigo";
}

async function playWelcomeGreeting() {
    const nome = await getNomeUsuario();
    if (!nome || nome === "amigo") return; // não fala se não tiver nome
    
    const atividade = await getAtividadeAtualLabel();
    const saudacao = getSaudacaoByHour();
    const emoji = getRandomEmoji();
    
    let template = templates[Math.floor(Math.random() * templates.length)];
    let mensagem = template
        .replace("{{saudacao}}", saudacao)
        .replace("{{nome}}", nome)
        .replace("{{atividade}}", atividade)
        .replace("{{emoji}}", emoji);
    
    // Aguardar um pouco para o TTS não conflitar com outros áudios
    setTimeout(() => speakText(mensagem), 500);
}