// Gerenciamento IndexedDB - dados do app (rotinas, familiares, historias, audios/fotos)
const DB_NAME = 'LarEmPazDB';
const DB_VERSION = 2;
let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const dbUp = event.target.result;
            if (!dbUp.objectStoreNames.contains('cuidador')) {
                dbUp.createObjectStore('cuidador', { keyPath: 'id' });
            }
            if (!dbUp.objectStoreNames.contains('rotinas')) {
                const rotinasStore = dbUp.createObjectStore('rotinas', { keyPath: 'id', autoIncrement: true });
                rotinasStore.createIndex('dia', 'dia');
            }
            if (!dbUp.objectStoreNames.contains('familiares')) {
                const familiaStore = dbUp.createObjectStore('familiares', { keyPath: 'id', autoIncrement: true });
            }
            if (!dbUp.objectStoreNames.contains('historias')) {
                dbUp.createObjectStore('historias', { keyPath: 'id', autoIncrement: true });
            }
            if (!dbUp.objectStoreNames.contains('configuracoes')) {
                dbUp.createObjectStore('configuracoes', { keyPath: 'chave' });
            }
            // Armazenamento de áudios e fotos em formato blob (usamos campos separados)
            // Para simplicidade, familiares terão 'fotoBlob', 'audioBlob'
        };
    });
}

// Funções genéricas
async function getAll(storeName) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function getById(storeName, id) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveItem(storeName, item) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteItem(storeName, id) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Inicialização de dados padrão
async function initDatabase() {
    await openDB();
    const rotinas = await getAll('rotinas');
    if (rotinas.length === 0) {
        const diaHoje = new Date().toDateString();
        const rotinaExemplo = {
            dia: diaHoje,
            atividades: [
                { id: 1, texto: "Tomar café da manhã", imagem: "☕", concluido: false, audioBlob: null },
                { id: 2, texto: "Escovar os dentes", imagem: "🪥", concluido: false, audioBlob: null },
                { id: 3, texto: "Dar uma volta no jardim", imagem: "🌿", concluido: false, audioBlob: null },
                { id: 4, texto: "Almoçar", imagem: "🍲", concluido: false, audioBlob: null }
            ]
        };
        await saveItem('rotinas', rotinaExemplo);
    }
    
    const familiares = await getAll('familiares');
    if (familiares.length === 0) {
        await saveItem('familiares', { nome: "Maria", relacao: "Esposa", fotoBlob: null, audioBlob: null });
        await saveItem('familiares', { nome: "José", relacao: "Filho", fotoBlob: null, audioBlob: null });
    }
    const historias = await getAll('historias');
    if (historias.length === 0) {
        await saveItem('historias', { titulo: "Minha infância", descricao: "Cresci em uma fazenda...", fotoUrl: "🌾", audioUrl: null });
        await saveItem('historias', { titulo: "Meu trabalho", descricao: "Fui professor por 30 anos.", fotoUrl: "📚", audioUrl: null });
    }
    const historiasExistentes = await getAll('historias');
    for (let hist of historiasExistentes) {
    if (!hist.imagensBlob) {
        hist.imagensBlob = [];
        await saveItem('historias', hist);
    }
    const configs = await getAll('configuracoes');
    const userConfig = configs.find(c => c.chave === 'usuario');
    if (!userConfig) {
        await saveItem('configuracoes', { chave: 'usuario', valor: { nome: "Antonio", cidade: "São Paulo", profissao: "Aposentado" } });
    }
    }
}