const {response} = require('express');
const bcryptjs = require('bcryptjs');
const {clearRUT} = require('validar-rut');
const nodemailer = require('nodemailer')

const Usuario = require('../models/usuario.model');

const crearUsuario = async(req, res) => {

    const {rut, nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({rut, nombre, correo, password, rol});
    
    //Limpiar RUT
    const rutLimpio = clearRUT(rut);
    usuario.rut = rutLimpio;

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    
    //Opciones de email
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'certificadorblockchain@gmail.com',
          pass: 'jota221193'
        }
      });

    let mailOptions = {
        from: 'juantpiqq@gmail.com',
        to: usuario.correo,
        subject: 'CertificadorBlockaion - Valida tu correo',
        html: `
        <center>
            <div style='background-color:#001936; 
                border-radius: 20px; 
                width: 50vw;
                height: 25vh'>
                <h1 style='color: #f59d00; padding:20px;'>Bienvenido al Certificador
                    <strong style='font-weight: bold; 
                        color:#fff;'>
                        Blockchain</strong></h1>
                <p style='color:#fff;
                    margin-bottom: 20px;
                '>
                    Necesitamos verificar tu dirección de correo electrónico para poder iniciar tu cuenta. 
                </p>

                <button style='background-color: #287bff; height: 4vh; width: 30vw; color:#fff; font-size: 25px; border: none; border-radius: 20px; margin-bottom: 20px; cursor:pointer'>
                        <a  href='https://certificador.herokuapp.com/verificar/${usuario.rut}'
                            style='text-decoration:none; color:#fff;'
                        >
                            Verificar Email
                        </a>
                </button>          
            </div>
        </center>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });



    //Guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'Usuario creado correctamente',
        usuario
    })
}

const activarEmail = async(req, res) => {
    const {id} = req.params;
    const rut = id;

    const usuario = await Usuario.findOneAndUpdate({rut}, {estado: true});
    if(!usuario){
        return res.status(400).json({
            msg: 'No se puede validar este rut'
        })
    }

    res.json(usuario);
}

const actualizarUsuario = async(req, res) => {

    const {id} = req.params;
    const {_id, rut, password, correo, ...resto} = req.body

    //TODO Validar contra base de datos
    if(password){
       //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt); 
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json(usuario)
}

const getUsuarios = async(req, res) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const eliminarUsuario = async(req, res) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        usuario
    })    
}

module.exports = {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    getUsuarios,
    activarEmail
}