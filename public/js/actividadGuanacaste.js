// ==========================================
// ACTIVIDAD 4 - GUANACASTE
// RECUPERA EL TERRENO
// ESCENARIO 3D
// ==========================================

// ==========================================
// PLAYCANVAS
// ==========================================

let guanacasteApp = null;
let temporizadorMensajeGuanacaste = null;
// ==========================================
// RAYCAST PARA SELECCIONAR EL TERRENO
// ==========================================

let escenarioSeleccionable = null;


// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================

let terrenoGuanacaste = null;
let camaraGuanacaste = null;
let luzGuanacaste = null;


// ==========================================
// OBJETOS 3D
// ==========================================

let objetosDisponibles = [];

let objetosColocados = [];


// ==========================================
// OBJETO ACTUAL SELECCIONADO
// ==========================================

let objetoSeleccionado = null;


// ==========================================
// MÁXIMO DE ELEMENTOS
// ==========================================

const MAXIMO_ELEMENTOS = 5;


// ==========================================
// PUNTUACIÓN
// ==========================================

let puntuacionGuanacaste = 0;


// ==========================================
// ESTADO DE LA ACTIVIDAD
// ==========================================

let actividadGuanacasteIniciada = false;
let actividadGuanacasteEvaluada = false;


// ==========================================
// SIMULACIÓN DE LLUVIA E INUNDACIÓN
// ==========================================

let simulacionGuanacasteActiva = false;
let tormentaGuanacaste = null;
let temporizadorTormentaGuanacaste = null;
let callbackTormentaGuanacaste = null;
let generacionTormentaGuanacaste = 0;

const DURACION_TORMENTA_GUANACASTE = 10000;

// ==========================================
// SONIDOS DE LLUVIA E INUNDACIÓN
// ==========================================

const sonidoLluviaGuanacaste =
    new Audio("/sounds/sonidoLluvia.mp3");

const sonidoInundacionGuanacaste =
    new Audio("/sounds/sonidoInundacion.mp3");

// Repetir sonidos durante la simulación
sonidoLluviaGuanacaste.loop = true;
sonidoInundacionGuanacaste.loop = true;

// Volúmenes independientes
sonidoLluviaGuanacaste.volume = 0.35;
sonidoInundacionGuanacaste.volume = 0.30;

// Precargar sonidos
sonidoLluviaGuanacaste.preload = "auto";
sonidoInundacionGuanacaste.preload = "auto";

// ==========================================
// REPRODUCIR SONIDOS DE LA SIMULACIÓN
// ==========================================

function reproducirSonidosTormentaGuanacaste(permitirInundacion) {

    detenerSonidosTormentaGuanacaste();

    // La lluvia siempre se reproduce
    sonidoLluviaGuanacaste.currentTime = 0;

    sonidoLluviaGuanacaste.play().catch(error => {
        console.warn(
            "No se pudo reproducir sonido de lluvia:",
            error
        );
    });

    // El sonido de inundación solo se reproduce
    // cuando el resultado es MEDIO o MALO
    if (permitirInundacion) {

        sonidoInundacionGuanacaste.currentTime = 0;

        sonidoInundacionGuanacaste.play().catch(error => {
            console.warn(
                "No se pudo reproducir sonido de inundación:",
                error
            );
        });
    }
}


// ==========================================
// DETENER SONIDOS DE LA SIMULACIÓN
// ==========================================

function detenerSonidosTormentaGuanacaste() {

    sonidoLluviaGuanacaste.pause();
    sonidoLluviaGuanacaste.currentTime = 0;

    sonidoInundacionGuanacaste.pause();
    sonidoInundacionGuanacaste.currentTime = 0;
}


// ==========================================
// CONFIGURACIÓN DE MODELOS
// ==========================================

// IMPORTANTE:
// Cambia los nombres de los archivos si tus
// modelos tienen nombres diferentes.

const modelosGuanacaste = {

    escenario: "/models/escenario1.glb",

    arbol: "/models/arbol.glb",

    arbusto: "/models/arbusto.glb",

    pasto: "/models/pasto.glb",

    roca: "/models/roca.glb",

    basura: "/models/basura.glb"

};



// ==========================================
// CONFIGURACIÓN AMBIENTAL DE ELEMENTOS
// ==========================================

const valoresElementos = {
    arbol: 2,
    arbusto: 2,
    pasto: 1,
    roca: 1,
    basura: -2
};

// 4 o más negativos producen MALO.
const UMBRAL_NEGATIVOS_MALO_GUANACASTE = 4;

// Control de cargas asíncronas.
let elementosPendientesGuanacaste = 0;
let generacionElementosGuanacaste = 0;

// Detectar automáticamente elementos negativos.
function esElementoNegativoGuanacaste(tipo) {
    const valor = valoresElementos[tipo];

    return typeof valor === "number" && valor < 0;
}

// Contar elementos negativos realmente colocados.
function obtenerConteoNegativosGuanacaste() {
    return objetosColocados.filter(objeto =>
        esElementoNegativoGuanacaste(objeto.tipo)
    ).length;
}

// Contar elementos colocados y pendientes de cargar.
function obtenerOcupacionGuanacaste() {
    return objetosColocados.length +
        elementosPendientesGuanacaste;
}

// Evitar evaluar mientras se cargan modelos.
function actualizarDisponibilidadEvaluacionGuanacaste() {
    const boton = document.getElementById(
        "btnEvaluarGuanacaste"
    );

    if (
        !boton ||
        simulacionGuanacasteActiva ||
        actividadGuanacasteEvaluada
    ) {
        return;
    }

    boton.disabled = elementosPendientesGuanacaste > 0;

    boton.textContent = elementosPendientesGuanacaste > 0
        ? "⏳ Cargando elementos..."
        : "✅ Evaluar";
}


// ==========================================
// SONIDOS DE RETROALIMENTACIÓN - GUANACASTE
// ==========================================


