
// ==========================================
// ACTIVIDAD 3 - SAN JOSÉ
// VALIDACIÓN DE DESBLOQUEO
// ==========================================


// ==========================================
// DIÁLOGOS DE SAN JOSÉ - MANATÍ
// ==========================================

let dialogosSanJoseActivos = false;
let dialogoSanJoseActual = 0;




 // ==========================================
 // SONIDOS DE RESPUESTAS - SAN JOSÉ
 // ==========================================

const retroBuenoSanJose = new Audio("sounds/retroBueno.mp3");
const retroMaloSanJose = new Audio("sounds/retroMalo.mp3");

retroBuenoSanJose.volume = 0.7;
retroMaloSanJose.volume = 0.7;

retroBuenoSanJose.preload = "auto";
retroMaloSanJose.preload = "auto";

// Reproducir sonido según la respuesta
function reproducirSonidoRespuestaSanJose(esCorrecta) {

    const sonidoActual = esCorrecta
        ? retroBuenoSanJose
        : retroMaloSanJose;

    // Detener ambos para evitar superposiciones
    retroBuenoSanJose.pause();
    retroMaloSanJose.pause();

    retroBuenoSanJose.currentTime = 0;
    retroMaloSanJose.currentTime = 0;

    sonidoActual.play().catch(error => {
        console.warn(
            "No se pudo reproducir el sonido de San José:",
            error
        );
    });
}


// ==========================================
// DETENER SONIDOS DE SAN JOSÉ
// ==========================================

function detenerSonidosSanJose() {

    retroBuenoSanJose.pause();
    retroMaloSanJose.pause();

    retroBuenoSanJose.currentTime = 0;
    retroMaloSanJose.currentTime = 0;
}



const dialogosSanJose = [

    {
        nombre: "Manatí - Guía Ambiental",
        texto:
            "¡Bienvenido a San José! Soy tu guía ambiental. " +
            "Te explicaré cómo realizar esta actividad."
    },

    {
        nombre: "Manatí - Guía Ambiental",
        texto:
            "Conocerás cinco casos sobre la conservación " +
            "y degradación del suelo en diferentes regiones " +
            "de Costa Rica."
    },

    {
        nombre: "Manatí - Guía Ambiental",
        texto:
            "Lee cada caso y selecciona la respuesta correcta " +
            "entre las tres opciones disponibles."
    },

    {
        nombre: "Manatí - Guía Ambiental",
        texto:
            "Cada respuesta correcta vale 2 puntos. " +
            "Después de responder, conocerás la explicación " +
            "y podrás observar el lugar en el mapa."
    },

    {
        nombre: "Manatí - Guía Ambiental",
        texto:
            "Necesitas al menos 8 puntos para completar " +
            "la actividad. Si consigues los 10 puntos, " +
            "obtendrás la calificación BUENO. ¡Mucha suerte!"
    }

];


// ==========================================
// INICIAR DIÁLOGOS DE SAN JOSÉ
// ==========================================

function iniciarDialogosSanJose() {

    dialogosSanJoseActivos = true;
    dialogoSanJoseActual = 0;

    // Cargar el manatí 3D
    crearPersonaje3D("models/manati.glb");

    mostrarDialogoSanJose();
}


// ==========================================
// MOSTRAR DIÁLOGO ACTUAL
// ==========================================

function mostrarDialogoSanJose() {

    const dialogo =
        dialogosSanJose[dialogoSanJoseActual];

    if (!dialogo) {
        return;
    }

    characterName.textContent = dialogo.nombre;
    dialogText.textContent = dialogo.texto;

    dialogBox.style.display = "flex";

    nextDialogBtn.textContent =
        dialogoSanJoseActual === dialogosSanJose.length - 1
            ? "Comenzar"
            : "Continuar ►";
}


// ==========================================
// FINALIZAR DIÁLOGOS DE SAN JOSÉ
// ==========================================

function finalizarDialogosSanJose() {

    dialogosSanJoseActivos = false;
    dialogoSanJoseActual = 0;

    dialogBox.style.display = "none";

    nextDialogBtn.textContent = "Continuar ►";

    // Comenzar las preguntas
    mostrarPreguntaSanJose();

    console.log(
        "Instrucciones de San José finalizadas."
    );
}


