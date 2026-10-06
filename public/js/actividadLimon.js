// ==========================================
// ACTIVIDAD 1 - LIMÓN
// ==========================================

let dialogosLimonActivos = false;

let dialogoLimonActual = 0;


// TEMPORIZADOR

let tiempoRestanteLimon = 60;

let temporizadorLimon = null;

let actividadLimonActiva = false;


// ==========================================
// DIÁLOGOS DE LIMÓN
// ==========================================

const dialogosLimon = [

    {
        nombre: "Guía Ambiental",
        texto:
            "Bienvenido a la Actividad 1. " +
            "En esta actividad aprenderás a identificar " +
            "elementos relacionados con las condiciones del suelo."
    },

    {
        nombre: "Guía Ambiental",
        texto:
            "Observarás diferentes elementos ambientales " +
            "y deberás decidir cómo pueden afectar al suelo."
    },

    {
        nombre: "Guía Ambiental",
        texto:
            "Clasifica cada elemento como FAVORABLE " +
            "o DESFAVORABLE para las condiciones del suelo."
    },

    {
        nombre: "Guía Ambiental",
        texto:
            "Tendrás un minuto para completar la actividad. " +
            "El tiempo comenzará cuando presiones Comenzar."
    }

];

// MODELOS ACTIVIDAD LIMÓN

// ==========================================
// ELEMENTOS DE LA ACTIVIDAD
// ==========================================

const modelosLimon = [

    {
        nombre: "Soda",
        modelo: "models/soda.glb",
        clasificacion: "desfavorable"
    },

    {
        nombre: "Llantas",
        modelo: "models/llantas.glb",
        clasificacion: "desfavorable"
    },

    {
        nombre: "Gallina",
        modelo: "models/gallina.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Flores",
        modelo: "models/flores.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Carretillo",
        modelo: "models/carretillo.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Basura",
        modelo: "models/basura.glb",
        clasificacion: "desfavorable"
    },

    {
        nombre: "Banana",
        modelo: "models/banana.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Árbol",
        modelo: "models/arbol.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Roca",
        modelo: "models/roca.glb",
        clasificacion: "favorable"
    },

    {
        nombre: "Arbusto",
        modelo: "models/arbusto.glb",
        clasificacion: "favorable"
    }

];


let limonApp = null;

let camaraLimon = null;

let modeloActualLimon = null;

// ==========================================
// ESTADO DE LOS ELEMENTOS
// ==========================================

let elementoActualLimon = null;

let modelosDisponiblesLimon = [];

let puntosActividadLimon = 0;

let elementosRespondidosLimon = 0;

let respuestaLimonBloqueada = false;


// ==========================================
// INICIAR ACTIVIDAD
// ==========================================

function iniciarActividadLimon() {

    console.log(
        "Actividad 1 - Limón iniciada"  
    );

    // ======================================
    // REINICIAR ESTADO DE LA ACTIVIDAD
    // ======================================

    tiempoRestanteLimon = 60;

    actividadLimonActiva = false;


    // Detener temporizador anterior
    // en caso de reiniciar la actividad

    if (temporizadorLimon) {

        clearInterval(
            temporizadorLimon
        );

        temporizadorLimon = null;

    }


    // ======================================
    // MOSTRAR ACTIVIDAD
    // ======================================

    const actividad =
        document.getElementById(
            "actividadLimon"
        );

    actividad.style.display =
        "block";


    // ======================================
    // ESTADO INICIAL
    // ======================================

    document.getElementById(
        "tiempoLimon"
    ).textContent =
        "Tiempo: 01:00";


    document.getElementById(
        "puntosLimon"
    ).textContent =
        "Puntos: 0";


    document.getElementById(
        "progresoLimon"
    ).textContent =
        "Elemento 1 de 10";


    // ======================================
    // TODAVÍA NO SE PUEDE RESPONDER
    // ======================================

    document.getElementById(
        "clasificacionLimon"
    ).style.display =
        "none";


    // ======================================
    // OCULTAR ANTIGUO GUÍA DE LIMÓN
    // ======================================

    const guiaLimon =
        document.getElementById(
            "guiaLimon"
        );

    if (guiaLimon) {

        guiaLimon.style.display =
            "none";

    }


    // ======================================
    // INICIAR INSTRUCCIONES
    // ======================================

    iniciarDialogosLimon();

}


