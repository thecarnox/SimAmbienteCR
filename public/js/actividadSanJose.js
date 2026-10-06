// ==========================================
// ACTIVIDAD SAN JOSÉ
// ==========================================

function iniciarActividadSanJose() {

    console.log(
        "Iniciando actividad de San José..."
    );

    const mapa =
        document.getElementById(
            "map"
        );

    const panel =
        document.getElementById(
            "rightPanel"
        );

    // Mostrar mapa
    mapa.style.display = "block";

    // Mostrar menú de actividades
    panel.style.display = "flex";

    // Inicializar Leaflet
    inicializarMapa();

}

// ==========================================
// ACTIVIDAD 3 - SAN JOSÉ
// ==========================================

function iniciarActividadSanJose() {

    console.log(
        "Actividad 3 - San José"
    );


    const mapa =
        document.getElementById(
            "map"
        );


    const panel =
        document.getElementById(
            "rightPanel"
        );


    // ======================================
    // MOSTRAR MAPA
    // ======================================

    if (mapa) {

        mapa.style.display =
            "block";

    }


    // ======================================
    // MOSTRAR MENÚ DE ACTIVIDADES
    // ======================================

    if (panel) {

        panel.style.display =
            "flex";

    }


    // ======================================
    // INICIALIZAR LEAFLET
    // ======================================

    inicializarMapa();


    // ======================================
    // CORREGIR TAMAÑO DEL MAPA
    // ======================================

    setTimeout(
        () => {

            if (mapInstance) {

                mapInstance
                    .invalidateSize();

            }

        },
        100
    );

}