async function iniciarActividadSanJose() {

    detenerSonidosSanJose();

    // ======================================
    // IDENTIFICAR AL JUGADOR
    // ======================================

    const jugadorId = Number(
        sessionStorage.getItem("jugadorId")
    );

    if (
        !Number.isSafeInteger(jugadorId) ||
        jugadorId <= 0
    ) {
        window.mostrarAlertaJuego(
            "No se pudo identificar al jugador. " +
            "Inicia sesión nuevamente.",
            {
                titulo: "Jugador no identificado"
            }
        );
        return false;
    }

    // ======================================
    // CONSULTAR PROGRESO DEL JUGADOR
    // ======================================

    try {

        const respuesta = await fetch(
            `/progreso/jugador/${jugadorId}`,
            { cache: "no-store" }
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo consultar el progreso del jugador."
            );
        }

        const datos = await respuesta.json();

        // ==================================
        // VALIDAR ESTADO DE GUANACASTE
        // ==================================

        const sanJoseDesbloqueada =
            datos.desbloqueos?.sanjose === true;

       
        if (!sanJoseDesbloqueada) {

            window.mostrarAlertaJuego(
                "Debes completar primero la actividad de Guanacaste " +
                "para poder acceder a San José.",
                {
                    titulo: "San José bloqueada"
                }
            );

            console.log(
                "San José bloqueada: Guanacaste no completada."
            );

            return false;
        }


        // ==================================
        // ACCESO AUTORIZADO
        // ==================================

        console.log(
            "Guanacaste completada. Acceso autorizado a San José."
        );

        const mapa = document.getElementById("map");
        const panel = document.getElementById("rightPanel");

        // Mostrar mapa
        if (mapa) {
            mapa.style.display = "block";
        }

        // Mostrar panel derecho
        if (panel) {
            panel.style.display = "flex";
        }

        // Inicializar Leaflet
        inicializarMapa();

        // Corregir tamaño del mapa
        setTimeout(() => {

            if (
                typeof mapInstance !== "undefined" &&
                mapInstance
            ) {
                mapInstance.invalidateSize();
            }

        }, 100);

        // ==========================================
        // INICIAR PREGUNTAS DE SAN JOSÉ
        // ==========================================

        indicePreguntaSanJose = 0;
        puntosSanJose = 0;
        respuestaSeleccionadaSanJose = false;

        // Mostrar instrucciones con el manatí
        iniciarDialogosSanJose();

        return true;

        } catch (error) {

            console.error(
                "Error verificando acceso a San José:",
                error
            );

            window.mostrarAlertaJuego(
                "No se pudo verificar el acceso a San José. " +
                "Inténtalo nuevamente.",
                {
                    titulo: "Error de conexión"
                }
            );

            return false;
        }
    }

// ==========================================
// ACTIVIDAD 3 - SAN JOSÉ
// CASOS DE CONSERVACIÓN Y DEGRADACIÓN DEL SUELO
// ==========================================

