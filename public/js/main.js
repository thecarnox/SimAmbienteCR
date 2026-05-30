// ==========================================
// ELEMENTOS HTML
// ==========================================
const canvas = document.getElementById('application-canvas');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const mapBtn = document.getElementById('mapBtn');
const toggleMoveBtn = document.getElementById('toggleMoveBtn');
const menu = document.getElementById('menu');
const mapDiv = document.getElementById('map');
const rightPanel = document.getElementById('rightPanel');

const bgSound = document.getElementById('bgSound');

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let mapInstance = null;
let currentLayer = null;
let mapUnlocked = false;

// ==========================================
// PLAYCANVAS
// ==========================================
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);


// ==========================================
// BOTÓN MODO MAPA
// ==========================================
mapBtn.addEventListener('click', () => {

    // 🎵 Iniciar música ambiental
    bgSound.volume = 0.5;
    bgSound.play();

    // Ocultar menú
    menu.style.display = 'none';

    // Mostrar mapa y panel
    mapDiv.style.display = 'block';
    rightPanel.style.display = 'flex';

    inicializarMapa();

    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 100);
});

// ==========================================
// INICIALIZAR MAPA LEAFLET
// ==========================================
function inicializarMapa() {

    if (mapInstance) return;

    mapInstance = L.map('map', {

        center: [9.7489, -83.7534],
        zoom: 7,
        zoomControl: false,

        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
    });

    currentLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap'
        }
    ).addTo(mapInstance);

    const bounds = [
        [7.5, -86],
        [11.5, -82]
    ];

    mapInstance.setMaxBounds(bounds);
}

// ==========================================
// SAN JOSÉ
// ==========================================
function irASanJose() {

    if (!mapInstance) return;

    if (currentLayer) {
        mapInstance.removeLayer(currentLayer);
    }

    currentLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap'
        }
    ).addTo(mapInstance);

    mapInstance.flyTo([9.93, -84.08], 10);
}

// ==========================================
// GUANACASTE
// ==========================================
function irAGuanacaste() {

    if (!mapInstance) return;

    if (currentLayer) {
        mapInstance.removeLayer(currentLayer);
    }

    currentLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap'
        }
    ).addTo(mapInstance);

    mapInstance.flyTo([10.5, -85.3], 10);
}

// ==========================================
// LIMÓN
// ==========================================
function irALimon() {

    if (!mapInstance) return;

    if (currentLayer) {
        mapInstance.removeLayer(currentLayer);
    }

    currentLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
            attribution: '© OpenStreetMap © CARTO'
        }
    ).addTo(mapInstance);

    mapInstance.flyTo([10.0, -83.0], 10);
}

// ==========================================
// CARTAGO
// ==========================================
function irACartago() {

    if (!mapInstance) return;

    mapInstance.flyTo([9.8644, -83.9194], 10);

    L.popup()
        .setLatLng([9.8644, -83.9194])
        .setContent(
            "🌄 <b>Cartago</b><br>Zona montañosa con gran biodiversidad."
        )
        .openOn(mapInstance);
}

// ==========================================
// BLOQUEAR / DESBLOQUEAR MAPA
// ==========================================
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

        toggleMoveBtn.textContent =
            "🔒 Bloquear mapa";

    } else {

        mapInstance.dragging.disable();
        mapInstance.scrollWheelZoom.disable();
        mapInstance.doubleClickZoom.disable();
        mapInstance.boxZoom.disable();
        mapInstance.keyboard.disable();
        mapInstance.touchZoom.disable();

        toggleMoveBtn.textContent =
            "🧭 Mover mapa";
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