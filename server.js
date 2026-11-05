
const express = require("express");
const path = require("path");

const app = express();

const db = require("./database/database");

const playerRoutes = require("./routes/players");
const progresoRoutes = require("./routes/progreso");

// ==========================================
// CONFIGURACIÓN
// ==========================================

app.use(express.json());

// ==========================================
// ARCHIVOS ESTÁTICOS
// ==========================================

// Servir carpeta public
app.use(express.static(path.join(__dirname, "public")));

// PlayCanvas
app.use(
    "/playcanvas",
    express.static(
        path.join(
            __dirname,
            "node_modules",
            "playcanvas",
            "build"
        )
    )
);

// ==========================================
// RUTAS API
// ==========================================

// Registro y consulta de jugadores
app.use("/players", playerRoutes);

// Guardado y consulta del progreso
app.use("/progreso", progresoRoutes);

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
    console.log(
        `Servidor activo en http://${HOST}:${PORT}`
    );
});