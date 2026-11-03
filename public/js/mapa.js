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
        scrollWheelZoom: true,
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

    // ==========================================
    // MOSTRAR COORDENADAS DEL CURSOR
    // ==========================================

    const indicadorCoordenadas =
        document.getElementById("coordenadasMapa");

    if (indicadorCoordenadas) {

        mapInstance.on("mousemove", (evento) => {

            const latitud = evento.latlng.lat.toFixed(6);
            const longitud = evento.latlng.lng.toFixed(6);

            indicadorCoordenadas.textContent =
                `Latitud: ${latitud} | Longitud: ${longitud}`;

            indicadorCoordenadas.classList.remove(
                "coordenadas-ocultas"
            );

        });

        mapInstance.getContainer().addEventListener(
            "mouseleave",
            () => {

                indicadorCoordenadas.classList.add(
                    "coordenadas-ocultas"
                );

            }
        );

    }
}


 // ==========================================
 // BLOQUEAR / DESBLOQUEAR MAPA
 // ==========================================

 {
     const botonMovimientoMapa =
         document.getElementById("toggleMoveBtn");

     if (botonMovimientoMapa) {

         botonMovimientoMapa.addEventListener("click", () => {

             if (!mapInstance) return;

             mapUnlocked = !mapUnlocked;

             if (mapUnlocked) {

                 mapInstance.dragging.enable();
                 mapInstance.scrollWheelZoom.enable();
                 mapInstance.doubleClickZoom.enable();
                 mapInstance.boxZoom.enable();
                 mapInstance.keyboard.enable();
                 mapInstance.touchZoom.enable();

                 botonMovimientoMapa.textContent =
                     "🔒 Bloquear mapa";

             } else {

                 mapInstance.dragging.disable();
                 mapInstance.scrollWheelZoom.enable();
                 mapInstance.doubleClickZoom.disable();
                 mapInstance.boxZoom.disable();
                 mapInstance.keyboard.disable();
                 mapInstance.touchZoom.disable();

                 botonMovimientoMapa.textContent =
                     "🧭 Mover mapa";
             }
         });
     }
 }

// ==========================================
// ACTIVIDAD SAN JOSÉ
// MOSTRAR UBICACIÓN DESPUÉS DE RESPONDER
// ==========================================

let marcadorSanJose = null;

function mostrarUbicacionSanJose(latitud, longitud, nombre) {

    if (!mapInstance) {
        console.warn("El mapa Leaflet no está inicializado.");
        return;
    }

    // Eliminar el marcador de la pregunta anterior
    if (marcadorSanJose) {
        mapInstance.removeLayer(marcadorSanJose);
        marcadorSanJose = null;
    }

    // Crear marcador de la ubicación correcta
    marcadorSanJose = L.marker([
        latitud,
        longitud
    ]).addTo(mapInstance);

    // Mostrar información del área protegida
    marcadorSanJose.bindPopup(
        nombre
    ).openPopup();

    // Centrar el mapa en el área protegida
    mapInstance.setView(
        [latitud, longitud],
        10,
        {
            animate: true
        }
    );

}