//Requires
var express = require("express");

//Inicializar variables
var app = express();
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");
var Usuario = require("../models/usuario");

//busqueda general
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuario(busqueda, regex),
  ]).then(respuestas => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

//busqueda por coleccion
app.get("/coleccion/:tabla/:busqueda", (req, res) => {
  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla;
  var regex = new RegExp(busqueda, "i");
  var promesa;

  switch (tabla) {
    case 'usuarios':
      promesa = buscarUsuario(busqueda, regex);
      break;
    
    case 'medicos':
      promesa = buscarMedicos(busqueda, regex);
      break;

    case 'hospitales':
      promesa = buscarHospitales(busqueda, regex);
      break;

    default:
      return res.status(400).json({
        ok:false,
        mensaje: 'Los tipos de busqueada son : usuarios, hospitales y medicos',
        error: { message: 'Tipo de tabla no valido'}
      });
  }

  promesa.then ( data =>{
    res.status(200).json({
      ok:false,
      [tabla]: data
    });
  });
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }, (err, hospitales) => {
      if (err) {
        reject("Error al cargar hospi", err);
      } else {
        resolve(hospitales);
      }
    });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate('usuario','nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
      if (err) {
        reject("Error al cargar medicos", err);
      } else {
        resolve(medicos);
      }
    });
  });
}

function buscarUsuario(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre email role')
      .or([{ 'nombre': regex }, { 'email': regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al cargar usuarios");
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
