//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEDD;

//Inicializar variables
var app = express();
var Usuario = require("../models/usuario");

var GoogleAuth = require("google-auth-library");
var auth = new GoogleAuth();

const GOOGLE_CLIENT_ID = require("../config/config").GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;
//Autenticacion goole
app.post("/google", (req, res) => {
  var token = req.body.token || "xxx";

  var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, "");
  client.verifyIdToken(token, GOOGLE_CLIENT_ID, function(e, login) {
    if (e) {
      return res.status(400).json({
        ok: false,
        mensaje: "Token no valido",
        errors: e
      });
    }
    var payload = login.getPayload();
    var userid = payload["sub"];

    Usuario.findOne({ email: payload.email }, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usaurio - login",
          errors: err
        });
      }

      if (usuario) {
        if (usuario.google === false) {
          return res.status(500).json({
            ok: false,
            mensaje: "Debe de usar autenticacion normal"
          });
        } else {
          usuario.password = ":-)";
          var token = jwt.sign({ usuario: usuario }, SEED, {
            expiresIn: 14400
          });

          res.status(200).json({
            ok: true,
            usuario: usuario,
            token: token,
            id: usuario._id
          });
        }
        //si usuario no existe
      }else {
        var usuario = new Usuario();

        usuario.nombre = payload.name;
        usuario.email = payload.email;
        usuario.password = ":-)";
        usuario.img = payload.picture;
        usuario.google = true;
        
        usuario.save( (err, usuarioDB) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al crear usaurio - google",
              errors: err
            });
          }
          var token = jwt.sign({ usuario: usuarioDB }, SEED, {
            expiresIn: 14400
          });

          res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
          });
        })
 
      }
    });
  });
});

//Autenticacion normal
app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - email",
        errors: err
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - password",
        errors: err
      });
    }

    //crear un token
    usuarioDB.password = ":-)";
    var token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 14400
    });

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id
    });
  });
});
module.exports = app;
