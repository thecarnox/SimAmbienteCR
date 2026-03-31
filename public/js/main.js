// --------------------
// ELEMENTOS HTML
// --------------------
const canvas = document.getElementById('application-canvas');
const startBtn = document.getElementById('startBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const menu = document.getElementById('menu');
const bgSound = document.getElementById('bgSound');

// --------------------
// CREAR APP PLAYCANVAS
// --------------------
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// --------------------
// BOTÓN INICIAR JUEGO
// --------------------
startBtn.addEventListener('click', () => {

    // 🎵 SONIDO
    bgSound.volume = 0.5;
    bgSound.play();

    // 🎬 FADE OUT MENÚ
    menu.classList.add('fade-out');

    setTimeout(() => {

        menu.style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('fade-in');

        app.start();

        // --------------------
        // 🎥 CÁMARA FIJA + ZOOM REAL
        // --------------------
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.5, 0.7, 0.9)
        });

        // 🔥 DIRECCIÓN BASE (tu posición original)
        const direction = new pc.Vec3(0, 30, 10).normalize();

        let distance = 1; // zoom inicial

        function updateCamera() {
            const pos = direction.clone().scale(distance * 30);
            camera.setPosition(pos);
            camera.lookAt(0, 0, 0);
        }

        updateCamera();
        app.root.addChild(camera);

        // --------------------
        // 🔍 ZOOM CON SCROLL
        // --------------------
        canvas.addEventListener('wheel', (e) => {

            distance += e.deltaY * 0.001;

            // 🔥 LIMITES DE ZOOM
            distance = Math.max(0.3, Math.min(2, distance));

            updateCamera();
        });

        // --------------------
        // ☀️ LUZ
        // --------------------
        const light = new pc.Entity('light');
        light.addComponent('light', {
            type: 'directional',
            intensity: 1.2,
            castShadows: true
        });

        light.setEulerAngles(45, 30, 0);
        app.root.addChild(light);

        // --------------------
        // 🌊 AGUA INFINITA
        // --------------------
        const water = new pc.Entity('water');
        water.addComponent('model', {
            type: 'plane'
        });

        water.setLocalScale(500, 1, 500);
        water.setPosition(0, -1, 0);

        const waterMaterial = new pc.StandardMaterial();
        waterMaterial.diffuse = new pc.Color(0, 0.3, 0.6);
        waterMaterial.opacity = 0.9;
        waterMaterial.blendType = pc.BLEND_NORMAL;
        waterMaterial.update();

        water.model.meshInstances[0].material = waterMaterial;

        app.root.addChild(water);

        // --------------------
        // 🏝️ CARGAR MODELO GLB
        // --------------------
        app.assets.loadFromUrl("models/costa_rica.glb", "container", function (err, asset) {

            if (err) {
                console.error("Error cargando modelo:", err);
                return;
            }

            const entity = asset.resource.instantiateRenderEntity();

            entity.setLocalScale(2, 2, 2);

            // 🔥 CENTRO EXACTO
            entity.setPosition(0, 0, 0);

            app.root.addChild(entity);
        });

    }, 1000);
});

// --------------------
// 🖥️ PANTALLA COMPLETA
// --------------------
fullscreenBtn.addEventListener('click', () => {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

});