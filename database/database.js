
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ==========================================
// CONEXIÓN A LA BASE DE DATOS
// ==========================================

const db = new sqlite3.Database(
    path.join(__dirname, "simambiente.db"),
    (err) => {
        if (err) {
            console.error(
                "Error al conectar con SQLite:",
                err.message
            );
        } else {
            console.log("SQLite conectado correctamente.");
        }
    }
);

// ==========================================
// CREACIÓN DE TABLAS
// ==========================================

db.serialize(() => {

    // Activar claves foráneas
    db.run("PRAGMA foreign_keys = ON");

    // --------------------------------------
    // JUGADORES
    // --------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS jugadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    

    db.all("PRAGMA table_info(jugadores)", (error, columnas) => {

        if (error) {
            console.error(
                "Error consultando jugadores:",
                error
            );
            return;
        }

        const nombresColumnas = columnas.map(
            col => col.name
        );

        function crearIndiceCorreo() {

            db.run(
                `CREATE UNIQUE INDEX IF NOT EXISTS
                idx_jugadores_correo_unico
                ON jugadores(LOWER(TRIM(correo)))
                WHERE correo IS NOT NULL
                AND TRIM(correo) <> ''`,
                (error) => {

                    if (error) {
                        console.error(
                            "Error creando índice único:",
                            error.message
                        );
                    } else {
                        console.log(
                            "Índice único de correo verificado."
                        );
                    }
                }
            );
        }

        if (!nombresColumnas.includes("correo")) {

            db.run(
                "ALTER TABLE jugadores ADD COLUMN correo TEXT",
                (err) => {

                    if (err) {
                        console.error(
                            "Error agregando correo:",
                            err.message
                        );
                        return;
                    }

                    console.log("Columna correo agregada.");

                    crearIndiceCorreo();
                }
            );

        } else {

            crearIndiceCorreo();
        }

        if (!nombresColumnas.includes("centro_universitario")) {

            db.run(
                `ALTER TABLE jugadores
                ADD COLUMN centro_universitario TEXT`,
                (err) => {

                    if (err) {
                        console.error(
                            "Error agregando centro universitario:",
                            err.message
                        );
                    } else {
                        console.log(
                            "Columna centro universitario agregada."
                        );
                    }
                }
            );
        }

    });

    // --------------------------------------
    // PARTIDAS
    // --------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS partidas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jugador_id INTEGER NOT NULL,
            puntaje INTEGER NOT NULL DEFAULT 0
                CHECK (puntaje >= 0),
            nivel INTEGER NOT NULL DEFAULT 1
                CHECK (nivel >= 1),
            provincia TEXT,
            estado_ambiental INTEGER NOT NULL DEFAULT 100
                CHECK (estado_ambiental BETWEEN 0 AND 100),
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (jugador_id)
                REFERENCES jugadores(id)
                ON DELETE CASCADE
        )
    `);

    // --------------------------------------
    // ACTIVIDADES
    // --------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS actividades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            provincia TEXT,
            descripcion TEXT
        )
    `);

    // --------------------------------------
    // PROGRESO POR ACTIVIDAD
    // --------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS progreso_jugador (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jugador_id INTEGER NOT NULL,
            actividad_id INTEGER NOT NULL,
            puntos INTEGER NOT NULL DEFAULT 0
                CHECK (puntos >= 0),
            estado TEXT NOT NULL DEFAULT 'pendiente'
                CHECK (
                    estado IN (
                        'pendiente',
                        'en_progreso',
                        'completada'
                    )
                ),
            fecha_actualizacion DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (jugador_id)
                REFERENCES jugadores(id)
                ON DELETE CASCADE,

            FOREIGN KEY (actividad_id)
                REFERENCES actividades(id)
                ON DELETE CASCADE,

            UNIQUE (jugador_id, actividad_id)
        )
    `);

    // --------------------------------------
    // ÍNDICES
    // --------------------------------------

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_partidas_jugador
        ON partidas(jugador_id)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_progreso_jugador
        ON progreso_jugador(jugador_id)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_progreso_actividad
        ON progreso_jugador(actividad_id)
    `);

    // --------------------------------------
    // REGISTRO DE ACTIVIDADES
    // --------------------------------------

    db.run(`
        INSERT OR IGNORE INTO actividades
            (nombre, provincia, descripcion)
        VALUES
            (
                'Actividad de Limón',
                'Limón',
                'Clasificación de elementos ambientales.'
            ),
            (
                'Simulación de erosión',
                NULL,
                'Evaluación de los efectos de la erosión del suelo.'
            ),
            (
                'Mapa interactivo',
                NULL,
                'Exploración de información ambiental.'
            )
    `);

    // --------------------------------------
    // VERIFICACIÓN DE INICIALIZACIÓN
    // --------------------------------------

    db.get(
        "SELECT COUNT(*) AS total FROM actividades",
        (err, row) => {
            if (err) {
                console.error(
                    "Error verificando las tablas:",
                    err.message
                );
            } else {
                console.log(
                    "Base de datos inicializada. Actividades registradas:",
                    row.total
                );
            }
        }
    );

});

module.exports = db;