// ==========================================
// INICIAR DIÁLOGOS DE LIMÓN
// ==========================================

function iniciarDialogosLimon() {

    dialogosLimonActivos =
        true;

    dialogoLimonActual =
        0;


    // ======================================
    // CARGAR MONO COMO GUÍA
    // ======================================

    crearPersonaje3D(
        "models/mono.glb"
    );


    // ======================================
    // MOSTRAR PRIMER DIÁLOGO
    // ======================================

    mostrarDialogoLimon();

}


// ==========================================
// MOSTRAR DIÁLOGO
// ==========================================

function mostrarDialogoLimon() {

    const dialogo =
        dialogosLimon[
            dialogoLimonActual
        ];


    characterName.textContent =
        dialogo.nombre;


    dialogText.textContent =
        dialogo.texto;


    dialogBox.style.display =
        "flex";


    // ======================================
    // TEXTO DEL BOTÓN
    // ======================================

    if (
        dialogoLimonActual ===
        dialogosLimon.length - 1
    ) {

        nextDialogBtn.textContent =
            "Comenzar";

    } else {

        nextDialogBtn.textContent =
            "Continuar ►";

    }

}


// ==========================================
// FINALIZAR INSTRUCCIONES
// ==========================================

function finalizarDialogosLimon() {

    // ======================================
    // REINICIAR PUNTOS
    // ======================================

    puntosActividadLimon = 0;

    elementosRespondidosLimon = 0;


    document.getElementById(
        "puntosLimon"
    ).textContent =
        "Puntos: 0";
    

    dialogosLimonActivos =
        false;

    dialogoLimonActual =
        0;


    dialogBox.style.display =
        "none";


    nextDialogBtn.textContent =
        "Continuar ►";


    // ======================================
    // MOSTRAR BOTONES DE CLASIFICACIÓN
    // ======================================

    document.getElementById(
        "clasificacionLimon"
    ).style.display =
        "flex";


    console.log(
        "Instrucciones terminadas."
    );


    // ======================================
    // ACTIVIDAD AHORA ESTÁ ACTIVA
    // ======================================

    actividadLimonActiva = true;


    // ======================================
    // INICIAR LOS 60 SEGUNDOS
    // ======================================

    // Iniciar cronómetro
    iniciarTemporizadorLimon();

    // ======================================
    // PREPARAR ACTIVIDAD
    // ======================================

    // Copiar los 10 elementos
    modelosDisponiblesLimon =
        [...modelosLimon];


    // Reiniciar puntos
    puntosActividadLimon = 0;


    // Reiniciar cantidad respondida
    elementosRespondidosLimon = 0;


    // Permitir respuestas
    respuestaLimonBloqueada = false;


    // Actualizar puntos
    document.getElementById(
        "puntosLimon"
    ).textContent =
        "Puntos: 0";


    // Mostrar modelo 3D
    crearEscenaLimon();

}

// ==========================================
// INICIAR TEMPORIZADOR DE LIMÓN
// ==========================================

function iniciarTemporizadorLimon() {

    // Evitar varios temporizadores
    if (temporizadorLimon) {

        clearInterval(
            temporizadorLimon
        );

    }


    // ======================================
    // TIEMPO INICIAL
    // ======================================

    tiempoRestanteLimon = 60;

    actualizarTiempoLimon();


    // ======================================
    // CONTADOR
    // ======================================

    temporizadorLimon =
        setInterval(
            () => {

                // Si la actividad no está activa,
                // no disminuir el tiempo

                if (!actividadLimonActiva) {
                    return;
                }


                tiempoRestanteLimon--;


                // Actualizar pantalla
                actualizarTiempoLimon();


                // ==================================
                // TIEMPO TERMINADO
                // ==================================

                if (
                    tiempoRestanteLimon <= 0
                ) {

                    finalizarActividadLimon();

                }

            },

            1000
        );

}