// ==========================================
// SONIDOS DE RETROALIMENTACIÓN - GUANACASTE
// ==========================================

const sonidosResultadoGuanacaste = {
    bueno: new Audio("/sounds/retroBueno.mp3"),
    medio: new Audio("/sounds/retroMedio.mp3"),
    malo: new Audio("/sounds/retroMalo.mp3")
};

// Configurar volumen y precarga
Object.values(sonidosResultadoGuanacaste).forEach(sonido => {
    sonido.volume = 0.7;
    sonido.preload = "auto";
});


let sonidoActualGuanacaste = null;

function detenerSonidoResultadoGuanacaste() {

    if (sonidoActualGuanacaste) {
        sonidoActualGuanacaste.pause();
        sonidoActualGuanacaste.currentTime = 0;
        sonidoActualGuanacaste = null;
    }
}

function reproducirSonidoResultadoGuanacaste(nivel) {

    detenerSonidoResultadoGuanacaste();

    const sonido = sonidosResultadoGuanacaste[nivel];

    if (!sonido) {
        return;
    }

    const musicaFondo = document.getElementById("bgSound");

    if (musicaFondo) {
        musicaFondo.pause();
    }

    sonidoActualGuanacaste = sonido;
    sonido.currentTime = 0;

    sonido.play().catch(error => {
        console.warn(
            "No se pudo reproducir el sonido de Guanacaste:",
            error
        );
    });
}



 // ==========================================
 // DIÁLOGOS DE GUANACASTE - GUACAMAYA
 // ==========================================

let dialogosGuanacasteActivos = false;
let dialogoGuanacasteActual = 0;

const dialogosGuanacaste = [
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "¡Bienvenido a Guanacaste! En esta actividad " +
            "aprenderás cómo nuestras decisiones pueden " +
            "influir en las condiciones del terreno."
    },
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "Podrás seleccionar árboles, arbustos, " +
            "pasto, rocas y basura para colocarlos " +
            "sobre el terreno."
    },
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "Selecciona un elemento y haz clic sobre " +
            "el terreno para colocarlo. Puedes utilizar " +
            "un máximo de cinco elementos."
    },
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "Recuerda que la vegetación ayuda a " +
            "proteger el suelo, mientras que la basura " +
            "puede perjudicar sus condiciones ambientales."
    },
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "Cuando termines, presiona Evaluar. " +
            "Observarás cómo responde el terreno " +
            "ante una lluvia intensa."
    },
    {
        nombre: "Guacamaya - Guía Ambiental",
        texto:
            "¡Ahora es tu turno! Selecciona cuidadosamente " +
            "los elementos y descubre cómo tus decisiones " +
            "afectan al ambiente."
    }
];

// ==========================================
// INICIAR DIÁLOGOS DE GUANACASTE
// ==========================================

function iniciarDialogosGuanacaste() {

    dialogosGuanacasteActivos = true;
    dialogoGuanacasteActual = 0;

    crearPersonaje3D("models/guacamaya.glb");

    mostrarDialogoGuanacaste();
}

// ==========================================
// MOSTRAR DIÁLOGO DE GUANACASTE
// ==========================================

function mostrarDialogoGuanacaste() {

    const dialogo =
        dialogosGuanacaste[dialogoGuanacasteActual];

    if (!dialogo) return;

    characterName.textContent = dialogo.nombre;
    dialogText.textContent = dialogo.texto;

    dialogBox.style.display = "flex";

    nextDialogBtn.textContent =
        dialogoGuanacasteActual ===
        dialogosGuanacaste.length - 1
            ? "Comenzar"
            : "Continuar ►";
}

// ==========================================
// FINALIZAR DIÁLOGOS DE GUANACASTE
// ==========================================

function finalizarDialogosGuanacaste() {

    dialogosGuanacasteActivos = false;
    dialogoGuanacasteActual = 0;

    dialogBox.style.display = "none";
    nextDialogBtn.textContent = "Continuar ►";

    console.log(
        "Instrucciones de Guanacaste finalizadas."
    );
}



// ==========================================
// INICIAR ACTIVIDAD
// ==========================================

function iniciarActividadGuanacaste() {

    console.log(
        "======================================"
    );

    console.log(
        "INICIANDO ACTIVIDAD 4"
    );

    console.log(
        "RECUPERA EL TERRENO"
    );

    console.log(
        "======================================"
    );


    // ==========================================
    // OBTENER CANVAS
    // ==========================================

    const canvas =
        document.getElementById(
            "guanacasteCanvas"
        );


    if (!canvas) {

        console.error(
            "No se encontró #guanacasteCanvas."
        );

        return;

    }


    // ==========================================
    // EVITAR DUPLICAR
    // ==========================================


    if (guanacasteApp) {

        reiniciarActividadGuanacaste();

        actividadGuanacasteIniciada = true;

        iniciarDialogosGuanacaste();

        requestAnimationFrame(() => {
            redimensionarActividadGuanacaste();
        });

        console.log(
            "Nueva partida de Guanacaste iniciada."
        );

        return;
    }



    // ==========================================
    // CREAR PLAYCANVAS
    // ==========================================

    guanacasteApp =
        new pc.Application(

            canvas,

            {

                graphicsDeviceOptions: {

                    antialias: true

                }

            }

        );


    // ==========================================
    // CONFIGURACIÓN DEL CANVAS
    // ==========================================

    guanacasteApp.setCanvasFillMode(
        pc.FILLMODE_NONE
    );


    guanacasteApp.setCanvasResolution(
        pc.RESOLUTION_AUTO
    );


    // ==========================================
    // INICIAR
    // ==========================================

    guanacasteApp.start();


    // ==========================================
    // CREAR ESCENARIO
    // ==========================================

    crearTerrenoGuanacaste();

    crearCamaraGuanacaste();

    crearLuzGuanacaste();


    // ==========================================
    // CREAR CONTROLES HTML
    // ==========================================

    crearInterfazGuanacaste();

    
    // ==========================================
    // CREAR CONTROLES HTML
    // ==========================================
    configurarMenuPausaGuanacaste();

    // ==========================================
    // EVENTOS DEL MOUSE
    // ==========================================

    configurarMouseGuanacaste();


    // ==========================================
    // REDIMENSIONAR
    // ==========================================

    window.addEventListener(
        "resize",
        redimensionarActividadGuanacaste
    );


    actividadGuanacasteIniciada = true;

    iniciarDialogosGuanacaste();

    console.log(
        "Actividad 4 iniciada correctamente."
    );
}


