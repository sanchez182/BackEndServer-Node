//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//importar rutas
var appRoutes = require('./routes/appRoute');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


//Inicializar variables
var app = express();


//BodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//connexion a bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
   
});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('express corriendo en puerto 3000:\x1b[32m%s\x1b[0m', 'online');
});