// ==========================================
// ACTUALIZAR TIEMPO EN PANTALLA
// ==========================================

function actualizarTiempoLimon() {

    const elementoTiempo =
        document.getElementById(
            "tiempoLimon"
        );


    if (!elementoTiempo) {
        return;
    }


    const minutos =
        Math.floor(
            tiempoRestanteLimon / 60
        );


    const segundos =
        tiempoRestanteLimon % 60;


    const segundosTexto =
        segundos
            .toString()
            .padStart(
                2,
                "0"
            );


    elementoTiempo.textContent =
        "Tiempo: " +
        minutos +
        ":" +
        segundosTexto;

}

// ==========================================
// FINALIZAR ACTIVIDAD 1
// ==========================================

function finalizarActividadLimon() {

    // Evitar finalizar varias veces
    if (!actividadLimonActiva) {
        return;
    }


    console.log(
        "Actividad 1 finalizada."
    );


    // ======================================
    // DETENER ACTIVIDAD
    // ======================================

    actividadLimonActiva =
        false;


    // ======================================
    // DETENER TEMPORIZADOR
    // ======================================

    if (temporizadorLimon) {

        clearInterval(
            temporizadorLimon
        );

        temporizadorLimon =
            null;

    }


    // ======================================
    // ASEGURAR 00:00
    // ======================================

    tiempoRestanteLimon =
        0;

    actualizarTiempoLimon();


    // ======================================
    // BLOQUEAR RESPUESTAS
    // ======================================

    const clasificacion =
        document.getElementById(
            "clasificacionLimon"
        );

    if (clasificacion) {

        clasificacion.style.display =
            "none";

    }


    // ======================================
    // RESULTADO TEMPORAL
    // ======================================

    const resultado =
        document.getElementById(
            "resultadoFinalLimon"
        );

    if (resultado) {

        resultado.style.display =
            "flex";

    }


    document.getElementById(
        "puntosFinalesLimon"
    ).textContent =
        "Puntos obtenidos: " +
        puntosActividadLimon;


   // ======================================
// CALCULAR RESULTADO
// ======================================

let nivelFinal =
    "MALO";


let mensajeFinal =
    "Se recomienda revisar las diferencias " +
    "entre los elementos favorables y " +
    "desfavorables para el suelo.";


// 20 puntos
if (
    puntosActividadLimon >= 20
) {

    nivelFinal =
        "BUENO";

    mensajeFinal =
        "Identificaste correctamente los elementos " +
        "favorables y desfavorables para el suelo.";

}

// Entre 10 y 19
else if (
    puntosActividadLimon >= 10
) {

    nivelFinal =
        "MEDIO";

    mensajeFinal =
        "Reconociste varios elementos correctamente, " +
        "pero todavía puedes mejorar algunas clasificaciones.";

}


// ======================================
// MOSTRAR RESULTADO
// ======================================

document.getElementById(
    "puntosFinalesLimon"
).textContent =
    "Puntos obtenidos: " +
    puntosActividadLimon;


document.getElementById(
    "nivelFinalLimon"
).textContent =
    "Resultado: " +
    nivelFinal;


document.getElementById(
    "retroalimentacionFinalLimon"
).textContent =
    mensajeFinal;

}

// ==========================================
// CONTINUAR DESPUÉS DEL RESULTADO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botonContinuar =
            document.getElementById(
                "continuarResultadoLimon"
            );

        if (!botonContinuar) {
            return;
        }


        botonContinuar.addEventListener(
            "click",
            () => {

                // Ocultar resultado
                document.getElementById(
                    "resultadoFinalLimon"
                ).style.display =
                    "none";


                // Ocultar actividad
                document.getElementById(
                    "actividadLimon"
                ).style.display =
                    "none";


                // Regresar al escenario
                abrirEscenarioPrincipal();

            }
        );

    }
);


// ==========================================
// CREAR ESCENA 3D DE LIMÓN
// ==========================================

