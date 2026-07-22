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

    crearPersonaje3D();

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


