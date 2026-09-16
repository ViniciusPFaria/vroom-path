# Vroom Path

Um quebra-cabeça de blocos deslizantes para fãs de caminhão. Deslize os blocos vermelhos para cima e para baixo, e os blocos laranja para a esquerda e para a direita, até o Tito sair pela abertura da cerca.

O Tito é um sprite PNG. O restante das imagens, sons e notas musicais é desenhado ou tocado pelo código quando o jogo carrega.

Abra `index.html` no navegador (um servidor estático local serve), depois toque ou arraste.

GitHub Pages: https://viniciuspfaria.github.io/vroom-path/

## Tablet Android (Modo Criança)

O Phaser não gera APK sozinho. Este repositório empacota o mesmo jogo com Capacitor, então ele vira um aplicativo instalável e aparece na lista de apps do Modo Criança / Samsung Kids / Family Link.

### Instalar no tablet

1. Baixe o arquivo `app-release.apk` da aba **Actions** do GitHub (workflow **Android APK**, artefato `vroom-path-android`).
2. No tablet, permita instalar apps de fontes desconhecidas só para este arquivo.
3. Abra o APK e instale **Vroom Path**.
4. Coloque o jogo no modo criança:
   - **Samsung Kids / Modo Criança:** abra o modo criança, informe o PIN dos pais, toque em adicionar aplicativos e marque **Vroom Path**.
   - **Family Link / Kids Space:** no app dos pais, permita **Vroom Path** no perfil da criança.

O jogo roda offline. A tela permanece ligada enquanto está aberto, e o botão voltar não sai do jogo (use o Início / o PIN dos pais).

### Gerar o APK neste computador

```bash
npm install
npm run build:apk
```

O instalador fica em `android/app/build/outputs/apk/release/app-release.apk`.