const preguntasSanJose = [

    // ======================================
    // CASO 1 - REGIÓN CHOROTEGA
    // ======================================

    {
        titulo: "Caso 1. Región Chorotega: conservación y recuperación del suelo",

        descripcion:
            "En una comunidad cercana a un área protegida de la provincia de Guanacaste " +
            "se desarrollan actividades de restauración de bosque tropical seco. " +
            "Las personas productoras reducen las quemas, mantienen cobertura vegetal " +
            "sobre el suelo y establecen barreras naturales para disminuir la erosión " +
            "provocada por las lluvias intensas después de la época seca. " +
            "Estas acciones permiten conservar nutrientes, reducir la pérdida de suelo " +
            "y favorecer la recuperación de los ecosistemas.",

        pregunta:
            "¿Cuál de las siguientes áreas protegidas se encuentra asociada con esta región?",

        opciones: [
            "Parque Nacional Guanacaste",
            "Refugio Nacional de Vida Silvestre Maquenque",
            "Reserva Forestal Los Santos"
        ],

        correcta: 0,
        tipo: "Positivo",
        
        ubicacion: {
            latitud: 10.957708,
            longitud: -85.514488,
            nombre: "Parque Nacional Guanacaste"
        },
        explicacion:
            "El Parque Nacional Guanacaste se encuentra en la Región Chorotega. " +
            "La conservación de la cobertura vegetal y la recuperación del bosque " +
            "favorecen la protección del suelo frente a la erosión."
    },

    // ======================================
    // CASO 2 - REGIÓN HUETAR NORTE
    // ======================================

    {
        titulo: "Caso 2. Región Huetar Norte: protección del suelo y biodiversidad",

        descripcion:
            "En una zona de tierras bajas y alta precipitación se implementan " +
            "prácticas de conservación que incluyen mantener árboles nativos, " +
            "evitar la eliminación de la cobertura vegetal y proteger sectores " +
            "cercanos a humedales. Estas medidas ayudan a disminuir la erosión, " +
            "conservar la humedad del suelo y mantener corredores naturales " +
            "para diferentes especies de fauna.",

        pregunta:
            "¿Cuál de las siguientes áreas protegidas corresponde a esta región del país?",

        opciones: [
            "Parque Nacional Santa Rosa",
            "Refugio Nacional de Vida Silvestre Maquenque",
            "Reserva Forestal Los Santos"
        ],

        correcta: 1,
        tipo: "Positivo",

        ubicacion: {
            latitud: 10.675453,
            longitud: -84.131241,
            nombre: "Refugio Nacional de Vida Silvestre Maquenque"
        },
        explicacion:
            "El Refugio Nacional de Vida Silvestre Maquenque se encuentra en " +
            "la Región Huetar Norte. La conservación de la vegetación y los " +
            "humedales ayuda a proteger los suelos, mantener su humedad y " +
            "preservar los hábitats naturales."    
    },

    // ======================================
    // CASO 3 - REGIÓN DE LOS SANTOS
    // ======================================

    {
        titulo: "Caso 3. Región de Los Santos: conservación forestal y protección del suelo",

        descripcion:
            "En una región montañosa se promueve la conservación de los bosques " +
            "y la recuperación de áreas degradadas. La vegetación ayuda a disminuir " +
            "la escorrentía superficial durante las lluvias, evita el desprendimiento " +
            "de partículas del suelo y favorece la infiltración del agua. " +
            "De esta manera, la protección de los bosques contribuye simultáneamente " +
            "a conservar los suelos y las fuentes de agua.",

        pregunta:
            "¿Cuál de las siguientes áreas corresponde al territorio descrito?",

        opciones: [
            "Refugio Nacional de Vida Silvestre Gandoca-Manzanillo",
            "Parque Nacional Cahuita",
            "Reserva Forestal Los Santos"
        ],

        correcta: 2,
        tipo: "Positivo",

        ubicacion: {
            latitud: 9.580777,
            longitud: -83.920097,
            nombre: "Reserva Forestal Los Santos"
        },
        explicacion:
            "La Reserva Forestal Los Santos corresponde a una región montañosa " +
            "donde la cobertura forestal contribuye a reducir la escorrentía, " +
            "proteger el suelo y favorecer la infiltración del agua."
    },

    // ======================================
    // CASO 4 - REGIÓN CARIBE
    // ======================================

    {
        titulo: "Caso 4. Región Caribe: pérdida de cobertura vegetal y erosión",

        descripcion:
            "En una zona del Caribe se elimina parte de la cobertura vegetal " +
            "para ampliar áreas destinadas a actividades productivas. " +
            "Posteriormente, las lluvias provocan un aumento de la escorrentía " +
            "superficial y arrastran partículas del suelo hacia los cuerpos de agua. " +
            "La pérdida de vegetación también disminuye la capacidad del suelo " +
            "para retener humedad y aumenta su vulnerabilidad a la erosión.",

        pregunta:
            "¿Cuál de las siguientes áreas protegidas está ubicada en el Caribe " +
            "y se relaciona con este contexto?",

        opciones: [
            "Refugio Nacional de Vida Silvestre Gandoca-Manzanillo",
            "Parque Nacional Rincón de la Vieja",
            "Reserva Forestal Los Santos"
        ],

        correcta: 0,
        tipo: "Negativo",

       ubicacion: {
            latitud: 9.616660,
            longitud: -82.641392,
            nombre: "Refugio Nacional de Vida Silvestre Gandoca-Manzanillo"
        },
        explicacion:
            "El Refugio Nacional de Vida Silvestre Gandoca-Manzanillo se " +
            "encuentra en el Caribe de Costa Rica. La pérdida de cobertura " +
            "vegetal puede incrementar la erosión y el transporte de sedimentos " +
            "hacia los cuerpos de agua."
    },

    // ======================================
    // CASO 5 - REGIÓN CARIBE
    // ======================================

    {
        titulo: "Caso 5. Región Caribe: compactación y degradación del suelo",

        descripcion:
            "En una zona cercana a un área protegida se incrementa el tránsito " +
            "de maquinaria pesada sobre terrenos húmedos. El peso de la maquinaria " +
            "comprime los espacios existentes entre las partículas del suelo, " +
            "disminuyendo su porosidad y capacidad de infiltración. " +
            "Durante las lluvias, aumenta la escorrentía superficial " +
            "y se incrementa el riesgo de erosión.",

        pregunta:
            "¿Cuál de las siguientes áreas protegidas se encuentra en una región " +
            "donde este tipo de problemática puede ser utilizada para analizar " +
            "la relación entre suelo, agua y conservación?",

        opciones: [
            "Parque Nacional Santa Rosa",
            "Reserva Forestal Río Pacuare",
            "Parque Nacional Corcovado"
        ],

        correcta: 1,
        tipo: "Negativo",

        ubicacion: {
            latitud: 10.185187,
            longitud: -83.249760,
            nombre: "Reserva Forestal Río Pacuare"
        },
        
        explicacion:
            "La Reserva Forestal Río Pacuare se utiliza como referencia para " +
            "analizar los efectos de la compactación del suelo. El tránsito " +
            "de maquinaria pesada sobre terrenos húmedos puede disminuir " +
            "la infiltración y aumentar la escorrentía superficial."
    }

];


