// ==========================================
// ELEMENTOS HTML
// ==========================================

// CANVAS PRINCIPAL
// ==========================================
const canvas = document.getElementById('application-canvas');

// MENÚ PRINCIPAL
// ==========================================
const fullscreenBtn = document.getElementById('fullscreenBtn');
const mapBtn = document.getElementById('mapBtn');
const menu = document.getElementById('menu');

// MAPA
// ==========================================
const toggleMoveBtn = document.getElementById('toggleMoveBtn');
const mapDiv = document.getElementById('map');
const rightPanel = document.getElementById('rightPanel');

// AUDIO
// ==========================================
const bgSound = document.getElementById('bgSound');

// MENÚ PAUSA
// ==========================================
const pauseMenu = document.getElementById('pauseMenu');
const resumeBtn = document.getElementById('resumeBtn');
const optionsBtn = document.getElementById('optionsBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

// DIÁLOGOS
// ==========================================
const dialogBox = document.getElementById('dialogBox');
const characterName = document.getElementById('characterName');
const dialogText = document.getElementById('dialogText');
const nextDialogBtn = document.getElementById('nextDialogBtn');

// PANTALLA DE CARGA
// ==========================================
const loadingScreen = document.getElementById("loadingScreen");
const loadingMessage = document.getElementById("loadingMessage");
const loadingProgress = document.getElementById("loadingProgress");

// ==========================================
// Jugador Base de datos
// ==========================================
const playerModal = document.getElementById("playerModal");
const playerName = document.getElementById("playerName");
const startPlayerBtn = document.getElementById("startPlayerBtn");
const playerEmail = document.getElementById("playerEmail");
const playerCenter = document.getElementById("playerCenter");


const playerSelection = document.getElementById("playerSelection");

const newPlayerForm = document.getElementById("newPlayerForm");
const existingPlayerForm = document.getElementById("existingPlayerForm");

const newPlayerBtn = document.getElementById("newPlayerBtn");
const existingPlayerBtn = document.getElementById("existingPlayerBtn");

const existingPlayerEmail = document.getElementById("existingPlayerEmail");
const loginPlayerBtn = document.getElementById("loginPlayerBtn");

const backNewPlayerBtn = document.getElementById("backNewPlayerBtn");
const backExistingPlayerBtn = document.getElementById("backExistingPlayerBtn");
const closePlayerModalBtn = document.getElementById("closePlayerModalBtn");

// ==========================================
// MOSTRAR VISTAS DEL MODAL
// ==========================================


function mostrarVistaJugador(vista) {

    if (iniciandoJugador) {
        return;
    }

    playerSelection.style.display =
        vista === "seleccion" ? "block" : "none";

    newPlayerForm.style.display =
        vista === "nuevo" ? "block" : "none";

    existingPlayerForm.style.display =
        vista === "existente" ? "block" : "none";
}


// ==========================================
// SELECCIÓN DEL TIPO DE JUGADOR
// ==========================================

newPlayerBtn.addEventListener("click", () => {
    mostrarVistaJugador("nuevo");
});

existingPlayerBtn.addEventListener("click", () => {
    mostrarVistaJugador("existente");
});

// ==========================================
// VOLVER A LA SELECCIÓN
// ==========================================

backNewPlayerBtn.addEventListener("click", () => {
    mostrarVistaJugador("seleccion");
});

backExistingPlayerBtn.addEventListener("click", () => {
    mostrarVistaJugador("seleccion");
});

// ==========================================
// CANCELAR
// ==========================================

closePlayerModalBtn.addEventListener("click", () => {

    if (iniciandoJugador) {
        return;
    }

    playerModal.style.display = "none";
    mostrarVistaJugador("seleccion");

});


let jugadorID = null;
let jugadorNombre = "";


let progresoJugador = [];

// ==========================================
// CARGAR PROGRESO DEL JUGADOR
// ==========================================

async function cargarProgresoJugador(idJugador) {

    try {
        const respuesta = await fetch(
            `/progreso/jugador/${idJugador}`
        );

        if (!respuesta.ok) {
            throw new Error(
                `Error HTTP ${respuesta.status}`
            );
        }

        const datos = await respuesta.json();

        progresoJugador = Array.isArray(datos.progreso)
            ? datos.progreso
            : [];

        console.log(
            "Progreso recuperado:",
            progresoJugador
        );

        return progresoJugador;

    } catch (error) {

        console.error(
            "Error recuperando el progreso:",
            error
        );

        progresoJugador = [];

        return null;
    }
}



function actividadEstaCompletada(idActividad) {

    return progresoJugador.some(
        progreso =>
            progreso.actividad_id === idActividad &&
            progreso.estado === "completada"
    );

}




// ==========================================
// PLAYCANVAS PRINCIPAL
// ==========================================

const app = new pc.Application(canvas, {

    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});


app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);