// ==========================================
// CREAR TERRENO
// ==========================================

// ==========================================
// CARGAR ESCENARIO 3D
// ==========================================

function crearTerrenoGuanacaste() {

    const rutaEscenario =
        modelosGuanacaste.escenario;


    console.log(
        "Cargando escenario:",
        rutaEscenario
    );


    guanacasteApp.assets.loadFromUrl(

        rutaEscenario,

        "container",

        function(error, asset) {

            if (error) {

                console.error(
                    "Error al cargar escenario1.glb:"
                );

                console.error(error);

                return;
            }


            console.log(
                "Escenario 3D cargado correctamente."
            );


            // ==========================================
            // CREAR ESCENARIO
            // ==========================================

            terrenoGuanacaste =
                asset.resource
                    .instantiateRenderEntity();


            // ==========================================
            // AGREGAR A ESCENA
            // ==========================================

            guanacasteApp.root.addChild(
                terrenoGuanacaste
            );


            // ==========================================
            // POSICIÓN
            // ==========================================

            terrenoGuanacaste.setLocalPosition(
                0,
                0,
                0
            );


            // ==========================================
            // ESCALA
            // ==========================================

            terrenoGuanacaste.setLocalScale(
                1,
                1,
                1
            );


            // ==========================================
            // REFERENCIA
            // ==========================================

            escenarioSeleccionable =
                terrenoGuanacaste;


            console.log(
                "Escenario listo para selección."
            );


            // ==========================================
            // PREPARAR COLISIÓN DEL ESCENARIO
            // ==========================================

            agregarColisionEscenario(
                asset
            );

        }

    );
}


// ==========================================
// COLISIÓN DEL ESCENARIO
// ==========================================

function agregarColisionEscenario(asset) {

    if (!terrenoGuanacaste) {
        return;
    }

    try {

        terrenoGuanacaste.addComponent(
            "collision",
            {
                type: "mesh",
                renderAsset: asset.resource
            }
        );

        terrenoGuanacaste.addComponent(
            "rigidbody",
            {
                type: "static"
            }
        );

        console.log(
            "Colisión y cuerpo estático creados."
        );

    }
    catch (error) {

        console.error(
            "No se pudo crear la colisión:",
            error
        );

    }
}


// ==========================================
// CÁMARA
// ==========================================

function crearCamaraGuanacaste() {

    camaraGuanacaste =
        new pc.Entity(
            "CamaraGuanacaste"
        );


    camaraGuanacaste.addComponent(

        "camera",

        {

            clearColor:
                new pc.Color(

                    0.55,
                    0.75,
                    0.90

                ),

            fov: 50,

            nearClip: 0.1,

            farClip: 200

        }

    );


    // ==========================================
    // POSICIÓN
    // ==========================================

    camaraGuanacaste.setLocalPosition(

        0,
        3,
        4

    );


    // ==========================================
    // MIRAR AL TERRENO
    // ==========================================

    camaraGuanacaste.lookAt(

        new pc.Vec3(

            0,
            0,
            0

        )

    );


    // ==========================================
    // AGREGAR
    // ==========================================

    guanacasteApp.root.addChild(
        camaraGuanacaste
    );


    console.log(
        "Cámara creada."
    );
}


// ==========================================
// ILUMINACIÓN
// ==========================================

function crearLuzGuanacaste() {

    luzGuanacaste =
        new pc.Entity(
            "LuzGuanacaste"
        );


    luzGuanacaste.addComponent(

        "light",

        {

            type: "directional",

            color:
                new pc.Color(

                    1,
                    1,
                    1

                ),

            intensity: 2

        }

    );


    luzGuanacaste.setLocalEulerAngles(

        45,
        30,
        0

    );


    guanacasteApp.root.addChild(
        luzGuanacaste
    );


    console.log(
        "Iluminación creada."
    );
}


// ==========================================
// CREAR INTERFAZ
// ==========================================

function crearInterfazGuanacaste() {

    const contenedor =
        document.getElementById(
            "actividadGuanacaste"
        );


    if (!contenedor) {

        console.error(
            "No existe #actividadGuanacaste."
        );

        return;

    }


    // ==========================================
    // PANEL DE ELEMENTOS
    // ==========================================

    let panel =
        document.getElementById(
            "panelElementosGuanacaste"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "panelElementosGuanacaste";


        contenedor.appendChild(
            panel
        );

    }


    panel.innerHTML = "";


    // ==========================================
    // TÍTULO
    // ==========================================

    const titulo =
        document.createElement(
            "h3"
        );


    titulo.textContent =
        "🌱 Recupera el terreno";


    panel.appendChild(
        titulo
    );


    // ==========================================
    // INSTRUCCIÓN
    // ==========================================

    const instruccion =
        document.createElement(
            "p"
        );


    instruccion.textContent =
        "Selecciona un elemento y haz clic en la ladera para colocarlo.";


    panel.appendChild(
        instruccion
    );


    // ==========================================
    // CONTADOR
    // ==========================================

    const contador =
        document.createElement(
            "p"
        );


    contador.id =
        "contadorElementosGuanacaste";


    contador.textContent =
        "Elementos colocados: 0 / 5";


    panel.appendChild(
        contador
    );


    // ==========================================
    // BOTONES
    // ==========================================

    crearBotonElemento(
        panel,
        "🌳",
        "Árbol",
        "arbol"
    );


    crearBotonElemento(
        panel,
        "🌿",
        "Arbusto",
        "arbusto"
    );


    crearBotonElemento(
        panel,
        "🌱",
        "Pasto",
        "pasto"
    );


    crearBotonElemento(
        panel,
        "🪨",
        "Roca",
        "roca"
    );


    crearBotonElemento(
        panel,
        "🗑️",
        "Basura",
        "basura"
    );


    // ==========================================
    // BOTÓN EVALUAR
    // ==========================================

    const botonEvaluar =
        document.createElement(
            "button"
        );


    botonEvaluar.id =
        "btnEvaluarGuanacaste";


    botonEvaluar.textContent =
        "✅ Evaluar";


    botonEvaluar.addEventListener(
        "click",
        evaluarTerrenoGuanacaste
    );


    panel.appendChild(
        botonEvaluar
    );
}


