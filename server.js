const express = require('express');
const app = express();

// Servir carpeta public
app.use(express.static('public'));

// PlayCanvas
app.use('/playcanvas', express.static('node_modules/playcanvas/build'));

app.listen(3000, () => {
    console.log('Servidor activo en http://localhost:3000');
});