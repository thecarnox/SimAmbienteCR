
const express = require("express");
const router = express.Router();

const db = require("../database/database");

// ==========================================
// CONFIGURACIÓN DE PROGRESIÓN
// ==========================================

const ACTIVIDAD_LIMON = 1;
const ACTIVIDAD_GUANACASTE = 2;
const ACTIVIDAD_SAN_JOSE = 3;

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
            p.actividad_finalizada,
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

        const progresoGuanacaste = filas.find(
            fila => fila.actividad_id === ACTIVIDAD_GUANACASTE
        );

        const sanJoseDesbloqueada = Boolean(
            progresoGuanacaste &&
            progresoGuanacaste.estado === "completada"
        );

        return res.json({
            jugador_id: jugadorId,
            progreso: filas,
            desbloqueos: {
                limon: true,
                guanacaste: guanacasteDesbloqueada,
                sanjose: sanJoseDesbloqueada
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


    const puntosMaximos = {
    1: 20,
    2: 20,
    3: 10
    };

    if (
        !Object.hasOwn(puntosMaximos, actividad_id) ||
        puntos > puntosMaximos[actividad_id]
    ) {
        return res.status(400).json({
            mensaje: "Actividad o puntuación inválida."
        });
    }

    if (typeof actividad_finalizada !== "boolean") {
        return res.status(400).json({
            mensaje: "Debe indicar si la actividad fue finalizada."
        });
    }



    // En Limón, el servidor determina el estado.
    // Se conserva en_progreso únicamente para
    // registros parciales, si se utilizan.

    let estadoFinal = estado;

    if (actividad_id === ACTIVIDAD_LIMON) {


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
            estado,
            actividad_finalizada
        )
        VALUES (?, ?, ?, ?, ?)

        ON CONFLICT(jugador_id, actividad_id)

        DO UPDATE SET

            puntos = CASE
                WHEN excluded.actividad_finalizada = 1
                THEN excluded.puntos

                WHEN progreso_jugador.actividad_finalizada = 1
                THEN progreso_jugador.puntos

                ELSE excluded.puntos
            END,

            estado = CASE
                WHEN progreso_jugador.estado = 'completada'
                    OR excluded.estado = 'completada'
                THEN 'completada'

                WHEN excluded.estado = 'en_progreso'
                THEN 'en_progreso'

                ELSE 'pendiente'
            END,

            actividad_finalizada = CASE
                WHEN excluded.actividad_finalizada = 1
                THEN 1
                ELSE progreso_jugador.actividad_finalizada
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
                estadoFinal,
                actividad_finalizada ? 1 : 0

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
                    `SELECT puntos, estado, actividad_finalizada
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
                                estado: progresoGuardado.estado,
                                actividad_finalizada:
                                    progresoGuardado.actividad_finalizada === 1
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

    // ======================================
    // VALIDAR ACCESO A SAN JOSÉ
    // ACTIVIDAD 3
    // ======================================

    if (actividad_id === ACTIVIDAD_SAN_JOSE) {

        db.get(
            `SELECT estado
             FROM progreso_jugador
             WHERE jugador_id = ?
               AND actividad_id = ?`,
            [jugador_id, ACTIVIDAD_GUANACASTE],
            (err, progresoGuanacaste) => {

                if (err) {

                    console.error(
                        "Error validando acceso a San José:",
                        err
                    );

                    return res.status(500).json({
                        mensaje: "Error validando el desbloqueo de San José."
                    });
                }

                const desbloqueada = Boolean(
                    progresoGuanacaste &&
                    progresoGuanacaste.estado === "completada"
                );

                if (!desbloqueada) {

                    return res.status(403).json({
                        mensaje: "Debes completar Guanacaste para acceder a San José."
                    });
                }

                guardar();
            }
        );

        return;
    }

    // ======================================
    // GUARDAR ACTIVIDAD AUTORIZADA
    // ======================================

    guardar();
});

// ==========================================
// CONSULTAR RESULTADO FINAL
// ==========================================

router.get("/resultado-final/:jugadorId", (req, res) => {

    const jugadorId = Number(req.params.jugadorId);

    if (!Number.isSafeInteger(jugadorId) || jugadorId <= 0) {
        return res.status(400).json({
            mensaje: "Jugador inválido."
        });
    }

    db.all(`
        SELECT actividad_id, puntos, actividad_finalizada
        FROM progreso_jugador
        WHERE jugador_id = ?
          AND actividad_id IN (1, 2, 3)
    `, [jugadorId], (error, filas) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error consultando las actividades."
            });
        }

        const actividades = [1, 2, 3].map(id =>
            filas.find(fila => fila.actividad_id === id)
        );

        const todasFinalizadas = actividades.every(
            actividad =>
                actividad &&
                actividad.actividad_finalizada === 1
        );

        if (!todasFinalizadas) {
            return res.json({
                disponible: false
            });
        }

        db.get(`
            SELECT jugador_id
            FROM resultados_finales_mostrados
            WHERE jugador_id = ?
        `, [jugadorId], (error, resultadoMostrado) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error consultando el resultado final."
                });
            }

            if (resultadoMostrado) {
                return res.json({
                    disponible: false,
                    ya_mostrado: true
                });
            }

            const limon = actividades[0].puntos;
            const guanacaste = actividades[1].puntos;
            const sanJose = actividades[2].puntos;

            const total = limon + guanacaste + sanJose;

            const categoria =
                total >= 40 ? "BUENO" :
                total >= 25 ? "MEDIO" :
                "MALO";

            return res.json({
                disponible: true,
                puntos: {
                    limon,
                    guanacaste,
                    sanJose,
                    total,
                    maximo: 50
                },
                categoria
            });
        });
    });
});


// ==========================================
// MARCAR RESULTADO COMO MOSTRADO
// ==========================================

router.post("/resultado-final/mostrar", (req, res) => {

    const jugadorId = Number(req.body?.jugador_id);

    if (!Number.isSafeInteger(jugadorId) || jugadorId <= 0) {
        return res.status(400).json({
            mensaje: "Jugador inválido."
        });
    }

    db.run(`
        INSERT OR IGNORE INTO resultados_finales_mostrados (
            jugador_id
        )
        SELECT ?
        WHERE (
            SELECT COUNT(DISTINCT actividad_id)
            FROM progreso_jugador
            WHERE jugador_id = ?
              AND actividad_id IN (1, 2, 3)
              AND actividad_finalizada = 1
        ) = 3
    `, [jugadorId, jugadorId], function(error) {

        if (error) {
            return res.status(500).json({
                mensaje: "No se pudo registrar el resultado final."
            });
        }

        if (this.changes !== 1) {
            return res.status(409).json({
                mensaje: "El resultado ya fue mostrado o las actividades no están finalizadas."
            });
        }

        return res.json({
            registrado: true
        });
    });
});

module.exports = router;

