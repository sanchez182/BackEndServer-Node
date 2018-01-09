//Requires
var express = require("express");


//Inicializar variables
var app = express();
var Hospital = require("../models/hospital");
var mdWares = require("../middlewares/authentication");

//Obtener todos los hospitales
app.get("/", (req, res, next) => {
    var desde =req.query.desde || 0;
    desde = Number(desde);
  //solo trae los campos q le digo
  Hospital.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario', 'nombre email')
  .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err
      });
    }
    Hospital.count({} , (err,conteo) => {
        res.status(200).json({
        ok: true,
        hospitales,
        totalMedico: conteo
      });
      }); 
  });
});


//Actulizar un  usuario
app.put("/:id", (req, res) => {
    var id = req.params.id; 
    var body = req.body;

    Hospital.findById(id, (err, hospitalFind)=> {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar hospital",
              errors: err
            });
          }

          if(!hospitalFind) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con "+id+" no existe",
                errors: {message: 'No existe un hospital con ese ID'}
              });
          }

          hospitalFind.nombre = body.nombre;
         hospitalFind.usuario = req.usuario; 
      
          hospitalFind.save((err, hospitalGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error actualizar el hospital",
                errors: err
              });
            }
            res.status(200).json({
              ok: true,
              hospital: hospitalGuardado
            });
          });
    });  
  });


//Crear un nuevo hospital
app.post("/", mdWares.verificaToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

//borrar usuario
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar hospital",
              errors: err
            });
          }
          if (!hospitalBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe hospital con ese id",
              errors: err
            });
          }
          res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
          });
    })
})

module.exports = app;
