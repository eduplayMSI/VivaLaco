// voice.js - versão final corrigida
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
}

// voice.js - adicione no topo, após a variável recognition
let speechAllowed = false;
let pendingSpeechQueue = [];

// Inicializa a síntese de voz no primeiro clique/toque do usuário
function enableSpeechOnUserInteraction() {
    if (speechAllowed) return; // já ativado
    
    const handler = () => {
        speechAllowed = true;
        // Fala qualquer mensagem que estava na fila
        while (pendingSpeechQueue.length) {
            const { text, rate } = pendingSpeechQueue.shift();
            speakText(text, rate);
        }
        // Remove o listener após a primeira interação
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
        console.log("Síntese de voz ativada pelo usuário");
    };
    
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
}

function speakText(text, rate = 0.9) {
    if (!window.speechSynthesis) return;
    
    // Se ainda não houve interação do usuário, enfileira a mensagem
    if (!speechAllowed) {
        pendingSpeechQueue.push({ text, rate });
        return;
    }
    
    // Interrompe áudio anterior e fala atual
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
}

function startVoiceCommand(callback) {
    if (!recognition) {
        speakText("Seu navegador não suporta reconhecimento de voz.");
        return;
    }
    // Aborta qualquer reconhecimento anterior
    try { recognition.abort(); } catch(e) {}
    
    speakText("Estou ouvindo. Fale um comando.");
    const micBtn = document.querySelector('.fab-mic');
    if (micBtn) micBtn.style.opacity = '0.5';
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        const command = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        console.log("Comando reconhecido:", command);
        callback(command);
        if (micBtn) micBtn.style.opacity = '1';
    };
    
    recognition.onerror = (event) => {
        console.error("Erro reconhecimento:", event.error);
        if (event.error === 'not-allowed') {
            speakText("Permissão do microfone negada. Por favor, permita o acesso.");
        } else if (event.error === 'no-speech') {
            speakText("Não ouvi nada. Tente novamente.");
        } else {
            speakText("Não entendi. Tente novamente.");
        }
        if (micBtn) micBtn.style.opacity = '1';
    };
    
    recognition.onend = () => {
        if (micBtn) micBtn.style.opacity = '1';
    };
    
    recognition.start();
}

function processVoiceCommand(command) {
    console.log("Processando comando:", command);
    if (command.includes('o que faco agora') || command.includes('agora') || command.includes('atividade')) {
        speakText("Vamos ver sua atividade atual.");
        if (window.loadScreen) window.loadScreen('agora');
    } 
    else if (command.includes('quem esta comigo') || command.includes('familia') || command.includes('familiares')) {
        speakText("Abrindo sua família.");
        if (window.loadScreen) window.loadScreen('familia');
    }
    else if (command.includes('confuso') || command.includes('ajuda') || command.includes('socorro')) {
        speakText("Vou te ajudar. Abrindo modo conforto.");
        if (window.loadScreen) window.loadScreen('confuso');
    }
    else if (command.includes('rotina')) {
        speakText("Abrindo sua rotina.");
        if (window.loadScreen) window.loadScreen('rotina');
    }
    else if (command.includes('historia') || command.includes('história')) {
        speakText("Abrindo sua história.");
        if (window.loadScreen) window.loadScreen('historia');
    }
    else {
        speakText("Comando não reconhecido. Você pode dizer: O que faço agora? Quem está comigo? Estou confuso.");
    }
}

function speakThenPlayAudio(text, audioBlob) {
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    if (!window.speechSynthesis) {
        if (audioBlob) playAudioBlob(audioBlob);
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.onend = () => {
        if (audioBlob) playAudioBlob(audioBlob);
    };
    window.speechSynthesis.speak(utterance);
}

function attachVoiceButton(buttonId, textToSpeak) {
    const btn = document.getElementById(buttonId);
    if (btn) btn.addEventListener('click', () => speakText(textToSpeak));
}

// Ativar a fala somente após o primeiro toque/clique
enableSpeechOnUserInteraction();