document.addEventListener("DOMContentLoaded", () => {
    // 1. Injeta o Widget com o novo Ícone SVG (sem fundo nenhum!)
    const widgetHTML = `
        <div id="accessibility-widget">
            <button id="a11y-btn" aria-label="Menu de Acessibilidade" title="Acessibilidade">
                <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
                </svg>
            </button>
            <div id="a11y-menu" role="dialog" aria-label="Opções de Acessibilidade">
                <h3 style="margin-top:0; font-size:16px;">Painel de Acessibilidade</h3>
                
                <div class="a11y-group">
                    <button id="a11y-theme">Alternar Tema Claro/Escuro</button>
                </div>

                <div class="a11y-group">
                    <label>Tamanho da Fonte: <span id="a11y-font-display">100%</span></label>
                    <div class="a11y-controls">
                        <button id="a11y-font-down" title="Diminuir Fonte">A-</button>
                        <button id="a11y-font-up" title="Aumentar Fonte">A+</button>
                    </div>
                </div>

                <div class="a11y-group">
                    <label for="a11y-font-family">Escolher Fonte:</label>
                    <select id="a11y-font-family">
                        <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Padrão do Site</option>
                        <option value="Arial, sans-serif">Arial (Simples)</option>
                        <option value="Georgia, serif">Georgia (Com Serifa)</option>
                        <option value="'Comic Sans MS', cursive, sans-serif">Dyslexic Friendly (Comic Sans)</option>
                    </select>
                </div>

                <div class="a11y-group">
                    <label for="a11y-saturation">Saturação da Página:</label>
                    <select id="a11y-saturation">
                        <option value="1">Normal (100%)</option>
                        <option value="0">Escala de Cinza (0%)</option>
                        <option value="0.5">Baixa Saturação (50%)</option>
                        <option value="1.5">Saturação Alta (150%)</option>
                    </select>
                </div>

                <div class="a11y-group">
                    <button id="a11y-reader">Leitor de Texto: 🔴 OFF</button>
                    <button id="a11y-legend">Legenda no Mouse: 🔴 OFF</button>
                </div>
            </div>
        </div>
        <div id="a11y-tooltip"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // 2. Lógica das Funções
    let currentFontSize = 100;
    let readerActive = false;
    let legendActive = false;

    const btn = document.getElementById("a11y-btn");
    const menu = document.getElementById("a11y-menu");
    const tooltip = document.getElementById("a11y-tooltip");
    const fontDisplay = document.getElementById("a11y-font-display");

    // Abrir/Fechar Menu
    btn.addEventListener("click", () => menu.classList.toggle("active"));

    // Tema
    document.getElementById("a11y-theme").addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    // Fonte - Aumentar e Diminuir (Agora afeta o site TODO, incluindo os textos p)
    document.getElementById("a11y-font-up").addEventListener("click", () => {
        if (currentFontSize < 200) currentFontSize += 10;
        updateFontSize();
    });
    
    document.getElementById("a11y-font-down").addEventListener("click", () => {
        if (currentFontSize > 60) currentFontSize -= 10;
        updateFontSize();
    });

    function updateFontSize() {
        // ESSA é a linha mágica que faz todos os textos baseados em "rem" aumentarem/diminuírem:
        document.documentElement.style.fontSize = currentFontSize + "%"; 
        fontDisplay.innerText = currentFontSize + "%";
    }

    // Fonte Family
    document.getElementById("a11y-font-family").addEventListener("change", (e) => {
        document.documentElement.style.setProperty('--font-family', e.target.value);
    });

    // Saturação
    document.getElementById("a11y-saturation").addEventListener("change", (e) => {
        document.body.style.filter = `saturate(${e.target.value})`;
    });

    // Leitor de Texto
    const readerBtn = document.getElementById("a11y-reader");
    readerBtn.addEventListener("click", () => {
        readerActive = !readerActive;
        readerBtn.innerHTML = `Leitor de Texto: ${readerActive ? '🟢 ON' : '🔴 OFF'}`;
        if (!readerActive) window.speechSynthesis.cancel();
    });

    document.body.addEventListener("click", (e) => {
        if (readerActive && !menu.contains(e.target) && e.target !== btn) {
            window.speechSynthesis.cancel();
            let text = e.target.innerText || e.target.alt;
            if (text) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
            }
        }
    });

    // Legenda no Mouse
    const legendBtn = document.getElementById("a11y-legend");
    legendBtn.addEventListener("click", () => {
        legendActive = !legendActive;
        legendBtn.innerHTML = `Legenda no Mouse: ${legendActive ? '🟢 ON' : '🔴 OFF'}`;
        tooltip.style.display = 'none';
    });

    document.body.addEventListener("mouseover", (e) => {
        if (legendActive && !menu.contains(e.target) && e.target !== btn) {
            let text = e.target.title || e.target.alt || (e.target.innerText ? e.target.innerText.substring(0, 80) : '');
            if (text && text.trim() !== '') {
                tooltip.innerText = text;
                tooltip.style.display = 'block';
            }
        }
    });

    document.body.addEventListener("mousemove", (e) => {
        if (legendActive) {
            tooltip.style.top = e.clientY + 20 + "px";
            tooltip.style.left = e.clientX + 20 + "px";
        }
    });

    document.body.addEventListener("mouseout", () => {
        tooltip.style.display = 'none';
    });
});