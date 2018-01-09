var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = moongose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioShema = new Schema({
    nombre: {type: String, required:[true,'El nombre es necesario'] },
    email: {type: String, unique:true ,required:[true,'El correo es necesario'] },
    password: {type: String,required:[true,'El password es necesario'] },
    img: {type: String,required:false},
    role: {type: String,required:true, default: 'USER_ROLE', enum: rolesValidos },
    google: {type: Boolean,required:true, default:false},
});

usuarioShema.plugin ( uniqueValidator, {message : '{PATH} debe de ser unico'})
module.exports = moongose.model('Usuario', usuarioShema);