// server.js

const express = require('express');
const path    = require('path');
const app     = express();

// 1) Apunta a tu carpeta build de Angular (directamente en dist/<app-name>)
const distPath = path.join(__dirname, 'dist', 'dgsin-2425-21-front');
console.log('Sirviendo desde:', distPath);

// 2) Sirve los assets estáticos
app.use(express.static(distPath));

// 3) Catch-all usando una RegExp para rutas de Angular (HTML5 pushState)
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 4) Arranca el servidor en el puerto de App Engine (o 4200 local)
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`🚀 Frontend escuchando en puerto ${port}`);
});
