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
 // VERIFICAR DESBLOQUEO DE GUANACASTE
 // ==========================================

async function verificarDesbloqueoGuanacaste() {

    const jugadorId = Number(
        sessionStorage.getItem("jugadorId")
    );

    if (!Number.isSafeInteger(jugadorId) || jugadorId <= 0) {
        console.warn("No hay jugador identificado.");
        return false;
    }

    try {

        const respuesta = await fetch(
            `/progreso/jugador/${jugadorId}`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {
            throw new Error(
                `Error HTTP ${respuesta.status}`
            );
        }

        const datos = await respuesta.json();

        // Comprobar progreso real de Limón
        const progresoLimon = datos.progreso?.find(
            actividad => actividad.actividad_id === 1
        );

        const desbloqueada =
            progresoLimon?.estado === "completada" &&
            progresoLimon?.puntos >= 10;

        console.log(
            "Guanacaste desbloqueada:",
            desbloqueada
        );

        return desbloqueada;

    } catch (error) {

        console.error(
            "Error verificando Guanacaste:",
            error
        );

        // Ante un error no permitir el acceso
        throw error;
    }
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

        if (botonGuanacaste) {

            botonGuanacaste.addEventListener(
                "click",
                async () => {

                    console.log(
                        "Botón Guanacaste presionado"
                    );

                    // Evitar múltiples solicitudes simultáneas
                    if (botonGuanacaste.dataset.verificando === "true") {
                        return;
                    }

                    botonGuanacaste.dataset.verificando = "true";

                    try {

                        // Consultar SQLite mediante el servidor
                        const desbloqueada =
                            await verificarDesbloqueoGuanacaste();

                        if (!desbloqueada) {

                            alert(
                                "🔒 Guanacaste está bloqueada.\n\n" +
                                "Primero debes completar la actividad de Limón, " +
                                "responder sus 10 elementos y obtener " +
                                "al menos 10 puntos."
                            );

                            return;
                        }

                        // El jugador cumple los requisitos
                        console.log(
                            "Guanacaste desbloqueada. Iniciando actividad."
                        );

                        const actividadGuanacaste =
                            document.getElementById(
                                "actividadGuanacaste"
                            );

                        if (!actividadGuanacaste) {
                            console.error(
                                "No se encontró #actividadGuanacaste."
                            );
                            return;
                        }

                        cerrarEscenarioPrincipal();

                        actividadGuanacaste.style.display = "block";

                        iniciarActividadGuanacaste();

                    } catch (error) {

                        console.error(
                            "No se pudo verificar el acceso:",
                            error
                        );

                        alert(
                            "No se pudo consultar tu progreso. " +
                            "Inténtalo nuevamente."
                        );

                    } finally {

                        botonGuanacaste.dataset.verificando = "false";

                    }
                }
            );

        }



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