// ==========================================
// MENÚ DE PAUSA
// ==========================================

// Abrir menú de pausa
function abrirMenuPausa() {

    if (typeof window.restablecerVistaPausa === "function") {
        window.restablecerVistaPausa();
    }

    pauseMenu.style.display = "flex";

    bgSound.pause();

}


// ==========================================
// OPCIONES DEL VIDEOJUEGO
// ==========================================

// Abrir opciones
optionsBtn.addEventListener("click", () => {

    pauseMainView.hidden = true;
    gameOptionsView.hidden = false;

});

// Regresar al menú de pausa
backToPauseBtn.addEventListener("click", () => {

    gameOptionsView.hidden = true;
    pauseMainView.hidden = false;

});

// Reanudar
resumeBtn.addEventListener("click", () => {

    pauseMenu.style.display = "none";

    if (typeof window.restablecerVistaPausa === "function") {
        window.restablecerVistaPausa();
    }

    bgSound.play().catch(error => {
        console.warn("No se pudo reanudar la música:", error);
    });

    if (typeof actividadLimonPausada !== "undefined") {
        actividadLimonPausada = false;
    }

});


// Menú principal
mainMenuBtn.addEventListener(
    'click',
    () => {

        location.reload();

    }
);


 // ==========================================
 // BOTÓN MODO MAPA
 // ==========================================

mapBtn.addEventListener("click", () => {
    mostrarVistaJugador("seleccion");
    playerModal.style.display = "flex";
});


async function iniciarSesionJugador(datos) {

    if (
        !Number.isSafeInteger(datos.id) ||
        datos.id <= 0
    ) {
        throw new Error("ID de jugador inválido.");
    }

    // Identificación del jugador
    jugadorID = datos.id;
    jugadorNombre = datos.nombre;

    // Recuperar progreso
    const progreso = await cargarProgresoJugador(jugadorID);

    if (progreso === null) {
        throw new Error(
            "No se pudo recuperar el progreso del jugador."
        );
    }

    // Guardar sesión después de validar
    sessionStorage.setItem(
        "jugadorId",
        String(jugadorID)
    );

    console.log("Jugador activo:", jugadorID);
    console.log("Nombre:", jugadorNombre);
    console.log("Progreso:", progreso);

    // Pantalla de carga
    await mostrarPantallaCarga(datos.existe);

    playerModal.style.display = "none";

    // Música
    bgSound.volume = 0.5;

    bgSound.play().catch(error => {
        console.warn(
            "No se pudo reproducir la música:",
            error
        );
    });

    // Ocultar menú principal
    menu.style.display = "none";

    // Iniciar diálogos
    currentDialog = 0;
    mostrarDialogo(currentDialog);

    // Abrir escenario principal
    abrirEscenarioPrincipal();

    setTimeout(() => {
        if (
            typeof mapInstance !== "undefined" &&
            mapInstance
        ) {
            mapInstance.invalidateSize();
        }
    }, 100);
}


// ==========================================
// REGISTRO E INICIO DEL JUGADOR
// ==========================================


let iniciandoJugador = false;

