const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde se guardará la base de datos
const db = new sqlite3.Database(
    path.join(__dirname, 'simambiente.db'),
    (err) => {

        if (err) {
            console.error("Error al conectar con SQLite:", err.message);
        } else {
            console.log("SQLite conectado correctamente.");
        }

    }
);


// ==========================================
// CREACIÓN DE TABLAS
// ==========================================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS jugadores (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS partidas (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jugador_id INTEGER NOT NULL,
            puntaje INTEGER DEFAULT 0,
            nivel INTEGER DEFAULT 1,
            provincia TEXT,
            estado_ambiental INTEGER DEFAULT 100,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(jugador_id)
            REFERENCES jugadores(id)

        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS progreso (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jugador_id INTEGER NOT NULL,
            guanacaste INTEGER DEFAULT 0,
            limon INTEGER DEFAULT 0,
            cartago INTEGER DEFAULT 0,
            san_jose INTEGER DEFAULT 0,

            FOREIGN KEY(jugador_id)
            REFERENCES jugadores(id)

        )
    `);

    console.log("Tablas creadas correctamente.");

});

module.exports = db;