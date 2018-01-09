//Requires
var express = require("express");

var mdWares = require("../middlewares/authentication");

//Inicializar variables
var app = express();
var Medico = require("../models/medico");

//Obtener todos los medicos
app.get("/", (req, res, next) => {
  var desde =req.query.desde || 0;
  desde = Number(desde);
  
  //solo trae los campos q le digo
  Medico.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario', 'nombre email')
  .populate('hospital')
  .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando medicos",
        errors: err
      });
    }

    Medico.count({} , (err,conteo) => {
      res.status(200).json({
      ok: true,
      medicos,
      totalMedico: conteo
    });
    });
  
  });
});


//Actulizar un  medico
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medicoFind)=> {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar medico",
              errors: err
            });
          }

          if(!medicoFind) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con "+id+" no existe",
                errors: {message: 'No existe un medico con ese ID'}
              });
          }

          medicoFind.nombre = body.nombre;
        //  medicoFind.usuario = req.usuario._id;
          medicoFind.hospital = body.hospital;
      
          medicoFind.save((err, medicoGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error actualizar el usuario",
                errors: err
              });
            }
            res.status(201).json({
              ok: true,
              medico: medicoGuardado
            });
          });

    });  
  });


//Crear un nuevo medico
app.post("/", mdWares.verificaToken, (req, res) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id, 
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error cargando medico",
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      usuario: medicoGuardado
    });
  });
});

//borrar medico
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar medico",
              errors: err
            });
          }
          if (!medicoBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe medico con ese id",
              errors: err
            });
          }
          res.status(200).json({
            ok: true,
            usuario: medicoBorrado
          });
    })
})

module.exports = app;