// ==========================================
// CREAR BOTÓN DE ELEMENTO
// ==========================================

function crearBotonElemento(
    panel,
    icono,
    nombre,
    tipo
) {

    const boton =
        document.createElement(
            "button"
        );


    boton.className =
        "botonElementoGuanacaste";


    boton.dataset.tipo =
        tipo;


    boton.innerHTML =
        icono +
        " " +
        nombre;


    boton.addEventListener(

        "click",

        function() {

            seleccionarElementoGuanacaste(
                tipo,
                boton
            );

        }

    );


    panel.appendChild(
        boton
    );
}


// ==========================================
// SELECCIONAR ELEMENTO
// ==========================================

function seleccionarElementoGuanacaste(
    tipo,
    boton
) {

    if (dialogosGuanacasteActivos) {
        return;
    }

    if (obtenerOcupacionGuanacaste() >= MAXIMO_ELEMENTOS){

        mostrarMensajeGuanacaste(
            "Ya colocaste los 5 elementos disponibles."
        );

        return;

    }


    objetoSeleccionado =
        tipo;


    // ==========================================
    // QUITAR SELECCIÓN VISUAL
    // ==========================================

    const botones =
        document.querySelectorAll(
            ".botonElementoGuanacaste"
        );


    botones.forEach(
        botonActual => {

            botonActual.classList.remove(
                "elementoSeleccionado"
            );

        }
    );


    // ==========================================
    // MARCAR SELECCIONADO
    // ==========================================

    boton.classList.add(
        "elementoSeleccionado"
    );


    console.log(
        "Elemento seleccionado:",
        tipo
    );
}


// ==========================================
// CONTROL DEL MOUSE SOBRE EL TERRENO
// ==========================================

function configurarMouseGuanacaste() {

    const canvas =
        document.getElementById(
            "guanacasteCanvas"
        );


    if (!canvas) {
        return;
    }


    canvas.addEventListener(

        "click",

        function(event) {

            colocarElementoGuanacaste(
                event
            );

        }

    );
}


// ==========================================
// COLOCAR ELEMENTO EN EL PUNTO DEL CLIC
// ==========================================

function colocarElementoGuanacaste(event) {

if (dialogosGuanacasteActivos) {
    return;
}


const menuPausa = document.getElementById("pauseMenu");

const pausaAbierta = menuPausa &&
    window.getComputedStyle(menuPausa).display !== "none";

if (pausaAbierta) {
    return;
}

// ==========================================
// EVITAR COLOCAR ELEMENTOS DURANTE LA CARGA
// ==========================================

if (
    elementosPendientesGuanacaste > 0 ||
    simulacionGuanacasteActiva
) {

    mostrarMensajeGuanacaste(
        "Espera a que termine de cargar el elemento."
    );

    return;
}

// ==========================================
// BLOQUEAR ELEMENTOS DESPUÉS DE EVALUAR
// ==========================================

if (actividadGuanacasteEvaluada) {
    return;
}


    // Evitar clics si Guanacaste no está visible
    const actividad = document.getElementById("actividadGuanacaste");

    if (
        !actividad ||
        window.getComputedStyle(actividad).display === "none"
    ) {
        return;
    }

    // ==========================================
    // COMPROBAR ELEMENTO SELECCIONADO
    // ==========================================

    if (!objetoSeleccionado) {

        mostrarMensajeGuanacaste(
            "Primero selecciona un elemento."
        );

        return;
    }


    // ==========================================
    // COMPROBAR LÍMITE
    // ==========================================


    if (
        obtenerOcupacionGuanacaste() >=
        MAXIMO_ELEMENTOS
    ) {

        mostrarMensajeGuanacaste(
            "Ya utilizaste los 5 elementos."
        );

        return;
    }



    // ==========================================
    // COMPROBAR CÁMARA
    // ==========================================

    if (!camaraGuanacaste) {

        console.error(
            "No existe la cámara."
        );

        return;
    }


    // ==========================================
    // OBTENER POSICIÓN DEL MOUSE
    // ==========================================

    const rect =
        event.target.getBoundingClientRect();


    const mouseX =
        event.clientX -
        rect.left;


    const mouseY =
        event.clientY -
        rect.top;


    // ==========================================
    // CREAR RAYO DESDE LA CÁMARA
    // ==========================================

    const inicio =
        camaraGuanacaste.camera.screenToWorld(
            mouseX,
            mouseY,
            0
        );


    const final =
        camaraGuanacaste.camera.screenToWorld(
            mouseX,
            mouseY,
            camaraGuanacaste.camera.farClip
        );


    // ==========================================
    // DIRECCIÓN DEL RAYO
    // ==========================================

    const direccion =
        new pc.Vec3();

    
    direccion.sub2(
        final,
        inicio
    );


    // ==========================================
    // INTERSECCIÓN CON EL PLANO DEL TERRENO
    // ==========================================

    // El terreno comienza en Y = 0

    const alturaTerreno = 0;


    // Evitar división entre cero

    if (
        Math.abs(direccion.y) < 0.0001
    ) {

        mostrarMensajeGuanacaste(
            "No se puede determinar el punto."
        );

        return;
    }


    // ==========================================
    // CALCULAR DISTANCIA DEL RAYO
    // ==========================================

    const distancia =
        (
            alturaTerreno -
            inicio.y
        ) /
        direccion.y;


    // Si el punto queda detrás de la cámara
    if (distancia < 0) {

        mostrarMensajeGuanacaste(
            "Haz clic sobre la ladera."
        );

        return;
    }


    // ==========================================
    // CALCULAR PUNTO 3D
    // ==========================================

    const punto =
        new pc.Vec3();


    punto.copy(
        inicio
    );


    punto.add(
        direccion.clone().mulScalar(
            distancia
        )
    );


    console.log(
        "Punto 3D seleccionado:",
        punto
    );


    // ==========================================
    // CREAR ELEMENTO
    // ==========================================

    cargarElementoGuanacaste(

        objetoSeleccionado,

        punto.x,

        punto.z,

        punto.y

    );


    // ==========================================
    // LIMPIAR SELECCIÓN
    // ==========================================

    objetoSeleccionado =
        null;


    const botones =
        document.querySelectorAll(
            ".botonElementoGuanacaste"
        );


    botones.forEach(
        boton => {

            boton.classList.remove(
                "elementoSeleccionado"
            );

        }
    );
}

