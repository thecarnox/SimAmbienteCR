// ==========================================
// ELEMENTOS HTML
// ==========================================

// CANVAS PRINCIPAL
// ==========================================
const canvas = document.getElementById('application-canvas');

// MENÚ PRINCIPAL
// ==========================================
const fullscreenBtn = document.getElementById('fullscreenBtn');
const mapBtn = document.getElementById('mapBtn');
const menu = document.getElementById('menu');

// MAPA
// ==========================================
const toggleMoveBtn = document.getElementById('toggleMoveBtn');
const mapDiv = document.getElementById('map');
const rightPanel = document.getElementById('rightPanel');

// AUDIO
// ==========================================
const bgSound = document.getElementById('bgSound');

// MENÚ PAUSA
// ==========================================
const menuToggleBtn = document.getElementById('menuToggleBtn');
const pauseMenu = document.getElementById('pauseMenu');
const resumeBtn = document.getElementById('resumeBtn');
const optionsBtn = document.getElementById('optionsBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

// DIÁLOGOS
// ==========================================
const dialogBox = document.getElementById('dialogBox');
const characterName = document.getElementById('characterName');
const dialogText = document.getElementById('dialogText');
const nextDialogBtn = document.getElementById('nextDialogBtn');

// PANTALLA DE CARGA
// ==========================================
const loadingScreen = document.getElementById("loadingScreen");
const loadingMessage = document.getElementById("loadingMessage");
const loadingProgress = document.getElementById("loadingProgress");

// ==========================================
// Jugador Base de datos
// ==========================================
const playerModal = document.getElementById("playerModal");
const playerName = document.getElementById("playerName");
const startPlayerBtn = document.getElementById("startPlayerBtn");

let jugadorID = null;
let jugadorNombre = "";


// ==========================================
// PLAYCANVAS PRINCIPAL
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

    location.reload();
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


        await mostrarPantallaCarga(datos.existe);

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


// ==========================================
// PANTALLA DE CARGA
// ==========================================
async function mostrarPantallaCarga(esJugadorExistente){

    playerModal.style.display="none";

    loadingScreen.style.display="flex";

    if(esJugadorExistente){

        loadingMessage.innerHTML=

        "👋 Bienvenido nuevamente <b>" +

        jugadorNombre +

        "</b>.<br><br>Estamos cargando tu progreso...";

    }else{

        loadingMessage.innerHTML=

        "🌱 Bienvenido <b>" +

        jugadorNombre +

        "</b>.<br><br>Preparando tu primera aventura...";

    }

    loadingProgress.style.width="0%";

    let progreso=0;

    return new Promise(resolve=>{

        const intervalo=setInterval(()=>{

            progreso+=2;

            loadingProgress.style.width=progreso+"%";

            if(progreso>=100){

                clearInterval(intervalo);

                setTimeout(()=>{

                    loadingScreen.style.display="none";

                    resolve();

                },500);

            }

        },100);

    });


}


window.addEventListener("resize",()=>{

    characterApp.resizeCanvas();

    });