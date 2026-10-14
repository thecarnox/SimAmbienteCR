
/* ==========================================
   SIMAMBIENTECR
   CONFIGURACIÓN GLOBAL DEL VIDEOJUEGO
========================================== */

(() => {

    const STORAGE_KEY = "simambiente_opciones";

    const configuracionInicial = {
        volumen: 50,
        silenciado: false,
        fuente: 100
    };

    let configuracion = { ...configuracionInicial };

    // ==========================================
    // RECUPERAR CONFIGURACIÓN
    // ==========================================

    try {

        const guardado = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (guardado && typeof guardado === "object") {
            configuracion = {
                ...configuracionInicial,
                ...guardado
            };
        }

    } catch (error) {
        console.warn(
            "No se pudo recuperar la configuración:",
            error
        );
    }

    const limitar = (valor, minimo, maximo) =>
        Math.max(minimo, Math.min(maximo, valor));

    configuracion.volumen = limitar(
        Number(configuracion.volumen) || 0,
        0,
        100
    );

    configuracion.fuente = limitar(
        Number(configuracion.fuente) || 100,
        80,
        140
    );

    configuracion.silenciado =
        configuracion.silenciado === true;

    // ==========================================
    // ELEMENTOS DEL MENÚ
    // ==========================================

    const pauseMainView =
        document.getElementById("pauseMainView");

    const gameOptionsView =
        document.getElementById("gameOptionsView");

    const optionsBtn =
        document.getElementById("optionsBtn");

    const backToPauseBtn =
        document.getElementById("backToPauseBtn");

    const volumeSlider =
        document.getElementById("gameVolume");

    const volumeValue =
        document.getElementById("volumeValue");

    const volumeDownBtn =
        document.getElementById("volumeDownBtn");

    const volumeUpBtn =
        document.getElementById("volumeUpBtn");

    const muteGameBtn =
        document.getElementById("muteGameBtn");

    const fontSlider =
        document.getElementById("gameFontSize");

    const fontSizeValue =
        document.getElementById("fontSizeValue");

    const fontDecreaseBtn =
        document.getElementById("fontDecreaseBtn");

    const fontIncreaseBtn =
        document.getElementById("fontIncreaseBtn");

    const resetFontBtn =
        document.getElementById("resetFontBtn");

    const bgSound =
        document.getElementById("bgSound");

    // ==========================================
    // GUARDAR CONFIGURACIÓN
    // ==========================================

    function guardarConfiguracion() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(configuracion)
            );

        } catch (error) {

            console.warn(
                "No se pudieron guardar las opciones:",
                error
            );

        }
    }

    // ==========================================
    // CONTROL GLOBAL DEL SONIDO
    // ==========================================

    function aplicarSonido() {

        if (bgSound) {

            bgSound.volume =
                configuracion.volumen / 100;

            bgSound.muted =
                configuracion.silenciado;

        }

        if (volumeSlider) {
            volumeSlider.value =
                configuracion.volumen;
        }

        if (volumeValue) {
            volumeValue.textContent =
                configuracion.volumen + "%";
        }

        if (muteGameBtn) {

            muteGameBtn.textContent =
                configuracion.silenciado
                    ? "Activar música"
                    : "Silenciar música";

            muteGameBtn.setAttribute(
                "aria-pressed",
                String(configuracion.silenciado)
            );
        }
    }

    function cambiarVolumen(valor) {

        configuracion.volumen = limitar(
            Number(valor),
            0,
            100
        );

        // Al ajustar el volumen se reactiva la música

        configuracion.silenciado = false;

        aplicarSonido();
        guardarConfiguracion();
    }

    // ==========================================
    // ACCESIBILIDAD - TAMAÑO DE FUENTE
    // ==========================================

    function aplicarFuente() {

        const escala = configuracion.fuente / 100;

        document.documentElement.style.setProperty(
            "--game-font-scale",
            String(escala)
        );

        if (fontSlider) {
            fontSlider.value = configuracion.fuente;
        }

        if (fontSizeValue) {
            fontSizeValue.textContent =
                configuracion.fuente + "%";
        }
    }

    function cambiarFuente(valor) {

        configuracion.fuente = limitar(
            Number(valor),
            80,
            140
        );

        aplicarFuente();
        guardarConfiguracion();
    }

    // ==========================================
    // NAVEGACIÓN DEL MENÚ
    // ==========================================

    function mostrarOpciones() {

        if (pauseMainView) {
            pauseMainView.hidden = true;
        }

        if (gameOptionsView) {
            gameOptionsView.hidden = false;
        }
    }

    function volverMenuPausa() {

        if (gameOptionsView) {
            gameOptionsView.hidden = true;
        }

        if (pauseMainView) {
            pauseMainView.hidden = false;
        }
    }

    // Permite restablecer la vista al reabrir
    // el menú de pausa desde cualquier actividad.

    window.restablecerVistaPausa = volverMenuPausa;

    // ==========================================
    // EVENTOS
    // ==========================================

    optionsBtn?.addEventListener(
        "click",
        mostrarOpciones
    );

    backToPauseBtn?.addEventListener(
        "click",
        volverMenuPausa
    );

    volumeSlider?.addEventListener("input", (e) => {
        cambiarVolumen(e.target.value);
    });

    volumeDownBtn?.addEventListener("click", () => {
        cambiarVolumen(configuracion.volumen - 5);
    });

    volumeUpBtn?.addEventListener("click", () => {
        cambiarVolumen(configuracion.volumen + 5);
    });

    muteGameBtn?.addEventListener("click", () => {

        configuracion.silenciado =
            !configuracion.silenciado;

        aplicarSonido();
        guardarConfiguracion();
    });

    fontSlider?.addEventListener("input", (e) => {
        cambiarFuente(e.target.value);
    });

    fontDecreaseBtn?.addEventListener("click", () => {
        cambiarFuente(configuracion.fuente - 10);
    });

    fontIncreaseBtn?.addEventListener("click", () => {
        cambiarFuente(configuracion.fuente + 10);
    });

    resetFontBtn?.addEventListener("click", () => {
        cambiarFuente(100);
    });

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    aplicarSonido();
    aplicarFuente();

})();
