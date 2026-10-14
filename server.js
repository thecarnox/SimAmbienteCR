
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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Servidor activo en http://localhost:${PORT}`
    );
});