startPlayerBtn.addEventListener("click", async () => {

    if (iniciandoJugador) return;

    const nombre = playerName.value.trim();
    const correo = playerEmail.value.trim();
    const centroUniversitario = playerCenter.value;

    if (!nombre || !correo || !centroUniversitario) {
        mostrarAlertaJuego(
            "Debes completar el nombre, correo electrónico y centro universitario antes de continuar."
        );
        return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        mostrarAlertaJuego(
            "El correo electrónico ingresado no tiene un formato válido. Ejemplo: estudiante@correo.com."
        );
        return;
    }

    iniciandoJugador = true;
    startPlayerBtn.disabled = true;
    loginPlayerBtn.disabled = true;

    try {

        const respuesta = await fetch("/players/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                centro_universitario: centroUniversitario
            })
        });

        const datos = await respuesta.json();

    if (!respuesta.ok) {
        mostrarAlertaJuego(
            datos.mensaje ||
            "No fue posible registrar al jugador. Inténtalo nuevamente."
        );
        return;
    }

        await iniciarSesionJugador(datos);

    } catch (error) {

        console.error("Error registrando jugador:", error);

        mostrarAlertaJuego(
            "No fue posible completar el registro o iniciar la partida. Inténtalo nuevamente."
        );

    } finally {

        iniciandoJugador = false;
        startPlayerBtn.disabled = false;
        loginPlayerBtn.disabled = false;

    }
});



loginPlayerBtn.addEventListener("click", async () => {

    if (iniciandoJugador) return;

    const correo = existingPlayerEmail.value.trim();

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        mostrarAlertaJuego(
            "Debes ingresar un correo electrónico válido para acceder a tu partida."
        );
        return;
    }

    iniciandoJugador = true;
    loginPlayerBtn.disabled = true;
    startPlayerBtn.disabled = true;

    try {

        const respuesta = await fetch("/players/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo
            })
        });

        const datos = await respuesta.json();

    if (!respuesta.ok) {
        mostrarAlertaJuego(
            datos.mensaje ||
            "No fue posible encontrar al jugador. Verifica el correo electrónico."
        );
        return;
    }

        await iniciarSesionJugador(datos);

    } catch (error) {

        console.error("Error accediendo al jugador:", error);

        mostrarAlertaJuego(
            "No fue posible recuperar la información del jugador. Inténtalo nuevamente."
        );

    } finally {

        iniciandoJugador = false;
        loginPlayerBtn.disabled = false;
        startPlayerBtn.disabled = false;

    }
});



// ==========================================
// PANTALLA COMPLETA
// ==========================================
fullscreenBtn.addEventListener('click', () => {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});



/* ==========================================
   PANTALLA DE CARGA - SIMAMBIENTECR
   DURACIÓN: 2.75 SEGUNDOS
========================================== */

async function mostrarPantallaCarga(esJugadorExistente) {

    playerModal.style.display = "none";

    loadingScreen.style.display = "flex";

    const loadingPercentage =
        document.getElementById("loadingPercentage");

    const loadingBar =
        document.getElementById("loadingBar");

    // Mensaje personalizado según el jugador

    if (esJugadorExistente) {

        loadingMessage.textContent =
            `Bienvenido nuevamente, ${jugadorNombre}. ` +
            "Estamos preparando tu aventura ambiental...";

    } else {

        loadingMessage.textContent =
            `Bienvenido, ${jugadorNombre}. ` +
            "Preparando tu primera aventura...";

    }

    // Reiniciar progreso

    loadingProgress.style.width = "0%";

    if (loadingPercentage) {
        loadingPercentage.textContent = "0%";
    }

    if (loadingBar) {
        loadingBar.setAttribute("aria-valuenow", "0");
    }

    let progreso = 0;

    return new Promise(resolve => {

        const intervalo = setInterval(() => {

            // Incremento del progreso

            progreso = Math.min(progreso + 2, 100);

            loadingProgress.style.width =
                progreso + "%";

            if (loadingPercentage) {
                loadingPercentage.textContent =
                    progreso + "%";
            }

            if (loadingBar) {
                loadingBar.setAttribute(
                    "aria-valuenow",
                    String(progreso)
                );
            }

            // Finalizar carga

            if (progreso >= 100) {

                clearInterval(intervalo);

                setTimeout(() => {

                    loadingScreen.style.display = "none";

                    resolve();

                }, 250);

            }

        }, 50);

    });

}



