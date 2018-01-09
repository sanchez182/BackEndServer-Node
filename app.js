//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//server index config


//importar rutas
var appRoutes = require('./routes/appRoute');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospitalRoute');
var medicoRoutes = require('./routes/medicoRoute');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenesRoutes');

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
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenesRoutes);



app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('express corriendo en puerto 3000:\x1b[32m%s\x1b[0m', 'online');
});