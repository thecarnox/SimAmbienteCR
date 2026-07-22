// ==========================================
// PERSONAJE 3D
// ==========================================

let characterApp = null;
let personaje = null;

let tiempo = 0;
let posicionInicial = null;

let hablando = false;
let tiempoHabla = 0;

function crearPersonaje3D() {

    // Evitar crear varias veces la escena
    if (characterApp) return;

    const canvas = document.getElementById("characterCanvas");

    characterApp = new pc.Application(canvas);

    characterApp.setCanvasFillMode(pc.FILLMODE_NONE);
    characterApp.setCanvasResolution(pc.RESOLUTION_AUTO);

    characterApp.start();

    // Fondo transparente
    characterApp.scene.ambientLight = new pc.Color(1,1,1);

    //----------------------------------
    // Cámara
    //----------------------------------

    const camera = new pc.Entity();

    camera.addComponent("camera",{

        clearColor:new pc.Color(0,0,0,0)

    });

    camera.setPosition(0,1,3);

    characterApp.root.addChild(camera);

    //----------------------------------
    // Luz
    //----------------------------------

   const light = new pc.Entity();

    light.addComponent("light",{

        type: "directional",

        intensity: 3,

        castShadows: true

    });

    light.setEulerAngles(45, 35, 0);

    characterApp.root.addChild(light);

    const fillLight = new pc.Entity();

    fillLight.addComponent("light",{

        type: "omni",

        intensity: 1.5,

        range: 10

    });

    fillLight.setLocalPosition(2, 2, 2);

    characterApp.root.addChild(fillLight);

    //----------------------------------
    // Cargar GLB
    //----------------------------------

    characterApp.assets.loadFromUrl(

        "models/perezoso.glb",

        "container",

        function(err, asset){

            if(err){

                console.error(err);

                return;

            }

            personaje = asset.resource.instantiateRenderEntity();

            characterApp.root.addChild(personaje);

            posicionInicial = personaje.getLocalPosition().clone();

            // ==========================================
            // AJUSTAR AUTOMÁTICAMENTE EL MODELO
            // ==========================================

            // Obtener el RenderComponent
            const render = personaje.findComponent("render");

            if (render) {

                // Obtener el tamaño del modelo
                const aabb = render.meshInstances[0].aabb;

                const centro = aabb.center.clone();

                const tamano = aabb.halfExtents.length() * 2;

                // Centrar el modelo
                personaje.setPosition(
                    -centro.x,
                    -centro.y,
                    -centro.z
                );

                // Colocar la cámara automáticamente
                camera.setPosition(
                    0,
                    tamano * 0.6,
                    tamano * 2.2
                );

                camera.lookAt(0, tamano * 0.3, 0);

            }

            console.log("Perezoso cargado correctamente.");

        }

    );

    // ==========================================
    // Respiración
    // ==========================================

    characterApp.on("update", function (dt) {

    if (!personaje) return;

    tiempo += dt;

    // Respiración suave
    personaje.setLocalPosition(
        posicionInicial.x,
        posicionInicial.y + Math.sin(tiempo * 2) * 0.03,
        posicionInicial.z
    );



});

}