// ==========================================
// CARGAR ELEMENTO 3D
// ==========================================


function cargarElementoGuanacaste(tipo, x, z, y) {

    const ruta = modelosGuanacaste[tipo];

    if (
        !ruta ||
        typeof valoresElementos[tipo] !== "number"
    ) {
        mostrarMensajeGuanacaste(
            "Elemento no configurado: " + tipo
        );

        return;
    }

    if (
        !guanacasteApp ||
        obtenerOcupacionGuanacaste() >= MAXIMO_ELEMENTOS
    ) {
        mostrarMensajeGuanacaste(
            "Ya utilizaste los elementos disponibles."
        );

        return;
    }

    // Guardar la aplicación y la generación actual.
    const appActual = guanacasteApp;
    const generacionActual = generacionElementosGuanacaste;

    // Reservar espacio antes de iniciar la carga.
    elementosPendientesGuanacaste++;

    actualizarContadorGuanacaste();
    actualizarDisponibilidadEvaluacionGuanacaste();

    appActual.assets.loadFromUrl(
        ruta,
        "container",
        function(error, asset) {

            // Ignorar modelos de partidas anteriores.
            if (
                generacionActual !== generacionElementosGuanacaste ||
                guanacasteApp !== appActual
            ) {
                return;
            }

            let contenedor = null;
            let elementoRegistrado = false;

            try {

                if (error || !asset?.resource) {

                    console.error(
                        "Error cargando elemento:",
                        tipo,
                        error
                    );

                    mostrarMensajeGuanacaste(
                        "No se pudo cargar: " + tipo
                    );

                    return;
                }

                if (
                    actividadGuanacasteEvaluada ||
                    simulacionGuanacasteActiva ||
                    objetosColocados.length >= MAXIMO_ELEMENTOS
                ) {
                    return;
                }

                
                // Crear modelo.
                const modelo = asset.resource
                    .instantiateRenderEntity();

                // Crear contenedor.
                contenedor = new pc.Entity(
                    "Elemento_" + tipo
                );

                contenedor.addChild(modelo);

                // Colocar en el terreno.
                contenedor.setLocalPosition(x, y, z);

                modelo.setLocalScale(0.5, 0.5, 0.5);

                appActual.root.addChild(contenedor);

                // Registrar el elemento colocado.
                objetosColocados.push({
                    tipo: tipo,
                    entidad: contenedor,
                    valor: valoresElementos[tipo]
                });

                // Confirmar registro exitoso.
                elementoRegistrado = true;

                console.log(
                    "Elemento colocado:",
                    tipo,
                    "Negativos:",
                    obtenerConteoNegativosGuanacaste()
                );

            } catch (error) {

                if (contenedor && !elementoRegistrado) {
                    contenedor.destroy();
                }

                console.error(
                    "No se pudo colocar el modelo:",
                    tipo,
                    error
                );

                mostrarMensajeGuanacaste(
                    "Error al colocar: " + tipo
                );

            } finally {

                // Liberar el espacio reservado.
                elementosPendientesGuanacaste = Math.max(
                    0,
                    elementosPendientesGuanacaste - 1
                );

                actualizarContadorGuanacaste();
                actualizarDisponibilidadEvaluacionGuanacaste();
            }
        }
    );
}




// ==========================================
// ACTUALIZAR CONTADOR
// ==========================================


function actualizarContadorGuanacaste() {

    const contador = document.getElementById(
        "contadorElementosGuanacaste"
    );

    if (!contador) {
        return;
    }

    const colocados = objetosColocados.length;
    const pendientes = elementosPendientesGuanacaste;

    contador.textContent =
        "Elementos colocados: " +
        colocados +
        (pendientes > 0
            ? " (cargando " + pendientes + ")"
            : "") +
        " / " +
        MAXIMO_ELEMENTOS;
}



 // ==========================================
 // OBTENER LÍMITES DEL ESCENARIO 3D
 // ==========================================

function limitesEscenarioGuanacaste() {

    const fallback = {
        minX: -2,
        maxX: 2,
        minY: -0.3,
        maxY: 1.5,
        minZ: -2,
        maxZ: 2
    };

    if (!terrenoGuanacaste) {
        return fallback;
    }

    const meshes = [];

    const recorrer = (entidad) => {

        if (
            entidad.render &&
            entidad.render.meshInstances
        ) {
            meshes.push(
                ...entidad.render.meshInstances
            );
        }

        entidad.children.forEach(recorrer);
    };

    recorrer(terrenoGuanacaste);

    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (const mesh of meshes) {

        const aabb = mesh.aabb;

        if (!aabb) continue;

        minX = Math.min(minX, aabb.getMin().x);
        minY = Math.min(minY, aabb.getMin().y);
        minZ = Math.min(minZ, aabb.getMin().z);

        maxX = Math.max(maxX, aabb.getMax().x);
        maxY = Math.max(maxY, aabb.getMax().y);
        maxZ = Math.max(maxZ, aabb.getMax().z);
    }

    return Number.isFinite(minX)
        ? {
            minX, maxX,
            minY, maxY,
            minZ, maxZ
        }
        : fallback;
}


