# Nuvem de Açúcar — site separado

Estrutura:
- index.html — estrutura e conteúdo
- css/style.css — estilos
- js/script.js — dados, lógica do cardápio, personalizador, WhatsApp, menu mobile e animações
- assets/ — reservado para imagens, logos e outros arquivos

Dependências externas:
- Google Fonts (carregadas no index.html)
- GSAP 3.12.5 e ScrollTrigger (carregados via CDN no index.html)

Antes de publicar:
1. Abra `js/script.js`.
2. Altere `CONFIG.whatsappNumber` para o número real, somente com dígitos.
3. Altere `CONFIG.instagramUrl` para o Instagram real.
4. Confira os preços e opções em `MENU`, `SIZES`, `BATTERS`, `FILLINGS`, `FROSTINGS` e `THEMES`.
