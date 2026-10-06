// ==========================================
// ACTIVIDAD 4 - GUANACASTE
// RECUPERA EL TERRENO
// ESCENARIO 3D
// ==========================================

// ==========================================
// PLAYCANVAS
// ==========================================

let guanacasteApp = null;

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
// VALORES AMBIENTALES
// ==========================================

const valoresElementos = {

    arbol: 2,

    arbusto: 2,

    pasto: 1,

    roca: 1,

    basura: -2

};


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

        console.log(
            "La actividad ya está iniciada."
        );

        redimensionarActividadGuanacaste();

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

    if (
        objetosColocados.length >=
        MAXIMO_ELEMENTOS
    ) {

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
// COLOCAR ELEMENTO
// ==========================================

// ==========================================
// COLOCAR ELEMENTO EN EL PUNTO DEL CLIC
// ==========================================

function colocarElementoGuanacaste(event) {

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
        objetosColocados.length >=
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

function cargarElementoGuanacaste(

    tipo,
    x,
    z,
    y

) {

    const ruta =
        modelosGuanacaste[
            tipo
        ];


    console.log(
        "Cargando:",
        tipo,
        ruta
    );


    guanacasteApp.assets.loadFromUrl(

        ruta,

        "container",

        function(
            error,
            asset
        ) {

            if (error) {

                console.error(
                    "Error cargando:",
                    tipo
                );

                console.error(
                    error
                );

                return;

            }


            // ==========================================
            // CREAR MODELO
            // ==========================================

            const modelo =
                asset.resource
                    .instantiateRenderEntity();


            // ==========================================
            // CREAR CONTENEDOR
            // ==========================================

            const contenedor =
                new pc.Entity(
                    "Elemento_" +
                    tipo
                );


            guanacasteApp.root.addChild(
                contenedor
            );


            contenedor.addChild(
                modelo
            );


            // ==========================================
            // POSICIÓN
            // ==========================================

            contenedor.setLocalPosition(

                x,

                y,

                z

            );


            // ==========================================
            // ESCALA
            // ==========================================

            modelo.setLocalScale(

                0.5,
                0.5,
                0.5

            );


            // ==========================================
            // GUARDAR
            // ==========================================

            objetosColocados.push({
                
                tipo: tipo,

                entidad: contenedor,

                valor:
                    valoresElementos[
                        tipo
                    ]

            });

            actualizarContadorGuanacaste();

            console.log(
                "Elemento colocado:",
                tipo
            );

        }

    );
}


// ==========================================
// ACTUALIZAR CONTADOR
// ==========================================

function actualizarContadorGuanacaste() {

    const contador =
        document.getElementById(
            "contadorElementosGuanacaste"
        );


    if (!contador) {
        return;
    }


    contador.textContent =

        "Elementos colocados: " +

        objetosColocados.length +

        " / " +

        MAXIMO_ELEMENTOS;
}


// ==========================================
// EVALUAR TERRENO
// ==========================================

function evaluarTerrenoGuanacaste() {

    if (
        actividadGuanacasteEvaluada
    ) {

        return;

    }


    // ==========================================
    // COMPROBAR ELEMENTOS
    // ==========================================

    if (
        objetosColocados.length === 0
    ) {

        mostrarResultadoGuanacaste(

            "riesgo",

            "⚠️ El terreno continúa en riesgo de erosión."

        );

        actividadGuanacasteEvaluada =
            true;

        return;

    }


    // ==========================================
    // CALCULAR PUNTOS
    // ==========================================

    puntuacionGuanacaste = 0;


    let vegetacion = 0;


    objetosColocados.forEach(
        objeto => {

            puntuacionGuanacaste +=
                objeto.valor;


            if (

                objeto.tipo ===
                    "arbol" ||

                objeto.tipo ===
                    "arbusto" ||

                objeto.tipo ===
                    "pasto"

            ) {

                vegetacion++;

            }

        }
    );


    console.log(
        "Puntuación:",
        puntuacionGuanacaste
    );


    console.log(
        "Vegetación:",
        vegetacion
    );


    // ==========================================
    // RESULTADO BUENO
    // ==========================================

    if (

        vegetacion >= 3 &&

        puntuacionGuanacaste >= 5

    ) {

        mostrarResultadoGuanacaste(

            "bueno",

            "✅ ¡Buen trabajo! La cobertura vegetal ayuda a disminuir la erosión del suelo."

        );

    }


    // ==========================================
    // RESULTADO MEDIO
    // ==========================================

    else if (

        vegetacion >= 1

    ) {

        mostrarResultadoGuanacaste(

            "medio",

            "🟡 Buen trabajo, pero aún hay zonas vulnerables."

        );

    }


    // ==========================================
    // RESULTADO BAJO
    // ==========================================

    else {

        mostrarResultadoGuanacaste(

            "riesgo",

            "⚠️ El terreno continúa en riesgo de erosión."

        );

    }


    actividadGuanacasteEvaluada =
        true;
}


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultadoGuanacaste(

    tipo,
    mensaje

) {

    const resultado =
        document.getElementById(
            "resultadoGuanacaste"
        );


    if (!resultado) {
        return;
    }


    resultado.style.display =
        "flex";


    resultado.className =
        "resultadoGuanacaste " +
        tipo;


    resultado.innerHTML =

        "<div>" +

        "<h2>Resultado</h2>" +

        "<p>" +
        mensaje +
        "</p>" +

        "<p>" +
        "Elementos colocados: " +
        objetosColocados.length +
        " / " +
        MAXIMO_ELEMENTOS +
        "</p>" +

        "<button onclick='cerrarResultadoGuanacaste()'>" +
        "Continuar" +
        "</button>" +

        "</div>";
}


// ==========================================
// CERRAR RESULTADO
// ==========================================

function cerrarResultadoGuanacaste() {

    const resultado =
        document.getElementById(
            "resultadoGuanacaste"
        );


    if (!resultado) {
        return;
    }


    resultado.style.display =
        "none";
}


// ==========================================
// MENSAJE
// ==========================================

function mostrarMensajeGuanacaste(
    mensaje
) {

    const mensajeElement =
        document.getElementById(
            "mensajeGuanacaste"
        );


    if (!mensajeElement) {
        return;
    }


    mensajeElement.textContent =
        mensaje;


    mensajeElement.classList.add(
        "mostrarMensajeGuanacaste"
    );


    setTimeout(
        function() {

            mensajeElement.classList.remove(
                "mostrarMensajeGuanacaste"
            );

        },
        2500
    );
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

    const boton =
        document.getElementById(
            "menuPausaGuanacaste"
        );

    if (!boton) {

        console.error(
            "No se encontró #menuPausaGuanacaste."
        );

        return;
    }

    boton.addEventListener(
        "click",
        abrirMenuPausa
    );
}