// ==========================================
// ESTADO DE LA ACTIVIDAD
// ==========================================

let indicePreguntaSanJose = 0;
let puntosSanJose = 0;
let respuestaSeleccionadaSanJose = false;


// ==========================================
// MOSTRAR PREGUNTA ACTUAL
// ==========================================

function mostrarPreguntaSanJose() {

    const preguntaActual =
        preguntasSanJose[indicePreguntaSanJose];

    if (!preguntaActual) {
        return;
    }

    const tituloPregunta =
        document.getElementById("preguntaSanJose");

    const contenedorOpciones =
        document.getElementById("opcionesSanJose");

    const contador =
        document.getElementById("contadorPreguntasSanJose");

    const puntuacion =
        document.getElementById("puntuacionSanJose");

    const retroalimentacion =
        document.getElementById("retroalimentacionSanJose");

    const botonSiguiente =
        document.getElementById("siguientePreguntaSanJose");

    if (
        !tituloPregunta ||
        !contenedorOpciones ||
        !contador ||
        !puntuacion ||
        !retroalimentacion ||
        !botonSiguiente
    ) {
        console.error(
            "Faltan elementos HTML de la actividad San José."
        );
        return;
    }

    respuestaSeleccionadaSanJose = false;

    tituloPregunta.textContent =
    preguntaActual.titulo + "\n\n" +
    preguntaActual.descripcion + "\n\n" +
    preguntaActual.pregunta;

    contador.textContent =
        `Pregunta ${indicePreguntaSanJose + 1} de ${preguntasSanJose.length}`;

    puntuacion.textContent =
        `Puntos: ${puntosSanJose} / 10`;

    retroalimentacion.textContent = "";

    botonSiguiente.classList.add("pantalla-oculta");

    contenedorOpciones.replaceChildren();

    preguntaActual.opciones.forEach((opcion, indice) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = opcion;
        boton.classList.add("opcionSanJose");

        boton.addEventListener("click", () => {
            seleccionarRespuestaSanJose(indice);
        });

        contenedorOpciones.appendChild(boton);
    });
}


// ==========================================
// VALIDAR RESPUESTA
// ==========================================