// ==========================================
// INICIAR LLUVIA E INUNDACIÓN 3D
// ==========================================

function iniciarTormentaGuanacaste(alFinalizar, permitirInundacion = true) {

    limpiarTormentaGuanacaste();

    if (!guanacasteApp || !terrenoGuanacaste) {

        mostrarMensajeGuanacaste(
            "Espera a que termine de cargar el escenario."
        );

        return false;
    }

    const limites = limitesEscenarioGuanacaste();

    const ancho = Math.max(
        1,
        limites.maxX - limites.minX
    );

    const largo = Math.max(
        1,
        limites.maxZ - limites.minZ
    );

    const alto = Math.max(
        1,
        limites.maxY - limites.minY
    );

    const centroX =
        (limites.minX + limites.maxX) / 2;

    const centroZ =
        (limites.minZ + limites.maxZ) / 2;

    const token =
        ++generacionTormentaGuanacaste;

    // ==========================================
    // CONTENEDOR DE LA TORMENTA
    // ==========================================

    const raiz = new pc.Entity(
        "TormentaGuanacaste"
    );

    guanacasteApp.root.addChild(raiz);

    // ==========================================
    // CREAR AGUA 3D
    // ==========================================

    const agua = new pc.Entity(
        "InundacionGuanacaste"
    );

    agua.addComponent("render", {
        type: "box"
    });

    agua.setLocalScale(
        ancho * 0.93,
        0.15,
        largo * 0.93
    );

    agua.setLocalPosition(
        centroX,
        limites.minY - alto * 0.03,
        centroZ
    );

    const materialAgua =
        new pc.StandardMaterial();

    materialAgua.diffuse =
        new pc.Color(0.07, 0.37, 0.65);

    materialAgua.emissive =
        new pc.Color(0.015, 0.08, 0.13);

    materialAgua.opacity = 0.67;

    materialAgua.blendType =
        pc.BLEND_NORMAL;

    materialAgua.depthWrite = false;
    materialAgua.twoSided = true;

    materialAgua.update();

    agua.render.material = materialAgua;

    raiz.addChild(agua);

    // Mostrar inundación solamente en MEDIO o MALO
    agua.enabled = permitirInundacion;

    // ==========================================
    // CREAR GOTAS DE LLUVIA 3D
    // ==========================================

    const gotas = [];

    const materialLluvia =
        new pc.StandardMaterial();

    materialLluvia.diffuse =
        new pc.Color(0.62, 0.83, 1);

    materialLluvia.emissive =
        new pc.Color(0.16, 0.26, 0.38);

    materialLluvia.opacity = 0.72;

    materialLluvia.blendType =
        pc.BLEND_NORMAL;

    materialLluvia.depthWrite = false;

    materialLluvia.update();

    const cantidad = 180;

    const techo =
        limites.maxY + alto * 0.8;

    const suelo = limites.minY;

    for (let i = 0; i < cantidad; i++) {

        const gota = new pc.Entity(
            "GotaLluvia"
        );

        gota.addComponent("render", {
            type: "box"
        });

        gota.render.material =
            materialLluvia;

        const grosor = Math.max(
            0.005,
            Math.min(ancho, largo) * 0.003
        );

        gota.setLocalScale(
            grosor,
            grosor * 9,
            grosor
        );

        gota.setLocalPosition(

            centroX +
            (Math.random() - 0.5) * ancho,

            suelo +
            Math.random() * (techo - suelo),

            centroZ +
            (Math.random() - 0.5) * largo

        );

        raiz.addChild(gota);

        gotas.push(gota);
    }

    // ==========================================
    // OSCURECER ESCENARIO
    // ==========================================

    const intensidadOriginal =
        luzGuanacaste?.light?.intensity;

    if (luzGuanacaste?.light) {
        luzGuanacaste.light.intensity = 0.9;
    }

    const velocidad =
        (techo - suelo) / 1.1;

    // ==========================================
    // ANIMACIÓN POR FOTOGRAMA
    // ==========================================

    const actualizar = (dt) => {

        if (
            token !==
            generacionTormentaGuanacaste
        ) {
            return;
        }

        const tiempo = Math.min(

            1,

            (
                performance.now() -
                tormentaGuanacaste.inicio
            ) / DURACION_TORMENTA_GUANACASTE

        );

        // El agua sube progresivamente

        const nivel =
            limites.minY +
            alto * (0.02 + 0.43 * tiempo);

        agua.setLocalPosition(

            centroX,

            nivel +
            Math.sin(
                performance.now() * 0.003
            ) * alto * 0.005,

            centroZ

        );

        // Movimiento de las gotas

        gotas.forEach((gota) => {

            const p =
                gota.getLocalPosition();

            let y =
                p.y -
                velocidad * Math.min(dt, 0.1);

            if (
                y < Math.max(suelo, nivel)
            ) {

                y =
                    techo +
                    Math.random() * alto * 0.3;

            }

            gota.setLocalPosition(
                p.x,
                y,
                p.z
            );

        });
    };

    // ==========================================
    // GUARDAR ESTADO
    // ==========================================

    tormentaGuanacaste = {

        raiz,

        actualizar,

        inicio: performance.now(),

        intensidadOriginal,

        materialAgua,

        materialLluvia

    };

    callbackTormentaGuanacaste =
        actualizar;

    guanacasteApp.on(
        "update",
        actualizar
    );

    simulacionGuanacasteActiva = true;

    // Iniciar sonidos según el resultado
    reproducirSonidosTormentaGuanacaste(permitirInundacion);

    // ==========================================
    // BLOQUEAR CONTROLES
    // ==========================================

    const boton = document.getElementById(
        "btnEvaluarGuanacaste"
    );

    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "🌧️ Simulando lluvia e inundación...";
    }

    document.querySelectorAll(
        ".botonElementoGuanacaste"
    ).forEach(boton => {

        boton.disabled = true;

    });

    // ==========================================
    // FINALIZAR DESPUÉS DE 10 SEGUNDOS
    // ==========================================

    temporizadorTormentaGuanacaste =
        setTimeout(() => {

            if (
                token !==
                generacionTormentaGuanacaste
            ) {
                return;
            }

            limpiarTormentaGuanacaste();

            if (
                typeof alFinalizar === "function"
            ) {
                alFinalizar();
            }

        }, DURACION_TORMENTA_GUANACASTE);

    return true;
}


