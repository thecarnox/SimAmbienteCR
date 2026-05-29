// --------------------
// ELEMENTOS HTML
// --------------------
const canvas = document.getElementById('application-canvas');
const startBtn = document.getElementById('startBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const menu = document.getElementById('menu');
const bgSound = document.getElementById('bgSound');
//TOCAR MAPA const clickMessage = document.getElementById('clickMessage');

const mapBtn = document.getElementById('mapBtn');
const mapDiv = document.getElementById('map');
const rightPanel = document.getElementById('rightPanel');


let mapInstance = null;
//Desertico
let currentLayer = null;

//habilitar mapa
let mapUnlocked = false;

// --------------------
// CREAR APP PLAYCANVAS
// --------------------
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// referencia al modelo
let mapEntity = null;

// --------------------
// BOTÓN INICIAR JUEGO
// --------------------
startBtn.addEventListener('click', () => {

    // 🎵 SONIDO
    bgSound.volume = 0.5;
    bgSound.play();

    // 🎬 FADE OUT
    menu.classList.add('fade-out');

    setTimeout(() => {

        menu.style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('fade-in');

        app.start();

        // --------------------
        // 🎥 CÁMARA
        // --------------------
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.5, 0.7, 0.9)
        });

        const direction = new pc.Vec3(0, 30, 10).normalize();
        let distance = 1;

        function updateCamera() {
            const pos = direction.clone().scale(distance * 30);
            camera.setPosition(pos);
            camera.lookAt(0, 0, 0);
        }

        updateCamera();
        app.root.addChild(camera);

        // --------------------
        // 🔍 ZOOM
        // --------------------
        canvas.addEventListener('wheel', (e) => {

            e.preventDefault();

            distance += e.deltaY * 0.001;
            distance = Math.max(0.3, Math.min(1, distance));

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
        // 🌊 AGUA
        // --------------------
        const water = new pc.Entity('water');
        water.addComponent('model', { type: 'plane' });

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
        // 🏝️ CARGAR GLB
        // --------------------
        app.assets.loadFromUrl("models/costa_rica.glb", "container", function (err, asset) {

            if (err) {
                console.error("Error cargando modelo:", err);
                return;
            }

            mapEntity = asset.resource.instantiateRenderEntity();

            mapEntity.setLocalScale(2, 2, 2);
            mapEntity.setPosition(0, 0, 0);
            mapEntity.name = "mapa";

            app.root.addChild(mapEntity);
        });

        // --------------------
        // 🖱️ CLICK SOBRE EL GLB
        // --------------------
        canvas.addEventListener('mousedown', (event) => {

            if (!mapEntity) return;

            const rect = canvas.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const from = camera.camera.screenToWorld(x, y, camera.camera.nearClip);
            const to = camera.camera.screenToWorld(x, y, camera.camera.farClip);

            const ray = new pc.Ray(from, to.sub(from).normalize());

            let hit = false;

            mapEntity.findComponents("render").forEach(render => {

                render.meshInstances.forEach(meshInstance => {

                    if (meshInstance.aabb.intersectsRay(ray)) {
                        hit = true;
                    }

                });

            });

            if (hit) {
                console.log("🌎 Tocaste el mapa (GLB)");
                showClickMessage();
            }
        });

    }, 1000);
});

/*TOCAR MAPA
// --------------------
// 🟢 MENSAJE
// --------------------
 function showClickMessage() {

    if (!clickMessage) return;

    clickMessage.classList.add("show");

    setTimeout(() => {
        clickMessage.classList.remove("show");
    }, 1500);
}*/

// --------------------
// 🖥️ FULLSCREEN
// --------------------
fullscreenBtn.addEventListener('click', () => {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

});

