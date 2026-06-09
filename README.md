# 🧠 VivaLaço – PWA de Apoio Cognitivo para Alzheimer Inicial

[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen)](https://eduplaymsi.github.io/VivaLaco/)
[![PWA](https://img.shields.io/badge/PWA-installable-blue)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline-first](https://img.shields.io/badge/offline--first-ready-darkgreen)](https://web.dev/offline-fallback-page/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **VivaLaço** é um Progressive Web App (PWA) instalável, projetado para pessoas com comprometimento cognitivo leve a moderado (Alzheimer inicial).  
> O aplicativo prioriza **autonomia, orientação temporal, memória, rotina diária e suporte emocional**, com interface extremamente simples, acessível e configurável por um cuidador.

🔗 **Acesse agora:** [https://eduplaymsi.github.io/VivaLaco/](https://eduplaymsi.github.io/VivaLaco/)  
📱 **Instale no seu celular** – funciona offline!

---

## 📌 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Público-alvo](#público-alvo)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura e Estrutura de Arquivos](#arquitetura-e-estrutura-de-arquivos)
- [Como Usar](#como-usar)
  - [Para o Paciente](#para-o-paciente)
  - [Para o Cuidador](#para-o-cuidador)
- [Instalação e Execução Local](#instalação-e-execução-local)
- [Build e Deploy](#build-e-deploy)
- [Roadmap de Melhorias](#roadmap-de-melhorias)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato e Suporte](#contato-e-suporte)

---

## Visão Geral

O **VivaLaço** nasceu da necessidade de oferecer uma ferramenta digital simples, acolhedora e funcional para idosos com Alzheimer inicial, bem como para seus familiares e cuidadores. O aplicativo não depende de internet (offline-first), pode ser instalado como um app nativo no celular ou tablet e utiliza **comandos de voz**, **síntese de fala**, **gravações personalizadas** e **alto contraste** para garantir acessibilidade máxima.

**Principais diferenciais:**
- ✅ Totalmente funcional **offline** (após primeira carga)
- ✅ Configurável pelo cuidador (fotos, áudios, rotinas, histórias)
- ✅ **Comandos de voz** ("O que faço agora?", "Quem está comigo?")
- ✅ **Leitura da tela** (TTS) e ajuste de tamanho da fonte
- ✅ **Modo emergência** "Estou confuso" com música calmante e mensagem de segurança
- ✅ **Carrossel de imagens** nas histórias (loop infinito suave e automático)
- ✅ Sem necessidade de cadastro, sem servidor – os dados ficam apenas no dispositivo

---

## Funcionalidades

### 👤 Para o paciente (usuário final)

| Funcionalidade | Descrição |
|----------------|------------|
| 🏠 **Tela "Agora"** | Mostra a próxima atividade não concluída do dia, com botão para ouvir instrução (TTS + áudio gravado pelo cuidador). |
| 📋 **Rotina completa** | Lista de todas as atividades do dia, com botões "Concluir" e "Ouvir instrução". |
| 👪 **Minha Família** | Galeria de familiares com foto, nome, relação e botão para ouvir áudio gravado (ex.: "João, seu filho"). |
| 📖 **Minha História** | Histórias de vida com título, descrição e áudio gravado; ao clicar em "Ouvir", inicia um carrossel automático com as imagens enviadas pelo cuidador. |
| 🆘 **Estou confuso** | Modo emergência: música calmante, mensagem de segurança e sugestão de contato com familiar. |
| 🎤 **Comandos de voz** | Botão flutuante de microfone. Comandos: "O que faço agora?", "Quem está comigo?", "Estou confuso", "Rotina", "História". |
| 🔊 **Síntese de voz** | O aplicativo fala instruções, nomes, histórias e mensagens de apoio. |
| 🌓 **Alto contraste** | Troca o tema para fundo preto com texto amarelo/branco, invertendo ícones e imagens de wallpaper. |
| 🔠 **Tamanho da fonte** | 4 opções: pequeno, médio, grande, extra-grande. |
| 🎵 **Música de fundo** | Ativável pelo cuidador, toca em loop durante o uso. |

### 🔧 Para o cuidador (painel de configuração)

| Funcionalidade | Descrição |
|----------------|------------|
| 🧑‍🦳 **Dados do paciente** | Define nome, cidade, profissão e foto de perfil. |
| 👪 **Gerenciar familiares** | Adiciona/remove familiares, define foto, grava áudio (ex.: "Sua filha Ana"). |
| 📋 **Rotina diária** | Cria atividades, define emoji/imagem personalizada, grava instrução de até 30s. |
| 📖 **Histórias de vida** | Adiciona título e descrição, grava áudio de até 5 minutos, insere até 20 imagens para o carrossel. |
| 🎵 **Música de fundo** | Habilita/desabilita a música ambiente. |
| 🖼️ **Upload de imagens** | Fotos de familiares, atividades e histórias são armazenadas como blobs no IndexedDB. |

---

## Público-alvo

- **Usuário primário:** Idosos com diagnóstico de Alzheimer em estágio inicial ou moderado, que ainda possuem capacidade de toque e reconhecimento básico, mas apresentam déficits de memória e orientação.
- **Usuário secundário:** Cuidadores familiares ou profissionais (filhos, cônjuges, enfermeiros) que configuram e mantêm o aplicativo.

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ |
| **PWA** | Manifest.json, Service Worker, Cache Storage |
| **Armazenamento local** | IndexedDB (blobs de imagens e áudios) |
| **Síntese e reconhecimento de fala** | Web Speech API (`SpeechSynthesis`, `SpeechRecognition`) |
| **Gravação de áudio** | MediaRecorder API |
| **Hospedagem** | GitHub Pages (estática) |
| **Versionamento** | Git |

**Nenhum framework ou dependência externa** – código puro para máxima leveza e compatibilidade.

---

## Arquitetura e Estrutura de Arquivos

O projeto segue uma arquitetura **offline-first** com modularização por funcionalidade:

VivaLaco/
├── index.html
├── manifest.json
├── service-worker.js
├── assets/
│ ├── fonts/ # Nunito (WOFF2)
│ ├── icons/ # Ícones PWA, microfone, audição, conclusão
│ ├── sounds/ # musica-fundo.mp3 (opcional)
│ └── wallpaper-*.jpg
├── css/
│ └── styles.css # Temas, responsividade, alto contraste
└── js/
├── app.js # Roteamento, navegação, PWA install
├── db.js # IndexedDB wrapper
├── accessibility.js # Alto contraste, tamanho fonte, leitura
├── voice.js # TTS, STT, comandos de voz
├── media-utils.js # Gravação áudio, seleção de imagem
├── saudacoes.js # Saudação personalizada + emoji
├── agora.js
├── rotina.js
├── familia.js
├── historia.js
├── confuso.js
└── cuidador.js

text

**Fluxo de dados:**
- Toda gravação de áudio e upload de imagem é convertida para `Blob` e persistida no IndexedDB.
- O Service Worker cacheia apenas assets estáticos (HTML, CSS, JS, ícones, wallpapers).
- As telas são renderizadas dinamicamente via `innerHTML` e funções globais (`window.renderXxx`).

---

## Como Usar

### Para o Paciente

1. **Instalar o app:** No celular, acesse o link, clique em “Adicionar à tela inicial” (ou “Instalar app”) – funciona como um app nativo.
2. **Navegar pelos botões inferiores:**
   - 🏠 **Agora** – veja o que fazer agora.
   - 📋 **Rotina** – veja todas as atividades do dia.
   - 👪 **Família** – ouça recados dos familiares.
   - 📖 **Minha História** – relembre histórias e veja fotos.
   - 🆘 **Ajuda** – se sentir confuso, ative a música calmante.
3. **Usar o microfone flutuante** para dar comandos de voz.
4. **Ajustar acessibilidade** pelo menu ☰ (alto contraste, tamanho da fonte, ler tudo).

### Para o Cuidador

1. Acesse a tela **🔧 Cuidador** (último ícone da barra inferior).
2. Preencha os **dados do paciente** (nome, cidade, profissão, foto).
3. **Adicione familiares:** nome, relação, foto, grave um áudio (ex.: "Sua esposa Maria").
4. **Crie a rotina diária:** atividades, emojis/imagens, grave instruções (até 30s cada).
5. **Adicione histórias de vida:** título, descrição, grave um áudio (até 5 min) e selecione até 20 imagens.
6. **Ative a música de fundo** se desejar (checkbox persistente).
7. Ao final, o paciente pode usar o app normalmente. Todas as configurações ficam salvas no dispositivo.

---

## Instalação e Execução Local

```bash
# Clone o repositório
git clone https://github.com/eduplaymsi/VivaLaco.git

# Entre no diretório
cd VivaLaco

# Inicie um servidor local (ex.: usando Python)
python -m http.server 8000

# Ou use o Live Server do VS Code
Abra http://localhost:8000 no navegador.
Para testar como PWA, é recomendado usar HTTPS (local pode usar ngrok ou serve com certificado autoassinado).

Build e Deploy
O projeto é totalmente estático – não requer build. Para fazer deploy no GitHub Pages:

Crie um repositório no GitHub.

Faça o push do código para a branch main.

No repositório, acesse Settings > Pages e selecione a branch main (pasta /).

O site estará disponível em https://<seu-usuario>.github.io/<repositorio>/.

O Service Worker e o manifest.json devem estar na raiz para funcionamento correto do PWA.

Roadmap de Melhorias
Prazo	Melhoria
Curto	🎯 Otimizar LCP (pré-carregar imagem da primeira atividade)
Curto	🔄 Substituir música calmante por arquivo local e cacheá-la
Curto	📦 Adicionar música de fundo ao cache do Service Worker
Médio	🖼️ Converter wallpapers e ícones para WebP
Médio	🔁 Funcionalidade de exportar/importar dados (backup)
Médio	📱 Melhorar suporte à síntese de voz no iOS
Longo	☁️ Sincronização cloud opcional (Firebase) para compartilhar configurações entre dispositivos
Longo	🧪 Testes end-to-end (Playwright/Cypress)
Contribuição
Contribuições são muito bem-vindas! Sinta-se à vontade para:

Reportar bugs ou sugerir melhorias via Issues.

Enviar pull requests com correções ou novas funcionalidades (preferencialmente seguindo a mesma filosofia leve e offline-first).

Antes de contribuir, verifique o roadmap e as issues abertas.

Licença
Este projeto está licenciado sob a MIT License – veja o arquivo LICENSE para detalhes.

Contato e Suporte
Demo online: https://eduplaymsi.github.io/VivaLaco/

Autor: eduplaymsi

Problemas técnicos: Abra uma issue neste repositório.

Desenvolvido com 💙 para pessoas que precisam de um apoio diário e seus cuidadores.
VivaLaço – Seu laço de carinho e memória.
