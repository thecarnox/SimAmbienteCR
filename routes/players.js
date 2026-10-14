

const express = require("express");
const router = express.Router();
const db = require("../database/database");

const centrosPermitidos = [
    "San José",
    "Alajuela",
    "Heredia",
    "Cartago",
    "Puntarenas",
    "Guanacaste",
    "Limón"
];

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// REGISTRO DE JUGADOR NUEVO
// POST /players/create
// ==========================================

router.post("/create", (req, res) => {

    const {
        nombre,
        correo,
        centro_universitario
    } = req.body || {};

    if (
        typeof nombre !== "string" ||
        typeof correo !== "string" ||
        typeof centro_universitario !== "string"
    ) {
        return res.status(400).json({
            codigo: "CAMPOS_INCOMPLETOS",
            mensaje: "Debes completar el nombre, correo electrónico y centro universitario."
        });
    }

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const centroLimpio = centro_universitario.trim();

    if (
        !nombreLimpio ||
        !correoLimpio ||
        !centroLimpio
    ) {
        return res.status(400).json({
            codigo: "CAMPOS_INCOMPLETOS",
            mensaje: "Debes completar todos los campos antes de continuar."
        });
    }

    if (
        nombreLimpio.length > 50 ||
        correoLimpio.length > 254
    ) {
        return res.status(400).json({
            codigo: "DATOS_DEMASIADO_LARGOS",
            mensaje: "El nombre no puede superar los 50 caracteres y el correo no puede superar los 254."
        });
    }

    if (!formatoCorreo.test(correoLimpio)) {
        return res.status(400).json({
            codigo: "CORREO_INVALIDO",
            mensaje: "El correo electrónico no tiene un formato válido. Ejemplo: estudiante@correo.com."
        });
    }

    if (!centrosPermitidos.includes(centroLimpio)) {
        return res.status(400).json({
            codigo: "CENTRO_INVALIDO",
            mensaje: "Debes seleccionar un centro universitario válido."
        });
    }

    // Buscar si el correo ya existe
    db.get(
        `SELECT id
         FROM jugadores
         WHERE LOWER(TRIM(correo)) = ?`,
        [correoLimpio],
        (error, jugador) => {

            if (error) {
                console.error(error);

            return res.status(500).json({
                codigo: "ERROR_SERVIDOR",
                mensaje: "No fue posible consultar los jugadores. Inténtalo nuevamente."
            });
            }

            if (jugador) {
                return res.status(409).json({
                    codigo: "CORREO_DUPLICADO",
                    mensaje: "Este correo electrónico ya está registrado. Selecciona la opción Jugador existente."
                });
            }

            // Crear nuevo jugador
            db.run(
                `INSERT INTO jugadores
                 (nombre, correo, centro_universitario)
                 VALUES (?, ?, ?)`,
                [
                    nombreLimpio,
                    correoLimpio,
                    centroLimpio
                ],
                    function(errorInsercion) {

                    if (errorInsercion) {

                        console.error(errorInsercion);

                        if (
                            errorInsercion.code === "SQLITE_CONSTRAINT" ||
                            errorInsercion.code === "SQLITE_CONSTRAINT_UNIQUE"
                        ) {
                            return res.status(409).json({
                                codigo: "CORREO_DUPLICADO",
                                mensaje: "Este correo electrónico ya está registrado. Utiliza la opción Jugador existente."
                            });
                        }

                        return res.status(500).json({
                            codigo: "ERROR_SERVIDOR",
                            mensaje: "No fue posible registrar el jugador. Inténtalo nuevamente."
                        });
                    }

                    // Registro exitoso
                    return res.status(201).json({
                        id: this.lastID,
                        nombre: nombreLimpio,
                        correo: correoLimpio,
                        centro_universitario: centroLimpio,
                        existe: false
                    });
                }
            );
        }
    );
});

// ==========================================
// ACCESO DE JUGADOR EXISTENTE
// POST /players/login
// ==========================================

router.post("/login", (req, res) => {

    const { correo } = req.body || {};

    if (typeof correo !== "string") {
        return res.status(400).json({
            codigo: "CAMPOS_INCOMPLETOS",
            mensaje: "Debes ingresar tu correo electrónico para continuar."
        });
    }

    const correoLimpio = correo.trim().toLowerCase();

    if (
        !correoLimpio ||
        correoLimpio.length > 254 ||
        !formatoCorreo.test(correoLimpio)
    ) {
        return res.status(400).json({
            codigo: "CORREO_INVALIDO",
            mensaje: "Ingresa un correo electrónico válido. Ejemplo: estudiante@correo.com."
        });
    }

    db.get(
        `SELECT
            id,
            nombre,
            correo,
            centro_universitario
         FROM jugadores
         WHERE LOWER(TRIM(correo)) = ?`,
        [correoLimpio],
        (error, jugador) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    codigo: "ERROR_SERVIDOR",
                    mensaje: "No fue posible consultar los datos del jugador. Inténtalo nuevamente."
                });
            }

            if (!jugador) {
                return res.status(404).json({
                    codigo: "JUGADOR_NO_ENCONTRADO",
                    mensaje: "No existe un jugador registrado con ese correo electrónico. Verifica los datos o crea un jugador nuevo."
                });
            }

            return res.json({
                id: jugador.id,
                nombre: jugador.nombre,
                correo: jugador.correo,
                centro_universitario: jugador.centro_universitario,
                existe: true
            });
        }
    );
});

module.exports = router;
