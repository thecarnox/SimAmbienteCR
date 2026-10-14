
/* ==========================================
   SISTEMA GLOBAL DE ALERTAS
   SIMAMBIENTECR
========================================== */

(function () {
    "use strict";

    let modal;
    let titulo;
    let mensaje;
    let botonReintentar;

    let sonidoAlerta = null;
    let elementoAnterior = null;
    let alCerrar = null;

    function inicializarAlertas() {

        modal = document.getElementById("gameAlertModal");
        titulo = document.getElementById("gameAlertTitle");
        mensaje = document.getElementById("gameAlertMessage");

        botonReintentar = document.getElementById(
            "gameAlertRetryBtn"
        );

        if (
            !modal ||
            !titulo ||
            !mensaje ||
            !botonReintentar
        ) {
            console.error(
                "No se encontraron los elementos de alertas."
            );
            return;
        }

        /* Usa el audio existente si está en el HTML */

        sonidoAlerta = document.getElementById(
            "sonidoAlerta"
        );

        botonReintentar.addEventListener(
            "click",
            cerrarAlertaJuego
        );

        document.addEventListener("keydown", function (e) {

            if (modal.hidden) return;

            if (e.key === "Escape") {
                e.preventDefault();
                cerrarAlertaJuego();
            }

            /* Mantener el foco en la ventana */

            if (e.key === "Tab") {
                e.preventDefault();
                botonReintentar.focus();
            }
        });
    }

    function reproducirSonidoAlerta() {

        if (!sonidoAlerta) return;

        sonidoAlerta.pause();
        sonidoAlerta.currentTime = 0;

        const reproduccion = sonidoAlerta.play();

        if (reproduccion?.catch) {
            reproduccion.catch(function (error) {
                console.warn(
                    "No se pudo reproducir sonidoAlerta:",
                    error
                );
            });
        }
    }

    window.mostrarAlertaJuego = function (
        texto,
        opciones = {}
    ) {

        if (!modal) {
            console.warn(
                "Sistema de alertas no inicializado:",
                texto
            );
            return;
        }

    if (modal.hidden) {
        elementoAnterior = document.activeElement;
    }
        titulo.textContent =
            opciones.titulo || "¡Atención!";

        mensaje.textContent = String(texto);

        alCerrar =
            typeof opciones.alCerrar === "function"
                ? opciones.alCerrar
                : null;

        modal.hidden = false;

        botonReintentar.focus();

        reproducirSonidoAlerta();
    };

    function cerrarAlertaJuego() {

        if (!modal || modal.hidden) return;

        modal.hidden = true;

        if (sonidoAlerta) {
            sonidoAlerta.pause();
            sonidoAlerta.currentTime = 0;
        }

        const callback = alCerrar;
        alCerrar = null;

        if (
            elementoAnterior &&
            elementoAnterior.isConnected &&
            typeof elementoAnterior.focus === "function"
        ) {
            elementoAnterior.focus();
        }

        if (callback) {
            callback();
        }
    }

    window.cerrarAlertaJuego = cerrarAlertaJuego;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            inicializarAlertas
        );
    } else {
        inicializarAlertas();
    }

})();
