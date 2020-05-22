const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        // console.log(data)

        //VERIFICACION DE EXISTENCIA DEL NOMBRE
        if (!data.nombre || !data.sala) {
            //RETORNO POR ERROR
            return callback({
                error: true,
                mensaje: 'El nombre / sala es necesario'
            });

        }

        //CONECTAR A UNA SALA
        client.join(data.sala);


        //AGREGAR NUEVO USUARIO AL ARREGO DE USUARIO
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //LISTA DE PERSONAS CUANDO UN USUARIO SE LOGEA
        client.broadcast.to(data.sala).emit('listarPersonas', usuarios.getPersonasPorSAla(data.sala));


        callback(usuarios.getPersonasPorSAla(data.sala));
    });

    //CREACION DE MENSAJE DE PERSONA
    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    })


    //LIMPIEZA DE USUARIO DESCONECTADO
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abando el chat`));

        client.broadcast.to(personaBorrada.sala).emit('listarPersonas', usuarios.getPersonasPorSAla(personaBorrada.sala));

    });

    //MENSAJES PRIVADOS
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    });


});