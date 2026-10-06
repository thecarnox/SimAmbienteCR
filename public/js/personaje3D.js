// ==========================================
// PERSONAJE 3D
// ==========================================

let characterApp = null;
let personaje = null;

let tiempo = 0;
let posicionInicial = null;


// ==========================================
// CREAR ESCENA DEL PERSONAJE
// ==========================================

function crearPersonaje3D(
    modelo = "models/perezoso.glb"
) {

    // ======================================
    // CREAR PLAYCANVAS UNA SOLA VEZ
    // ======================================

    if (!characterApp) {

        const canvas =
            document.getElementById(
                "characterCanvas"
            );

        characterApp =
            new pc.Application(
                canvas
            );

        characterApp.setCanvasFillMode(
            pc.FILLMODE_NONE
        );

        characterApp.setCanvasResolution(
            pc.RESOLUTION_AUTO
        );

        characterApp.start();


        // ==================================
        // LUZ AMBIENTAL
        // ==================================

        characterApp.scene.ambientLight =
            new pc.Color(
                1,
                1,
                1
            );


        // ==================================
        // CÁMARA
        // ==================================

        const camera =
            new pc.Entity(
                "CameraPersonaje"
            );

        camera.addComponent(
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

        camera.setPosition(
            0,
            1,
            3
        );

        characterApp.root.addChild(
            camera
        );


        // ==================================
        // LUZ PRINCIPAL
        // ==================================

        const light =
            new pc.Entity(
                "LuzPersonaje"
            );

        light.addComponent(
            "light",
            {
                type: "directional",
                intensity: 3,
                castShadows: true
            }
        );

        light.setEulerAngles(
            45,
            35,
            0
        );

        characterApp.root.addChild(
            light
        );


        // ==================================
        // LUZ DE RELLENO
        // ==================================

        const fillLight =
            new pc.Entity(
                "LuzRellenoPersonaje"
            );

        fillLight.addComponent(
            "light",
            {
                type: "omni",
                intensity: 1.5,
                range: 10
            }
        );

        fillLight.setLocalPosition(
            2,
            2,
            2
        );

        characterApp.root.addChild(
            fillLight
        );


        // ==================================
        // ANIMACIÓN DEL PERSONAJE
        // ==================================

        characterApp.on(
            "update",
            function(dt) {

                if (
                    !personaje ||
                    !posicionInicial
                ) {
                    return;
                }

                tiempo += dt;

                personaje.setLocalPosition(

                    posicionInicial.x,

                    posicionInicial.y +
                    Math.sin(
                        tiempo * 2
                    ) * 0.03,

                    posicionInicial.z

                );

            }
        );

    }


    // ======================================
    // CARGAR MODELO SOLICITADO
    // ======================================

    cargarModeloPersonaje(
        modelo
    );

}


// ==========================================
// CAMBIAR MODELO DEL PERSONAJE
// ==========================================

function cargarModeloPersonaje(
    modelo
) {

    if (!characterApp) {
        return;
    }


    // ======================================
    // ELIMINAR PERSONAJE ANTERIOR
    // ======================================

    if (personaje) {

        personaje.destroy();

        personaje = null;

        posicionInicial = null;

    }


    // ======================================
    // CARGAR NUEVO GLB
    // ======================================

    characterApp.assets.loadFromUrl(

        modelo,

        "container",

        function(err, asset) {

            if (err) {

                console.error(
                    "Error cargando personaje:",
                    modelo,
                    err
                );

                return;
            }


            personaje =
                asset.resource
                    .instantiateRenderEntity();


            characterApp.root.addChild(
                personaje
            );


            // ==================================
            // BUSCAR COMPONENTE RENDER
            // ==================================

            const render =
                personaje.findComponent(
                    "render"
                );


            if (
                render &&
                render.meshInstances.length > 0
            ) {

                const aabb =
                    render.meshInstances[0]
                        .aabb;

                const centro =
                    aabb.center.clone();

                const tamano =
                    aabb.halfExtents
                        .length() * 2;


                // ==================================
                // CENTRAR MODELO
                // ==================================

                personaje.setPosition(

                    -centro.x,
                    -centro.y,
                    -centro.z

                );


                // ==================================
                // OBTENER CÁMARA
                // ==================================

                const camera =
                    characterApp.root.findByName(
                        "CameraPersonaje"
                    );


                if (camera) {

                    camera.setPosition(

                        0,

                        tamano * 0.6,

                        tamano * 2.2

                    );

                    camera.lookAt(

                        0,

                        tamano * 0.3,

                        0

                    );

                }

            }


            // Guardar posición para
            // la animación de respiración

            posicionInicial =
                personaje
                    .getLocalPosition()
                    .clone();


            console.log(
                "Personaje cargado:",
                modelo
            );

        }

    );

}