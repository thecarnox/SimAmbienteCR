
// ==========================================
// PERSONAJE 3D - MONO Y PEREZOSO
// ==========================================

let characterApp = null;
let personaje = null;

let tiempo = 0;
let posicionInicial = null;
let rotacionInicial = null;
let escalaInicial = null;

// Control de carga para evitar modelos duplicados
let solicitudPersonaje = 0;


// ==========================================
// CREAR ESCENA DEL PERSONAJE
// ==========================================

function crearPersonaje3D(modelo = "models/perezoso.glb") {

    if (!characterApp) {

        const canvas = document.getElementById("characterCanvas");

        if (!canvas) {
            console.error("No se encontró characterCanvas");
            return;
        }

        characterApp = new pc.Application(canvas, {
            graphicsDeviceOptions: {
                alpha: true
            }
        });

        characterApp.setCanvasFillMode(pc.FILLMODE_NONE);
        characterApp.setCanvasResolution(pc.RESOLUTION_AUTO);

        // ==================================
        // LUZ AMBIENTAL
        // ==================================

        characterApp.scene.ambientLight =
            new pc.Color(1, 1, 1);

        // ==================================
        // CÁMARA
        // ==================================

        const camera = new pc.Entity("CameraPersonaje");

        camera.addComponent("camera", {
            clearColor: new pc.Color(0, 0, 0, 0)
        });

        camera.setPosition(0, 1, 3);

        characterApp.root.addChild(camera);

        // ==================================
        // LUZ PRINCIPAL
        // ==================================

        const light = new pc.Entity("LuzPersonaje");

        light.addComponent("light", {
            type: "directional",
            intensity: 3,
            castShadows: true
        });

        light.setEulerAngles(45, 35, 0);

        characterApp.root.addChild(light);

        // ==================================
        // LUZ DE RELLENO
        // ==================================

        const fillLight = new pc.Entity("LuzRellenoPersonaje");

        fillLight.addComponent("light", {
            type: "omni",
            intensity: 1.5,
            range: 10
        });

        fillLight.setLocalPosition(2, 2, 2);

        characterApp.root.addChild(fillLight);

        // ==================================
        // ANIMACIÓN DEL PERSONAJE
        // ==================================

        characterApp.on("update", function(dt) {

            if (
                !personaje ||
                !posicionInicial ||
                !rotacionInicial ||
                !escalaInicial
            ) {
                return;
            }

            tiempo += dt;

            // Movimiento vertical suave
            const movimientoVertical =
                Math.sin(tiempo * 1.8) * 0.035;

            personaje.setLocalPosition(
                posicionInicial.x,
                posicionInicial.y + movimientoVertical,
                posicionInicial.z
            );

            // Balanceo lateral
            const balanceo =
                Math.sin(tiempo * 1.3) * 3;

            // Giro suave
            const giro =
                Math.sin(tiempo * 0.8) * 5;

            personaje.setLocalEulerAngles(
                rotacionInicial.x,
                rotacionInicial.y + giro,
                rotacionInicial.z + balanceo
            );

            // Respiración
            const respiracion =
                1 + Math.sin(tiempo * 2.2) * 0.012;

            personaje.setLocalScale(
                escalaInicial.x * respiracion,
                escalaInicial.y * respiracion,
                escalaInicial.z * respiracion
            );

        });

        characterApp.start();
    }

    // Cargar el modelo solicitado
    cargarModeloPersonaje(modelo);
}


// ==========================================
// CARGAR MONO O PEREZOSO
// ==========================================

function cargarModeloPersonaje(modelo) {

    if (!characterApp) {
        return;
    }

    // Identificador de esta solicitud
    const solicitudActual = ++solicitudPersonaje;

    // Eliminar modelo anterior
    if (personaje) {
        personaje.destroy();
        personaje = null;
    }

    posicionInicial = null;
    rotacionInicial = null;
    escalaInicial = null;
    tiempo = 0;

    characterApp.assets.loadFromUrl(
        modelo,
        "container",
        function(err, asset) {

            // Ignorar cargas antiguas si cambió el guía
            if (solicitudActual !== solicitudPersonaje) {
                return;
            }

            if (err || !asset || !asset.resource) {
                console.error(
                    "Error cargando personaje:",
                    modelo,
                    err
                );
                return;
            }

            personaje = asset.resource.instantiateRenderEntity();

            characterApp.root.addChild(personaje);

            // ==================================
            // CENTRAR MODELO Y AJUSTAR CÁMARA
            // ==================================

            const render = personaje.findComponent("render");

            if (render && render.meshInstances.length > 0) {

                const aabb = render.meshInstances[0].aabb;

                const centro = aabb.center.clone();

                const tamano = aabb.halfExtents.length() * 2;

                // Identificar si el personaje es el mono
                const esMono = modelo.toLowerCase().includes("mono.glb");

                // Ajustar altura únicamente del mono
                const ajusteAltura = esMono ? -tamano * 0.15 : 0;

                personaje.setPosition(
                    -centro.x,
                    -centro.y + ajusteAltura,
                    -centro.z
                );

                const camera =
                    characterApp.root.findByName("CameraPersonaje");

                if (camera) {

                    // Distancia de cámara
                    const distanciaCamara = tamano * 3;

                    camera.setPosition(
                        0,
                        tamano * 0.45,
                        distanciaCamara
                    );

                    // Altura visual del personaje
                    camera.lookAt(
                        0,
                        tamano * 0.10,
                        0
                    );
                }
            }

            // ==================================
            // ESCALA DEL PERSONAJE
            // ==================================

            // Cambia este valor para agrandarlo
            const escalaPersonaje = 3;

            personaje.setLocalScale(
                escalaPersonaje,
                escalaPersonaje,
                escalaPersonaje
            );

            // ==================================
            // GUARDAR VALORES PARA ANIMACIÓN
            // ==================================

            posicionInicial =
                personaje.getLocalPosition().clone();

            rotacionInicial =
                personaje.getLocalEulerAngles().clone();

            escalaInicial =
                personaje.getLocalScale().clone();

            tiempo = 0;

            console.log(
                "Personaje cargado correctamente:",
                modelo
            );
        }
    );
}