// ==========================================
// ELIMINAR EFECTOS Y REINICIAR TORMENTA
// ==========================================

function limpiarTormentaGuanacaste() {

    detenerSonidosTormentaGuanacaste();

    ++generacionTormentaGuanacaste;

    // Cancelar temporizador

    if (
        temporizadorTormentaGuanacaste !== null
    ) {

        clearTimeout(
            temporizadorTormentaGuanacaste
        );

        temporizadorTormentaGuanacaste =
            null;
    }

    // Detener actualización 3D

    if (
        guanacasteApp &&
        callbackTormentaGuanacaste
    ) {

        guanacasteApp.off(
            "update",
            callbackTormentaGuanacaste
        );
    }

    callbackTormentaGuanacaste = null;

    // Eliminar lluvia y agua

    if (tormentaGuanacaste) {

        if (
            luzGuanacaste?.light &&
            tormentaGuanacaste.intensidadOriginal !==
                undefined
        ) {

            luzGuanacaste.light.intensity =
                tormentaGuanacaste.intensidadOriginal;
        }

        tormentaGuanacaste.raiz.destroy();

        tormentaGuanacaste.materialAgua.destroy();

        tormentaGuanacaste.materialLluvia.destroy();

        tormentaGuanacaste = null;
    }

    simulacionGuanacasteActiva = false;
}


// ==========================================
// EVALUAR TERRENO
// ==========================================



function evaluarTerrenoGuanacaste() {

    if (dialogosGuanacasteActivos) {
        return;
    }

    if (
        actividadGuanacasteEvaluada ||
        simulacionGuanacasteActiva
    ) {
        return;
    }

    // Esperar modelos pendientes.
    if (elementosPendientesGuanacaste > 0) {

        mostrarMensajeGuanacaste(
            "Espera a que terminen de cargar los elementos."
        );

        return;
    }

    // Evitar evaluar un terreno sin elementos.
    if (objetosColocados.length === 0) {

        mostrarMensajeGuanacaste(
            "Coloca al menos un elemento antes de evaluar."
        );

        return;
    }

    // Mantener puntuación como dato informativo.
    puntuacionGuanacaste = objetosColocados.reduce(
        (total, objeto) =>
            total + (valoresElementos[objeto.tipo] || 0),
        0
    );

    // La calificación depende de los elementos negativos.
    const negativos = obtenerConteoNegativosGuanacaste();

    let tipo;
    let mensaje;

    if (negativos === 0) {

        tipo = "bueno";

        mensaje =
            "✅ ¡Buen trabajo! No colocaste elementos " +
            "perjudiciales para el terreno.";

    } else if (
        negativos < UMBRAL_NEGATIVOS_MALO_GUANACASTE
    ) {

        tipo = "medio";

        mensaje =
            "🟡 Colocaste " + negativos +
            " elemento(s) negativo(s). " +
            "El terreno sigue siendo vulnerable.";

    } else {

        tipo = "riesgo";

        mensaje =
            "⚠️ Colocaste " + negativos +
            " elementos negativos. " +
            "El terreno presenta un alto riesgo ambiental.";
    }

    console.log("Evaluación Guanacaste:", {
        total: objetosColocados.length,
        negativos: negativos,
        puntuacion: puntuacionGuanacaste,
        resultado: tipo
    });

    // La inundación ocurre solamente en MEDIO o MALO.
    const permitirInundacion = tipo !== "bueno";

    const iniciada = iniciarTormentaGuanacaste(
        () => {
            mostrarResultadoGuanacaste(
                tipo,
                mensaje
            );
        },
        permitirInundacion
    );

    if (iniciada) {
        actividadGuanacasteEvaluada = true;
    }
}



// ==========================================
// MOSTRAR RETROALIMENTACIÓN - GUANACASTE
// ==========================================

function mostrarResultadoGuanacaste(tipo, mensaje) {

    const resultado = document.getElementById(
        "resultadoGuanacaste"
    );

    if (!resultado) {
        console.error("No existe resultadoGuanacaste");
        return;
    }

    // Determinar nivel de evaluación
    let nivel = "MALO";
    let claseNivel = "resultadoMaloGuanacaste";

    if (tipo === "bueno") {

        nivel = "BUENO";
        claseNivel = "resultadoBuenoGuanacaste";

    } else if (tipo === "medio") {

        nivel = "MEDIO";
        claseNivel = "resultadoMedioGuanacaste";

    }

    // Reproducir música según la calificación
    reproducirSonidoResultadoGuanacaste(
        nivel.toLowerCase()
    );

    // Construir contenido
    resultado.innerHTML = `
        <div class="contenidoResultadoGuanacaste">

            <h2>Resultado de la actividad</h2>

            <h3
                id="nivelFinalGuanacaste"
                class="${claseNivel}"
            >
                ${nivel}
            </h3>

            <p id="retroalimentacionFinalGuanacaste"></p>

            <p class="resumenResultadoGuanacaste">
                Elementos colocados:
                ${objetosColocados.length} / ${MAXIMO_ELEMENTOS}
            </p>

            <button
                id="continuarResultadoGuanacaste"
                type="button"
            >
                Continuar
            </button>

        </div>
    `;

    // Mostrar mensaje de retroalimentación
    document.getElementById(
        "retroalimentacionFinalGuanacaste"
    ).textContent = mensaje;

    // Configurar botón continuar
    document.getElementById(
        "continuarResultadoGuanacaste"
    ).addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        cerrarResultadoGuanacaste();

    });

    // Mostrar ventana
    resultado.style.display = "flex";
}


