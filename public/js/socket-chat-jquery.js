var params = new URLSearchParams(window.location.search);


var nombre = params.get('nombre');
var sala = params.get('sala');
//REFERENCIAS JQ
var divUsuario = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

//FUNCIONES PARA RENDERIZADO USUARIOS JQ

function renderizarusuarios(personas) {
    console.log(personas);

    var html = '';

    //NOMBRE DE LA SALA ACTIVA
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';


    //USUARIOS ACTIVOS

    for (var i = 0; i < personas.length; i++) {
        html += '<li>'
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsuario.html(html)

}


function renderizarMensajes(mensaje, yo) {

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    //RENDERIZADO DE ENVIO DE MESAJE ADMIN
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger'
    }


    var html = '';

    if (yo) {
        //MENSAJES EMITIDOS POR USUARIO
        html += '<li class="reverse animated fadeIn">'
        html += '    <div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '    <div class="box bg-light-info">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'


    } else {
        //   MENSAJES RECIBIDOS
        html += '    <li class="animated fadeIn">'

        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }

        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>';

    }




    divChatbox.append(html);

}




function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}






//LISTENERES

divUsuario.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id)

    }
})

formEnviar.on('submit', function(e) {
    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return
    }



    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus();
        renderizarMensajes(resp, true);
        scrollBottom();
    });

})