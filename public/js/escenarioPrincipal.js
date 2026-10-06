// ==========================================
// ESCENARIO PRINCIPAL
// ==========================================

function abrirEscenarioPrincipal() {

    const escenario =
        document.getElementById(
            "escenarioPrincipal"
        );

    if (!escenario) {

        console.error(
            "No se encontró #escenarioPrincipal."
        );

        return;
    }


    // ======================================
    // OCULTAR OTRAS PANTALLAS
    // ======================================

    const mapa =
        document.getElementById(
            "map"
        );

    const rightPanel =
        document.getElementById(
            "rightPanel"
        );

    const actividadLimon =
        document.getElementById(
            "actividadLimon"
        );

    const actividadGuanacaste =
        document.getElementById(
            "actividadGuanacaste"
        );


    if (mapa) {
        mapa.style.display = "none";
    }

    if (rightPanel) {
        rightPanel.style.display = "none";
    }

    if (actividadLimon) {
        actividadLimon.style.display = "none";
    }

    if (actividadGuanacaste) {
        actividadGuanacaste.style.display = "none";
    }


    // ======================================
    // MOSTRAR ESCENARIO PRINCIPAL
    // ======================================

    escenario.style.display =
        "flex";

}


// ==========================================
// CERRAR ESCENARIO PRINCIPAL
// ==========================================

function cerrarEscenarioPrincipal() {

    const escenario =
        document.getElementById(
            "escenarioPrincipal"
        );

    if (!escenario) {
        return;
    }

    escenario.style.display =
        "none";

}


// ==========================================
// BOTONES DEL ESCENARIO PRINCIPAL
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // ======================================
        // OBTENER BOTONES
        // ======================================

        const botonLimon =
            document.getElementById(
                "botonLimon"
            );

        const botonGuanacaste =
            document.getElementById(
                "botonGuanacaste"
            );

        const botonSanJose =
            document.getElementById(
                "botonSanJose"
            );

        const menuPausaEscenarioPrincipal =
            document.getElementById(
                "menuPausaEscenarioPrincipal"
            );


        // ======================================
        // ACTIVIDAD 1 - LIMÓN
        // ======================================

        botonLimon.addEventListener(
            "click",
            () => {

                console.log(
                    "Botón Limón presionado"
                );

                cerrarEscenarioPrincipal();

                iniciarActividadLimon();

            }
        );


        // ======================================
        // ACTIVIDAD 2 - GUANACASTE
        // ======================================

        botonGuanacaste.addEventListener(
            "click",
            () => {

                console.log(
                    "Botón Guanacaste presionado"
                );

                cerrarEscenarioPrincipal();


                const actividadGuanacaste =
                    document.getElementById(
                        "actividadGuanacaste"
                    );

                actividadGuanacaste.style.display =
                    "block";


                iniciarActividadGuanacaste();

            }
        );


        // ======================================
        // ACTIVIDAD 3 - SAN JOSÉ
        // ======================================

        botonSanJose.addEventListener(
            "click",
            () => {

                console.log(
                    "Botón San José presionado"
                );

                cerrarEscenarioPrincipal();

                iniciarActividadSanJose();

            }
        );


        // ======================================
        // MENÚ DE PAUSA
        // ======================================

        menuPausaEscenarioPrincipal.addEventListener(
            "click",
            abrirMenuPausa
        );

    }
);