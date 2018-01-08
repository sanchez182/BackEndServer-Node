//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdWares = require("../middlewares/authentication");

//Inicializar variables
var app = express();
var Usuario = require("../models/usuario");

//Obtener todos los usuario
app.get("/", (req, res, next) => {
  //solo trae los campos q le digo
  Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuarios
    });
  });
});


//Actulizar un  usuario
app.put("/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuarioFind)=> {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar usuario",
              errors: err
            });
          }

          if(!usuarioFind) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con "+id+" no existe",
                errors: {message: 'No existe un usuario con ese ID'}
              });
          }

          usuarioFind.nombre = body.nombre;
          usuarioFind.email = body.email;
          usuarioFind.role = body.role;
      
          usuarioFind.save((err, usuarioGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error actualizar el usuario",
                errors: err
              });
            }
            res.status(201).json({
              ok: true,
              usuario: usuarioGuardado
            });
          });

          usuarioFind.password = ':-)';
    });  
  });


//Crear un nuevo usuario
app.post("/", mdWares.verificaToken, (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password,10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        erors: err
      });
    }
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: req.usuario
    });
  });
});

//borrar usuario
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar usuario",
              errors: err
            });
          }
          if (!usuarioBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe usuario con ese id",
              errors: err
            });
          }
          res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
          });
    })
})

module.exports = app;