/* ==========================================
   ANIMACIÓN DEL TÍTULO 3D
   PANTALLA DE CARGA
========================================== */

let loadingTitleAnimation = null;

function iniciarAnimacionTituloCarga() {

    detenerAnimacionTituloCarga();

    const titulo = document.getElementById(
        "loadingMovingTitle"
    );

    const pantalla = document.getElementById(
        "loadingScreen"
    );

    if (!titulo || !pantalla) {
        return;
    }

    let x = 20;
    let y = 20;

    // Velocidad en píxeles por segundo

    let velocidadX = 850;
    let velocidadY = 620;

    let tiempoAnterior = performance.now();

    function animar(tiempoActual) {

        const delta = Math.min(
            (tiempoActual - tiempoAnterior) / 1000,
            0.05
        );

        tiempoAnterior = tiempoActual;

        const anchoMaximo = Math.max(
            0,
            pantalla.clientWidth - titulo.offsetWidth
        );

        const altoMaximo = Math.max(
            0,
            pantalla.clientHeight - titulo.offsetHeight
        );

        x += velocidadX * delta;
        y += velocidadY * delta;

        // Rebote horizontal

        if (x >= anchoMaximo) {
            x = anchoMaximo;
            velocidadX = -Math.abs(velocidadX);
        } else if (x <= 0) {
            x = 0;
            velocidadX = Math.abs(velocidadX);
        }

        // Rebote vertical

        if (y >= altoMaximo) {
            y = altoMaximo;
            velocidadY = -Math.abs(velocidadY);
        } else if (y <= 0) {
            y = 0;
            velocidadY = Math.abs(velocidadY);
        }

        titulo.style.transform =
            `translate3d(${x}px, ${y}px, 0)`;

        loadingTitleAnimation =
            requestAnimationFrame(animar);
    }

    loadingTitleAnimation =
        requestAnimationFrame(animar);
}

function detenerAnimacionTituloCarga() {

    if (loadingTitleAnimation !== null) {

        cancelAnimationFrame(loadingTitleAnimation);

        loadingTitleAnimation = null;
    }
}



window.addEventListener("resize", () => {

    if (
        typeof characterApp !== "undefined" &&
        characterApp
    ) {
        characterApp.resizeCanvas();
    }

});



// ==========================================
// SIMAMBIENTECR - RESULTADO FINAL
// ==========================================

let resultadoFinalConsultando = false;
let resultadoFinalMostradoEnSesion = false;

const ventanaResultadoFinal =
    document.getElementById("ventanaResultadoFinal");

const escenarioResultadoFinal = canvas;


// ==========================================
// VERIFICAR ESCENARIO PRINCIPAL
// ==========================================

// ==========================================
// VERIFICAR ESCENARIO PRINCIPAL
// ==========================================

function jugadorEnEscenarioPrincipal() {

    if (!escenarioResultadoFinal || !menu) {
        return false;
    }

    const canvasVisible =
        getComputedStyle(escenarioResultadoFinal).display !== "none" &&
        getComputedStyle(escenarioResultadoFinal).visibility !== "hidden" &&
        escenarioResultadoFinal.getClientRects().length > 0;

    const menuOculto =
        getComputedStyle(menu).display === "none";

    const mapaOculto =
        !mapDiv ||
        getComputedStyle(mapDiv).display === "none";

    const panelOculto =
        !rightPanel ||
        getComputedStyle(rightPanel).display === "none";

    const pausaOculta =
        !pauseMenu ||
        getComputedStyle(pauseMenu).display === "none";

    return (
        canvasVisible &&
        menuOculto &&
        mapaOculto &&
        panelOculto &&
        pausaOculta
    );
}


// ==========================================
// RETROALIMENTACIÓN SEGÚN PUNTUACIÓN
// ==========================================

