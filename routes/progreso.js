
const express = require("express");
const router = express.Router();

const db = require("../database/database");

// ==========================================
// CONFIGURACIÓN DE PROGRESIÓN
// ==========================================

const ACTIVIDAD_LIMON = 1;
const ACTIVIDAD_GUANACASTE = 2;

const PUNTOS_MAXIMOS_LIMON = 20;
const PUNTOS_MINIMOS_LIMON = 10;

// ==========================================
// CONSULTAR PROGRESO DE UN JUGADOR
// GET /progreso/jugador/:jugadorId
// ==========================================

router.get("/jugador/:jugadorId", (req, res) => {

    const jugadorId = Number(req.params.jugadorId);

    if (
        !Number.isSafeInteger(jugadorId) ||
        jugadorId <= 0
    ) {
        return res.status(400).json({
            mensaje: "ID de jugador inválido."
        });
    }

    const sql = `
        SELECT
            p.id,
            p.jugador_id,
            p.actividad_id,
            a.nombre AS actividad,
            a.provincia,
            p.puntos,
            p.estado,
            p.fecha_actualizacion
        FROM progreso_jugador p
        INNER JOIN actividades a
            ON a.id = p.actividad_id
        WHERE p.jugador_id = ?
        ORDER BY a.id ASC
    `;

    db.all(sql, [jugadorId], (err, filas) => {

        if (err) {
            console.error(
                "Error consultando progreso:",
                err
            );

            return res.status(500).json({
                mensaje: "Error consultando el progreso."
            });
        }

        const progresoLimon = filas.find(
            fila => fila.actividad_id === ACTIVIDAD_LIMON
        );

        const guanacasteDesbloqueada = Boolean(
            progresoLimon &&
            progresoLimon.estado === "completada"
        );

        return res.json({
            jugador_id: jugadorId,
            progreso: filas,
            desbloqueos: {
                limon: true,
                guanacaste: guanacasteDesbloqueada
            }
        });
    });
});

// ==========================================
// GUARDAR PROGRESO
// POST /progreso/guardar
// ==========================================

router.post("/guardar", (req, res) => {

    const {
        jugador_id,
        actividad_id,
        puntos,
        estado,
        actividad_finalizada
    } = req.body || {};

    if (
        !Number.isSafeInteger(jugador_id) ||
        jugador_id <= 0 ||
        !Number.isSafeInteger(actividad_id) ||
        actividad_id <= 0 ||
        !Number.isSafeInteger(puntos) ||
        puntos < 0 ||
        !["pendiente", "en_progreso", "completada"].includes(estado)
    ) {
        return res.status(400).json({
            mensaje: "Datos de progreso inválidos."
        });
    }

    // ======================================
    // VALIDACIÓN ESPECÍFICA DE LIMÓN
    // ======================================

    if (
        actividad_id === ACTIVIDAD_LIMON &&
        puntos > PUNTOS_MAXIMOS_LIMON
    ) {
        return res.status(400).json({
            mensaje: "La puntuación de Limón no puede superar 20 puntos."
        });
    }

    // En Limón, el servidor determina el estado.
    // Se conserva en_progreso únicamente para
    // registros parciales, si se utilizan.

    let estadoFinal = estado;

    if (actividad_id === ACTIVIDAD_LIMON) {

        if (typeof actividad_finalizada !== "boolean") {
            return res.status(400).json({
                mensaje: "Debe indicar si finalizó la actividad."
            });
        }

        estadoFinal =
            actividad_finalizada &&
            puntos >= PUNTOS_MINIMOS_LIMON
                ? "completada"
                : "pendiente";
    }

    
    // ======================================
    // ACTUALIZAR PUNTOS DEL ÚLTIMO INTENTO
    // CONSERVAR ESTADO COMPLETADA
    // ======================================

    const sql = `
        INSERT INTO progreso_jugador (
            jugador_id,
            actividad_id,
            puntos,
            estado
        )
        VALUES (?, ?, ?, ?)

        ON CONFLICT(jugador_id, actividad_id)

        DO UPDATE SET

            puntos = excluded.puntos,

            estado = CASE

                WHEN progreso_jugador.estado = 'completada'
                     OR excluded.estado = 'completada'
                THEN 'completada'

                WHEN excluded.estado = 'en_progreso'
                THEN 'en_progreso'

                ELSE 'pendiente'

            END,

            fecha_actualizacion = CURRENT_TIMESTAMP
    `;


    // ======================================
    // VALIDAR ACCESO A GUANACASTE
    // ======================================

    function guardar() {

        db.run(
            sql,
            [
                jugador_id,
                actividad_id,
                puntos,
                estadoFinal
            ],
            function(err) {

                if (err) {

                    console.error(
                        "Error guardando progreso:",
                        err.message
                    );

                    if (
                        err.code === "SQLITE_CONSTRAINT"
                    ) {
                        return res.status(400).json({
                            mensaje: "El jugador o la actividad no existe, o los datos incumplen una restricción."
                        });
                    }

                    return res.status(500).json({
                        mensaje: "No se pudo guardar el progreso."
                    });
                }

                // Consultar el registro efectivo:
                // puede ser distinto al intento actual.

                db.get(
                    `SELECT puntos, estado
                     FROM progreso_jugador
                     WHERE jugador_id = ?
                       AND actividad_id = ?`,
                    [jugador_id, actividad_id],
                    (error, progresoGuardado) => {

                        if (error || !progresoGuardado) {
                            return res.status(500).json({
                                mensaje: "El progreso se guardó, pero no pudo recuperarse."
                            });
                        }

                        return res.json({
                            mensaje: "Progreso guardado correctamente.",
                            jugador_id,
                            actividad_id,
                            puntos: progresoGuardado.puntos,
                            estado: progresoGuardado.estado
                        });
                    }
                );
            }
        );
    }

    if (actividad_id === ACTIVIDAD_GUANACASTE) {

        db.get(
            `SELECT puntos, estado
             FROM progreso_jugador
             WHERE jugador_id = ?
               AND actividad_id = ?`,
            [jugador_id, ACTIVIDAD_LIMON],
            (err, progresoLimon) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        mensaje: "Error validando el desbloqueo."
                    });
                }

                const desbloqueada = Boolean(
                    progresoLimon &&
                    progresoLimon.estado === "completada"
                );

                if (!desbloqueada) {
                    return res.status(403).json({
                        mensaje: "Debe completar Limón con al menos 10 puntos para avanzar a Guanacaste."
                    });
                }

                guardar();
            }
        );

        return;
    }

    guardar();
});

module.exports = router;
