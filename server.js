const express = require('express');
const app = express();

const db = require('./database/database');
const playerRoutes = require('./routes/players');

app.use(express.json());

// Servir carpeta public
app.use(express.static('public'));

// PlayCanvas
app.use('/playcanvas', express.static('node_modules/playcanvas/build'));

app.use('/players', playerRoutes);

app.listen(3000, () => {
    console.log('Servidor activo en http://localhost:3000');
});