function obtenerRetroalimentacionFinal(categoria) {

    switch (categoria) {

        case "BUENO":
            return (
                "¡Excelente trabajo! Has demostrado un gran " +
                "conocimiento sobre la conservación ambiental " +
                "y la importancia de proteger los recursos " +
                "naturales de Costa Rica."
            );

        case "MEDIO":
            return (
                "¡Buen esfuerzo! Has completado todas las " +
                "actividades y adquirido conocimientos " +
                "importantes sobre el ambiente. Puedes " +
                "volver a explorar las actividades para " +
                "fortalecer tu aprendizaje."
            );

        default:
            return (
                "¡Felicidades por completar la experiencia! " +
                "Todavía existen aspectos ambientales que " +
                "puedes reforzar. Te invitamos a repetir " +
                "las actividades para mejorar tus conocimientos."
            );
    }
}


// ==========================================
// CONSULTAR Y MOSTRAR RESULTADO FINAL
// ==========================================

async function verificarResultadoFinal() {

    if (
        resultadoFinalConsultando ||
        resultadoFinalMostradoEnSesion ||
        !jugadorEnEscenarioPrincipal()
    ) {
        return;
    }

    const idJugador = Number(
        sessionStorage.getItem("jugadorId")
    );

    if (!Number.isSafeInteger(idJugador) || idJugador <= 0) {
        return;
    }

    resultadoFinalConsultando = true;

    try {

        const respuesta = await fetch(
            `/progreso/resultado-final/${idJugador}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el resultado final.");
        }

        const datos = await respuesta.json();

        if (!datos.disponible) {
            return;
        }

        // Volver a comprobar la escena después del fetch.
        if (
            !jugadorEnEscenarioPrincipal() ||
            resultadoFinalMostradoEnSesion
        ) {
            return;
        }

        // Registrar en SQLite antes de presentar la ventana.
        // Si ya fue registrada, el servidor rechazará
        // una segunda visualización.

        const registro = await fetch(
            "/progreso/resultado-final/mostrar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    jugador_id: idJugador
                })
            }
        );

        if (!registro.ok) {
            if (registro.status !== 409) {
                console.error(
                    "No se pudo registrar la visualización final."
                );
            }
            return;
        }

        resultadoFinalMostradoEnSesion = true;

        document.getElementById(
            "resultadoPuntosLimon"
        ).textContent = `${datos.puntos.limon} / 20`;

        document.getElementById(
            "resultadoPuntosGuanacaste"
        ).textContent = `${datos.puntos.guanacaste} / 20`;

        document.getElementById(
            "resultadoPuntosSanJose"
        ).textContent = `${datos.puntos.sanJose} / 10`;

        document.getElementById(
            "resultadoPuntosTotales"
        ).textContent = `${datos.puntos.total} / 50`;

        document.getElementById(
            "resultadoCategoriaFinal"
        ).textContent = `RESULTADO FINAL: ${datos.categoria}`;

        document.getElementById(
            "resultadoRetroalimentacion"
        ).textContent =
            obtenerRetroalimentacionFinal(datos.categoria);

        ventanaResultadoFinal.hidden = false;

    } catch (error) {

        console.error(
            "Error verificando el resultado final:",
            error
        );

    } finally {

        resultadoFinalConsultando = false;

    }
}


// ==========================================
// BOTÓN QUITAR
// ==========================================

document.getElementById(
    "quitarResultadoFinal"
)?.addEventListener("click", () => {

    ventanaResultadoFinal.hidden = true;

});


// ==========================================
// BOTÓN MENÚ PRINCIPAL
// ==========================================

document.getElementById(
    "menuPrincipalResultadoFinal"
)?.addEventListener("click", () => {

    ventanaResultadoFinal.hidden = true;

    // Mantener el mismo comportamiento
    // del menú principal existente.
    location.reload();

});


// ==========================================
// DISPONIBILIDAD PARA OTRAS ACTIVIDADES
// ==========================================

window.verificarResultadoFinal = verificarResultadoFinal;