function crearEscenaLimon() {

    // Evitar crear PlayCanvas varias veces
    if (limonApp) {

        mostrarModeloAleatorioLimon();

        return;
    }


    const canvas =
        document.getElementById(
            "limonCanvas"
        );


    if (!canvas) {

        console.error(
            "No se encontró #limonCanvas."
        );

        return;

    }


    // ======================================
    // CREAR APLICACIÓN PLAYCANVAS
    // ======================================

    limonApp =
        new pc.Application(
            canvas
        );


    limonApp.setCanvasFillMode(
        pc.FILLMODE_NONE
    );


    limonApp.setCanvasResolution(
        pc.RESOLUTION_AUTO
    );


    limonApp.start();


    // ======================================
    // FONDO TRANSPARENTE
    // ======================================

    limonApp.scene.ambientLight =
        new pc.Color(
            1,
            1,
            1
        );


    // ======================================
    // CÁMARA
    // ======================================

    camaraLimon =
        new pc.Entity(
            "CamaraLimon"
        );


    camaraLimon.addComponent(
        "camera",
        {

            clearColor:
                new pc.Color(
                    0,
                    0,
                    0,
                    0
                )

        }
    );


    camaraLimon.setPosition(
        0,
        1.5,
        4
    );


    camaraLimon.lookAt(
        0,
        1,
        0
    );


    limonApp.root.addChild(
        camaraLimon
    );


    // ======================================
    // LUZ PRINCIPAL
    // ======================================

    const luz =
        new pc.Entity(
            "LuzLimon"
        );


    luz.addComponent(
        "light",
        {

            type:
                "directional",

            intensity:
                3

        }
    );


    luz.setEulerAngles(
        45,
        35,
        0
    );


    limonApp.root.addChild(
        luz
    );


    // ======================================
    // LUZ DE RELLENO
    // ======================================

    const luzRelleno =
        new pc.Entity(
            "LuzRellenoLimon"
        );


    luzRelleno.addComponent(
        "light",
        {

            type:
                "omni",

            intensity:
                1.5,

            range:
                10

        }
    );


    luzRelleno.setPosition(
        2,
        3,
        3
    );


    limonApp.root.addChild(
        luzRelleno
    );


    // ======================================
    // MOSTRAR PRIMER MODELO
    // ======================================

    mostrarModeloAleatorioLimon();

}

// ==========================================
// MOSTRAR MODELO ALEATORIO
// ==========================================

function mostrarModeloAleatorioLimon() {

    // ======================================
    // COMPROBAR SI TERMINARON LOS 10
    // ======================================

    if (
        modelosDisponiblesLimon.length === 0
    ) {

        finalizarActividadLimon();

        return;
    }


    // ======================================
    // BLOQUEAR MIENTRAS CARGA
    // ======================================

    respuestaLimonBloqueada = true;


    // ======================================
    // ELIMINAR MODELO ANTERIOR
    // ======================================

    if (modeloActualLimon) {

        modeloActualLimon.destroy();

        modeloActualLimon = null;

    }


    // ======================================
    // ELEGIR POSICIÓN ALEATORIA
    // ======================================

    const indiceAleatorio =
        Math.floor(
            Math.random() *
            modelosDisponiblesLimon.length
        );


    // ======================================
    // SACAR ELEMENTO DEL ARREGLO
    // ======================================

    elementoActualLimon =
        modelosDisponiblesLimon.splice(
            indiceAleatorio,
            1
        )[0];


    console.log(
        "Elemento:",
        elementoActualLimon.nombre,
        "| Clasificación:",
        elementoActualLimon.clasificacion
    );


    // ======================================
    // ACTUALIZAR PROGRESO
    // ======================================

    document.getElementById(
        "progresoLimon"
    ).textContent =

        "Elemento " +
        (elementosRespondidosLimon + 1) +
        " de 10";


    // ======================================
    // CARGAR GLB
    // ======================================

    limonApp.assets.loadFromUrl(

        elementoActualLimon.modelo,

        "container",

        function(error, asset) {

            if (error) {

                console.error(
                    "Error cargando modelo:",
                    elementoActualLimon.modelo,
                    error
                );

                respuestaLimonBloqueada =
                    false;

                return;
            }


            modeloActualLimon =
                asset.resource
                    .instantiateRenderEntity();


            limonApp.root.addChild(
                modeloActualLimon
            );


            // ==================================
            // CENTRAR MODELO
            // ==================================

            const render =
                modeloActualLimon
                    .findComponent(
                        "render"
                    );


            if (
                render &&
                render.meshInstances.length > 0
            ) {

                const aabb =
                    render
                        .meshInstances[0]
                        .aabb;


                const centro =
                    aabb.center.clone();


                const tamano =
                    aabb.halfExtents
                        .length() * 2;


                modeloActualLimon.setPosition(

                    -centro.x,
                    -centro.y,
                    -centro.z

                );


                // ==================================
                // ACERCAR CÁMARA
                // ==================================

                camaraLimon.setPosition(

                    0,

                    tamano * 0.4,

                    tamano * 1.7

                );


                camaraLimon.lookAt(
                    0,
                    0,
                    0
                );

            }


            // ==================================
            // YA PUEDE RESPONDER
            // ==================================

            respuestaLimonBloqueada =
                false;

        }

    );

}