function seleccionarRespuestaSanJose(indiceSeleccionado) {

     if (
        dialogosSanJoseActivos ||
        respuestaSeleccionadaSanJose
    ) {
        return;
    }

    respuestaSeleccionadaSanJose = true;

    const preguntaActual =
        preguntasSanJose[indicePreguntaSanJose];

    const retroalimentacion =
        document.getElementById("retroalimentacionSanJose");

    const puntuacion =
        document.getElementById("puntuacionSanJose");

    const botonSiguiente =
        document.getElementById("siguientePreguntaSanJose");

    const botones =
        document.querySelectorAll("#opcionesSanJose button");

    // ==========================================
    // VALIDAR RESPUESTA Y MOSTRAR EXPLICACIÓN
    // ==========================================

    const respuestaCorrecta =
        indiceSeleccionado === preguntaActual.correcta;
        reproducirSonidoRespuestaSanJose(respuestaCorrecta);

    if (respuestaCorrecta) {

        puntosSanJose += 2;

        retroalimentacion.textContent =
            "✅ ¡Respuesta correcta! Has obtenido 2 puntos.\n\n" +
            preguntaActual.explicacion;

    } else {

        const opcionCorrecta =
            preguntaActual.opciones[preguntaActual.correcta];

        retroalimentacion.textContent =
            "❌ Respuesta incorrecta. No obtienes puntos.\n\n" +
            "La respuesta correcta es: " + opcionCorrecta + ".\n\n" +
            preguntaActual.explicacion;
    }

    puntuacion.textContent =
        `Puntos: ${puntosSanJose} / 10`;

    // ==========================================
    // DESHABILITAR RESPUESTAS
    // ==========================================

    botones.forEach(boton => {
        boton.disabled = true;
    });


    // ==========================================
    // MOSTRAR UBICACIÓN CORRECTA EN EL MAPA
    // ==========================================

    if (
        preguntaActual.ubicacion &&
        typeof mostrarUbicacionSanJose === "function"
    ) {

        mostrarUbicacionSanJose(
            preguntaActual.ubicacion.latitud,
            preguntaActual.ubicacion.longitud,
            preguntaActual.ubicacion.nombre
        );

    }

    // ==========================================
    // MOSTRAR SIGUIENTE SOLO SI QUEDAN PREGUNTAS
    // ==========================================

    if (indicePreguntaSanJose < preguntasSanJose.length - 1) {

        // Preguntas 1, 2, 3 y 4
        botonSiguiente.classList.remove("pantalla-oculta");

    } else {

        // Pregunta 5: no hay más preguntas
        botonSiguiente.classList.add("pantalla-oculta");

        // Finalizar automáticamente la actividad
        finalizarActividadSanJose();

    }    
}


// ==========================================
// SIGUIENTE PREGUNTA
// ==========================================

function avanzarPreguntaSanJose() {

    if (
        dialogosSanJoseActivos ||
        !respuestaSeleccionadaSanJose
    ) {
        return;
    }

    indicePreguntaSanJose++;

    if (indicePreguntaSanJose < preguntasSanJose.length) {

        mostrarPreguntaSanJose();

    } else {

        finalizarActividadSanJose();
    }
}


// ==========================================
// RESULTADO FINAL
// ==========================================

// ==========================================
// RESULTADO FINAL - SAN JOSÉ
// ==========================================

async function finalizarActividadSanJose() {

    let calificacion = "MALO";
    let mensaje = "";

    if (puntosSanJose === 10) {

        calificacion = "BUENO";

        mensaje =
            "¡Excelente trabajo! Respondiste correctamente " +
            "las cinco preguntas y demostraste tus conocimientos " +
            "sobre la conservación ambiental de Costa Rica.";

    } else if (puntosSanJose === 8) {

        calificacion = "MEDIO";

        mensaje =
            "¡Buen trabajo! Solo tuviste una respuesta incorrecta. " +
            "Has completado satisfactoriamente la actividad.";

    } else {

        mensaje =
            "Necesitas reforzar tus conocimientos sobre la " +
            "conservación y degradación del suelo. " +
            "Puedes repetir la actividad para mejorar tu resultado.";
    }

    const titulo =
        document.getElementById("preguntaSanJose");

    const opciones =
        document.getElementById("opcionesSanJose");

    const contador =
        document.getElementById("contadorPreguntasSanJose");

    const puntuacion =
        document.getElementById("puntuacionSanJose");

    const retroalimentacion =
        document.getElementById("retroalimentacionSanJose");

    const botonSiguiente =
        document.getElementById("siguientePreguntaSanJose");

    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    titulo.textContent = "Actividad finalizada";

    opciones.replaceChildren();

    contador.textContent =
        "Has respondido las 5 preguntas.";

    puntuacion.textContent =
        `Puntos: ${puntosSanJose} / 10`;

    retroalimentacion.textContent =
        `Resultado: ${calificacion}\n\n${mensaje}\n\n` +
        "Guardando progreso...";

    botonSiguiente.classList.add("pantalla-oculta");

    // ======================================
    // GUARDAR RESULTADO
    // ======================================

    const guardado = await guardarProgresoSanJose();

    retroalimentacion.textContent =
        `Resultado: ${calificacion}\n\n${mensaje}\n\n` +
        (guardado
            ? "✅ Resultado registrado correctamente."
            : "⚠️ No se pudo guardar el progreso.");

    // ==========================================
    // BOTÓN SEGÚN RESULTADO - SAN JOSÉ
    // ==========================================

    const botonResultado =
        document.createElement("button");

    botonResultado.type = "button";
    botonResultado.id = "reintentarSanJose";

    if (calificacion === "BUENO") {

        // ======================================
        // REGRESAR AL ESCENARIO PRINCIPAL
        // ======================================

        botonResultado.textContent =
            "🏠 Volver al escenario principal";

        botonResultado.addEventListener("click", () => {

            volverEscenarioPrincipalSanJose();

        });

    } else {

            // ======================================
            // RESULTADO MEDIO O MALO
            // ======================================

            botonResultado.textContent =
                "Reintentar actividad";

            
            botonResultado.addEventListener("click", () => {

                detenerSonidosSanJose();

                indicePreguntaSanJose = 0;
                puntosSanJose = 0;
                respuestaSeleccionadaSanJose = false;

                mostrarPreguntaSanJose();

            });

        }

        opciones.appendChild(botonResultado);

        console.log("Resultado final de San José:", {
            puntos: puntosSanJose,
            calificacion,
            guardado
        });
    }


