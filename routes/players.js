const express = require('express');
const router = express.Router();

const db = require('../database/database');

// ==========================================
// REGISTRAR JUGADOR
// ==========================================
router.post('/create', (req, res) => {

    const nombre = req.body.nombre.trim();

    console.log("Nombre recibido:", nombre);

    db.get(

        "SELECT * FROM jugadores WHERE LOWER(nombre) = LOWER(?)",

        [nombre],

        (err, jugador) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    mensaje: err.message
                });

            }

            console.log("Jugador encontrado:", jugador);

            if (jugador) {

                return res.json({

                    id: jugador.id,
                    nombre: jugador.nombre,
                    existe: true

                });

            }

            db.run(

                "INSERT INTO jugadores(nombre) VALUES(?)",

                [nombre],

                function(err){

                    if(err){

                        console.error(err);

                        return res.status(500).json({
                            mensaje: err.message
                        });

                    }

                    return res.json({

                        id: this.lastID,
                        nombre: nombre,
                        existe: false

                    });

                }

            );

        }

    );

});

module.exports = router;