// ==========================================
// RESPONDER CLASIFICACIÓN
// ==========================================

function responderLimon(respuestaJugador) {

    // Evitar responder mientras
    // está cargando otro modelo
    if (
        respuestaLimonBloqueada ||
        !actividadLimonActiva ||
        !elementoActualLimon
    ) {

        console.log(
            "No se puede responder todavía."
        );

        return;
    }


    respuestaLimonBloqueada = true;


    console.log(
        "Jugador eligió:",
        respuestaJugador
    );

    console.log(
        "Respuesta correcta:",
        elementoActualLimon.clasificacion
    );


    // ======================================
    // COMPROBAR RESPUESTA
    // ======================================

    if (
        respuestaJugador ===
        elementoActualLimon.clasificacion
    ) {

        // Correcto = +2
        puntosActividadLimon += 2;

        console.log(
            "CORRECTO +2"
        );

    } else {

        // Incorrecto = -1
        puntosActividadLimon -= 1;


        // No permitir números negativos
        if (
            puntosActividadLimon < 0
        ) {

            puntosActividadLimon = 0;

        }


        console.log(
            "INCORRECTO -1"
        );

    }


    // ======================================
    // ACTUALIZAR PUNTOS EN PANTALLA
    // ======================================

    const puntosPantalla =
        document.getElementById(
            "puntosLimon"
        );


    if (puntosPantalla) {

        puntosPantalla.textContent =
            "Puntos: " +
            puntosActividadLimon;

    }


    console.log(
        "Puntos actuales:",
        puntosActividadLimon
    );


    // ======================================
    // CONTAR ELEMENTO RESPONDIDO
    // ======================================

    elementosRespondidosLimon++;


    // ======================================
    // TERMINAR AL COMPLETAR LOS 10
    // ======================================

    if (
        elementosRespondidosLimon >= 10
    ) {

        finalizarActividadLimon();

        return;

    }


    // ======================================
    // SIGUIENTE MODELO
    // ======================================

    mostrarModeloAleatorioLimon();

}

// ==========================================
// BOTONES FAVORABLE / DESFAVORABLE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botonFavorable =
            document.getElementById(
                "favorableLimon"
            );


        const botonDesfavorable =
            document.getElementById(
                "desfavorableLimon"
            );


        if (
            !botonFavorable ||
            !botonDesfavorable
        ) {

            console.error(
                "No se encontraron los botones de Limón."
            );

            return;
        }


        botonFavorable.addEventListener(
            "click",
            () => {

                responderLimon(
                    "favorable"
                );

            }
        );


        botonDesfavorable.addEventListener(
            "click",
            () => {

                responderLimon(
                    "desfavorable"
                );

            }
        );

    }
);