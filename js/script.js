document.addEventListener("DOMContentLoaded", () => {
    // Injetando o Widget com as novas opções
    const widgetHTML = `
        <div id="accessibility-widget">
            <button id="a11y-btn" aria-label="Menu de Acessibilidade" title="Acessibilidade">♿</button>
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
                    <button id="a11y-reader">Leitor de Texto: 🔴 DESATIVADO</button>
                    <button id="a11y-legend">Legenda no Mouse: 🔴 DESATIVADO</button>
                </div>
            </div>
        </div>
        <div id="a11y-tooltip"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    let currentFontSize = 100;
    let readerActive = false;
    let legendActive = false;

    const btn = document.getElementById("a11y-btn");
    const menu = document.getElementById("a11y-menu");
    const tooltip = document.getElementById("a11y-tooltip");
    const fontDisplay = document.getElementById("a11y-font-display");

    // Toggle Menu
    btn.addEventListener("click", () => menu.classList.toggle("active"));

    // Tema
    document.getElementById("a11y-theme").addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    // Fonte (Aumentar/Diminuir e mostrar %)
    document.getElementById("a11y-font-up").addEventListener("click", () => {
        if (currentFontSize < 200) currentFontSize += 10;
        updateFontSize();
    });
    
    document.getElementById("a11y-font-down").addEventListener("click", () => {
        if (currentFontSize > 60) currentFontSize -= 10;
        updateFontSize();
    });

    function updateFontSize() {
        document.body.style.fontSize = currentFontSize + "%";
        fontDisplay.innerText = currentFontSize + "%";
    }

    // Escolher Fonte (Dropdown)
    document.getElementById("a11y-font-family").addEventListener("change", (e) => {
        document.documentElement.style.setProperty('--font-family', e.target.value);
    });

    // Saturação (Dropdown)
    document.getElementById("a11y-saturation").addEventListener("change", (e) => {
        document.body.style.filter = `saturate(${e.target.value})`;
    });

    // Leitor de Texto
    const readerBtn = document.getElementById("a11y-reader");
    readerBtn.addEventListener("click", () => {
        readerActive = !readerActive;
        readerBtn.innerHTML = `Leitor de Texto: ${readerActive ? '🟢 ATIVADO' : '🔴 DESATIVADO'}`;
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
        legendBtn.innerHTML = `Legenda no Mouse: ${legendActive ? '🟢 ATIVADO' : '🔴 DESATIVADO'}`;
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