// ==========================================
// FINALIZAR ACTIVIDAD Y VOLVER A REGIONES
// ==========================================

function cerrarResultadoGuanacaste() {

    limpiarTormentaGuanacaste();
    detenerSonidoResultadoGuanacaste();

    const resultado = document.getElementById(
        "resultadoGuanacaste"
    );

    const actividad = document.getElementById(
        "actividadGuanacaste"
    );

    const escenarioPrincipal = document.getElementById(
        "escenarioPrincipal"
    );

    // Ocultar retroalimentación
    if (resultado) {
        resultado.style.display = "none";
    }

    // Ocultar Guanacaste
    if (actividad) {
        actividad.style.display = "none";
    }

    // Reiniciar estado para una nueva partida
    reiniciarActividadGuanacaste();

    // Volver a seleccionar región
    if (escenarioPrincipal) {
        escenarioPrincipal.style.display = "flex";
    }

    console.log(
        "Actividad Guanacaste finalizada. Regresando a regiones."
    );
}

// ==========================================
// REINICIAR ACTIVIDAD GUANACASTE
// ==========================================



function reiniciarActividadGuanacaste() {

    // ==========================================
    // REINICIAR DIÁLOGOS DE LA GUACAMAYA
    // ==========================================

    dialogosGuanacasteActivos = false;
    dialogoGuanacasteActual = 0;

    // Ocultar cuadro de diálogo anterior
    if (
        typeof dialogBox !== "undefined" &&
        dialogBox
    ) {
        dialogBox.style.display = "none";
    }

    // Restaurar texto del botón
    if (
        typeof nextDialogBtn !== "undefined" &&
        nextDialogBtn
    ) {
        nextDialogBtn.textContent = "Continuar ►";
    }

    // ==========================================
    // LIMPIAR TEMPORIZADOR DE MENSAJES
    // ==========================================

    if (temporizadorMensajeGuanacaste !== null) {
        clearTimeout(temporizadorMensajeGuanacaste);
        temporizadorMensajeGuanacaste = null;
    }

    // Invalidar modelos pendientes de partidas anteriores.
    ++generacionElementosGuanacaste;

    elementosPendientesGuanacaste = 0;

    // Detener simulación y sonidos.
    limpiarTormentaGuanacaste();

    detenerSonidoResultadoGuanacaste();

    // Eliminar todos los modelos colocados.
    objetosColocados.forEach(objeto => {

        if (objeto.entidad) {
            objeto.entidad.destroy();
        }
    });

    // Reiniciar registros.
    objetosColocados = [];

    objetoSeleccionado = null;

    puntuacionGuanacaste = 0;

    // Reiniciar estados.
    actividadGuanacasteEvaluada = false;

    actividadGuanacasteIniciada = Boolean(guanacasteApp);

    // Ocultar y limpiar resultado anterior.
    const resultado = document.getElementById(
        "resultadoGuanacaste"
    );

    if (resultado) {
        resultado.style.display = "none";
        resultado.innerHTML = "";
    }

    // Limpiar mensajes.
    const mensaje = document.getElementById(
        "mensajeGuanacaste"
    );

    if (mensaje) {

        mensaje.textContent = "";

        mensaje.classList.remove(
            "mostrarMensajeGuanacaste"
        );
    }

    // Reconstruir los controles.
    crearInterfazGuanacaste();

    // Actualizar contador y botón.
    actualizarContadorGuanacaste();

    actualizarDisponibilidadEvaluacionGuanacaste();

    console.log(
        "Guanacaste reiniciado: sin elementos ni cargas pendientes."
    );
}


// ==========================================
// MENSAJE
// ==========================================


function mostrarMensajeGuanacaste(mensaje) {

    const mensajeElement = document.getElementById(
        "mensajeGuanacaste"
    );

    if (!mensajeElement) {
        return;
    }

    if (temporizadorMensajeGuanacaste !== null) {
        clearTimeout(temporizadorMensajeGuanacaste);
    }

    mensajeElement.textContent = mensaje;

    mensajeElement.classList.add(
        "mostrarMensajeGuanacaste"
    );

    temporizadorMensajeGuanacaste = setTimeout(() => {

        mensajeElement.classList.remove(
            "mostrarMensajeGuanacaste"
        );

        temporizadorMensajeGuanacaste = null;

    }, 2500);
}



// ==========================================
// REDIMENSIONAR
// ==========================================

function redimensionarActividadGuanacaste() {

    if (!guanacasteApp) {
        return;
    }


    const canvas =
        document.getElementById(
            "guanacasteCanvas"
        );


    if (!canvas) {
        return;
    }


    const ancho =
        canvas.clientWidth;


    const alto =
        canvas.clientHeight;


    if (
        ancho <= 0 ||
        alto <= 0
    ) {

        return;

    }


    canvas.width =
        ancho;


    canvas.height =
        alto;


    guanacasteApp.resizeCanvas(

        ancho,

        alto

    );
}

// ==========================================
// MENÚ DE PAUSA - GUANACASTE
// ==========================================

function configurarMenuPausaGuanacaste() {

    const boton = document.getElementById("menuPausaGuanacaste");

    if (!boton) {
        console.error("No se encontró el botón de pausa de Guanacaste.");
        return;
    }

    boton.onclick = function(event) {

        event.preventDefault();
        event.stopPropagation();

        abrirMenuPausa();

    };
}