// ==========================================
// CONFIGURAR BOTÓN SIGUIENTE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const botonSiguiente =
        document.getElementById("siguientePreguntaSanJose");

    if (botonSiguiente) {

        botonSiguiente.addEventListener(
            "click",
            avanzarPreguntaSanJose
        );
    }
});

// ==========================================
// GUARDAR PROGRESO DE SAN JOSÉ
// ACTIVIDAD ID: 3
// ==========================================

async function guardarProgresoSanJose() {

    const jugadorId = Number(
        sessionStorage.getItem("jugadorId")
    );

    // ======================================
    // VALIDAR JUGADOR
    // ======================================

    if (
        !Number.isSafeInteger(jugadorId) ||
        jugadorId <= 0
    ) {
        console.error(
            "No se pudo guardar San José: jugador no identificado."
        );

        return false;
    }

    // ==========================================
    // DETERMINAR ESTADO SEGÚN PUNTUACIÓN
    // ==========================================

    const estadoSanJose =
        puntosSanJose >= 8
            ? "completada"
            : "pendiente";

    // ==========================================
    // PREPARAR RESULTADO
    // ==========================================

    const datos = {
        jugador_id: jugadorId,
        actividad_id: 3,
        puntos: puntosSanJose,
        estado: estadoSanJose,
        actividad_finalizada: true
    };

    // ======================================
    // ENVIAR RESULTADO AL SERVIDOR
    // ======================================

    try {

        const respuesta = await fetch("/progreso/guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                `Error HTTP ${respuesta.status}`
            );
        }

        console.log(
            "Progreso de San José guardado correctamente:",
            resultado
        );

        // ======================================
        // ACTUALIZAR PROGRESO DEL JUGADOR
        // ======================================

        if (typeof cargarProgresoJugador === "function") {
            await cargarProgresoJugador(jugadorId);
        }

        return true;

    } catch (error) {

        console.error(
            "Error guardando progreso de San José:",
            error
        );

        return false;
    }
}


// ==========================================
// REGRESAR AL ESCENARIO PRINCIPAL
// DESDE SAN JOSÉ
// ==========================================

function volverEscenarioPrincipalSanJose() {

    console.log(
        "Regresando desde San José al escenario principal..."
    );

    // ======================================
    // OCULTAR MAPA LEAFLET
    // ======================================

    const mapa =
        document.getElementById("map");

    if (mapa) {
        mapa.style.display = "none";
    }

    // ======================================
    // OCULTAR PANEL DE SAN JOSÉ
    // ======================================

    const panel =
        document.getElementById("rightPanel");

    if (panel) {
        panel.style.display = "none";
    }

    // ======================================
    // RESTAURAR ESCENARIO PRINCIPAL
    // ======================================

    const escenarioPrincipal =
        document.getElementById("escenarioPrincipal");

    if (escenarioPrincipal) {

        escenarioPrincipal.style.display = "flex";

        console.log(
            "Escenario principal visible nuevamente."
        );

    } else {

        console.error(
            "No se encontró #escenarioPrincipal."
        );
    }

    // ==========================================
    // VERIFICAR RESULTADO FINAL AL REGRESAR
    // ==========================================

    if (
        typeof window.verificarResultadoFinal === "function"
    ) {

        window.verificarResultadoFinal();

    }

}