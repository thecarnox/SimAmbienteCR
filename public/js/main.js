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

const menuToggleBtn = document.getElementById('menuToggleBtn');
const pauseMenu = document.getElementById('pauseMenu');

const resumeBtn = document.getElementById('resumeBtn');
const optionsBtn = document.getElementById('optionsBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

const dialogBox = document.getElementById('dialogBox');
const characterName = document.getElementById('characterName');
const dialogText = document.getElementById('dialogText');
const characterImage = document.getElementById('characterImage');
const nextDialogBtn = document.getElementById('nextDialogBtn');


// ==========================================
// Jugador Base de datos
// ==========================================
const playerModal = document.getElementById("playerModal");
const playerName = document.getElementById("playerName");
const startPlayerBtn = document.getElementById("startPlayerBtn");

let jugadorID = null;
let jugadorNombre = "";


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
// MENÚ (ABRIR, REANUDAR, OPCIONES, VOLVER ALMENU PRINCIPAL)
// ==========================================
menuToggleBtn.addEventListener('click', () => {

    pauseMenu.style.display = 'flex';
    //Pausar música
    bgSound.pause();

});

resumeBtn.addEventListener('click', () => {

    pauseMenu.style.display = 'none';

    //Continuar música
    bgSound.play();


});

optionsBtn.addEventListener('click', () => {

    alert("Opciones próximamente");

});

mainMenuBtn.addEventListener('click', () => {

    pauseMenu.style.display = 'none';

    mapDiv.style.display = 'none';
    rightPanel.style.display = 'none';

    menu.style.display = 'flex';

    bgSound.pause();
    bgSound.currentTime = 0;
});

// ==========================================
// BOTÓN MODO MAPA
// ==========================================
mapBtn.addEventListener('click', () => {

    playerModal.style.display="flex";

    startPlayerBtn.addEventListener("click", async ()=>{

    const nombre = playerName.value.trim();

    if(nombre===""){

        alert("Ingrese su nombre.");

        return;

    }

    try{

        const respuesta = await fetch("/players/create",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                nombre:nombre

            })

        });

        const datos = await respuesta.json();
        
        console.log("Respuesta completa:", datos);
        console.log("Existe:", datos.existe);
        console.log("Tipo:", typeof datos.existe);
        
        jugadorID = datos.id;

        jugadorNombre = nombre;


        if(datos.existe){

            console.log("¡Bienvenido de nuevo, " + jugadorNombre + "!");
            alert("👋 ¡Bienvenido de nuevo, " + jugadorNombre + "! Tu progreso ha sido cargado.");
        }else{

            console.log("Jugador registrado correctamente.");
            alert("✅ Jugador registrado correctamente. ¡Bienvenido, " + jugadorNombre + "!");
        }

        playerModal.style.display="none";

        bgSound.volume=0.5;
        bgSound.play();

        menu.style.display="none";

        mapDiv.style.display="block";

        rightPanel.style.display="flex";

        currentDialog=0;

        mostrarDialogo(currentDialog);

        inicializarMapa();

        setTimeout(()=>{

            mapInstance.invalidateSize();

        },100);

    }

    catch(error){

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});

});


// --------------------
// 💬 DIÁLOGOS
// --------------------

let currentDialog = 0;

const dialogs = [

    {
        nombre: "Guía Ambiental",
        texto: "Bienvenido a SimAmbienteCR."
    },

    {
        nombre: "Guía Ambiental",
        texto: "En esta experiencia explorarás distintas regiones de Costa Rica."
    },

    {
        nombre: "Guía Ambiental",
        texto: "Selecciona una provincia para comenzar tu aventura."
    }

];

// --------------------
// 💬 MOSTRAR DIÁLOGOS
// --------------------

function mostrarDialogo(indice) {

    const dialogo = dialogs[indice];

    characterName.textContent = dialogo.nombre;
    dialogText.textContent = dialogo.texto;

    dialogBox.style.display = "flex";

}

// --------------------
// BOTÓN CONTINUAR
// --------------------
nextDialogBtn.addEventListener('click', () => {

    currentDialog++;

    if (currentDialog < dialogs.length) {

        mostrarDialogo(currentDialog);

    } else {

        dialogBox.style.display = "none";

        currentDialog = 0;
    }

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