// --------------------
// BOTÓN MODO MAPA
// --------------------
mapBtn.addEventListener('click', () => {
   
    // Ocultar menú
    menu.style.display = 'none';

    // Mostrar mapa y panel 
    mapDiv.style.display = 'block';

    rightPanel.style.display = 'flex';

    // Crear mapa SOLO UNA VEZ
    if (!mapInstance) {

        mapInstance = L.map('map', {
            center: [9.7489, -83.7534], // Costa Rica
            zoom: 7,
            zoomControl: false,

            // 🔒 BLOQUEOS
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            touchZoom: false
        });

        // 🌍 CAPA DEL MAPA
        currentLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);


        /*
        // --------------------
        // 🎮 ICONO ACTIVIDAD
        // --------------------
        const actividadIcon = L.icon({
            iconUrl: 'img/planta.jpg', // asegúrate que existe
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        // --------------------
        // 📍 BOTÓN EN SAN JOSÉ
        // --------------------
        const sanJoseMarker = L.marker([9.9281, -84.0907], {
            icon: actividadIcon
        }).addTo(mapInstance);

        // --------------------
        // 🖱️ CLICK ACTIVIDAD
        // --------------------
        sanJoseMarker.on('click', () => {

            console.log("🎮 Actividad 1");

            document.getElementById("panelTitle").textContent = "Actividad 1";
            document.getElementById("panelText").textContent = "Explora San José y responde la actividad.";
        });
        */



        // 🔒 LIMITES COSTA RICA
        const bounds = [
            [7.5, -86],
            [11.5, -82]
        ];

        mapInstance.setMaxBounds(bounds);
    }

    // 🔥 IMPORTANTE (arregla render) (evita bug visual)
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 100);

        /*
        // Evento click
        mapInstance.on('click', function (e) {

            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            console.log("📍 Click en mapa:", lat, lng);

            alert("Tocaste el mapa 🌍");
        });
        */


});

// --------------------
    // 🎮 CONTROL DEL MAPA (JUEGO)
    // --------------------

    // Guanacaste
    function irAGuanacaste() {
         if (!mapInstance) return;

        if (currentLayer) {
            mapInstance.removeLayer(currentLayer);
        }

        // 🌍 mapa normal
        currentLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        mapInstance.flyTo([10.5, -85.3], 8);
    }

    // Limón
    function irALimon() {
        if (!mapInstance) return;

        // 🔥 eliminar capa actual
        if (currentLayer) {
            mapInstance.removeLayer(currentLayer);
        }

        // 🌵 mapa estilo desértico (claro)
        currentLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO'
        }).addTo(mapInstance);

        // mover cámara
        mapInstance.flyTo([10.0, -83.0], 8);
        }

    // San José
    function irASanJose() {
        mapInstance.setView([9.9, -84.1], 10);
    }

    // Cartago
    function irACartago() {

    if (!mapInstance) return;

    // Mover a Cartago
    mapInstance.flyTo([9.9799, -83.8527], 10);

    // 📍 POPUP EN EL MAPA
    L.popup()
        .setLatLng([9.9799, -83.8527])
        .setContent("🌄 <b>Cartago</b><br>Zona montañosa con gran biodiversidad.")
        .openOn(mapInstance);
}

// --------------------
// 🔓 BOTÓN ACTIVAR MOVIMIENTO (GLOBAL)
// --------------------
toggleMoveBtn.addEventListener('click', () => {

    if (!mapInstance) return;

    mapUnlocked = !mapUnlocked;

    if (mapUnlocked) {

        mapInstance.dragging.enable();
        mapInstance.scrollWheelZoom.enable();
        mapInstance.doubleClickZoom.enable();
        mapInstance.boxZoom.enable();
        mapInstance.keyboard.enable();
        mapInstance.touchZoom.enable();

        toggleMoveBtn.textContent = "🔒 Bloquear mapa";

    } else {

        mapInstance.dragging.disable();
        mapInstance.scrollWheelZoom.disable();
        mapInstance.doubleClickZoom.disable();
        mapInstance.boxZoom.disable();
        mapInstance.keyboard.disable();
        mapInstance.touchZoom.disable();

        toggleMoveBtn.textContent = "🧭 Mover mapa";
    }

});