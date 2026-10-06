// ==========================================
// VARIABLES GLOBALES
// ==========================================
let mapInstance = null;
let currentLayer = null;
let mapUnlocked = false;


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