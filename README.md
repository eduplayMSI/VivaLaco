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
