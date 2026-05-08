// media-utils.js - com suporte a parada antecipada

let activeRecorder = null; // { type, id, mediaRecorder, stream, timer, onStopCallback }

// Verifica se há gravação ativa para um determinado tipo e id
function isRecording(type, id) {
    return activeRecorder && activeRecorder.type === type && activeRecorder.id === id;
}

// Cancela qualquer gravação em andamento sem salvar
function cancelRecording() {
    if (activeRecorder) {
        clearTimeout(activeRecorder.timer);
        if (activeRecorder.mediaRecorder.state === 'recording') {
            activeRecorder.mediaRecorder.onstop = null; // evita callback
            activeRecorder.mediaRecorder.stop();
        }
        if (activeRecorder.stream) {
            activeRecorder.stream.getTracks().forEach(t => t.stop());
        }
        activeRecorder = null;
    }
}

// Para a gravação atual e salva (chama o callback)
function stopRecordingAndSave() {
    if (activeRecorder) {
        clearTimeout(activeRecorder.timer);
        if (activeRecorder.mediaRecorder.state === 'recording') {
            activeRecorder.mediaRecorder.stop();
        }
    }
}

// Inicia gravação ou para se já estiver gravando o mesmo item
async function startRecordingWithOption(maxSeconds, type, id, onStopCallback) {
    // Se já estiver gravando exatamente este item, para a gravação e salva
    if (isRecording(type, id)) {
        stopRecordingAndSave();
        return;
    }
    // Se houver outra gravação em andamento, cancela (sem salvar)
    if (activeRecorder) {
        cancelRecording();
    }
    // Inicia nova gravação
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            if (activeRecorder && activeRecorder.onStopCallback) {
                activeRecorder.onStopCallback(audioBlob);
            }
            // Limpar stream
            if (activeRecorder && activeRecorder.stream) {
                activeRecorder.stream.getTracks().forEach(t => t.stop());
            }
            activeRecorder = null;
        };
        mediaRecorder.start();
        const timer = setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }, maxSeconds * 1000);
        activeRecorder = {
            type, id,
            mediaRecorder,
            stream,
            timer,
            onStopCallback
        };
    } catch (err) {
        console.error("Erro microfone:", err);
        alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
}

// Funções auxiliares já existentes
function selectImageFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) callback(file);
    };
    input.click();
}

function playAudioBlob(blob) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.play();
}

// Variável global para controle de áudio
window.currentAudio = null;

function playAudioBlob(blob) {
    if (!blob) return;
    // Interrompe qualquer áudio anterior
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    window.currentAudio = audio;
    audio.onended = () => {
        URL.revokeObjectURL(url);
        if (window.currentAudio === audio) window.currentAudio = null;
    };
    audio.play().catch(e => console.log("Erro ao tocar áudio:", e));
}