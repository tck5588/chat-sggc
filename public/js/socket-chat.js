var socket = io();

//OBTENCION DEL USUARIO POR URL
var params = new URLSearchParams(window.location.search);
//COMPROBACION DE EXISTENCIA DEL USUARIO
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son es necesarios');

}
//ALMACENAMIENTO USUARIO
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}





socket.on('connect', function() {
    console.log('Conectado al servidor');

    //DETECCION DE NUVO USUARIO
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios Conectados', resp);
    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//ESCUCHAR ENTRADAS Y SALIDAS DEL CHAT
socket.on('listarPersonas', function(personas) {

    console.log('Servidor:', personas);

});

//MENSAJES PRIVADOS
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
})