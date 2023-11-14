//Nombre de usuario y boton desconectar
let usuario = localStorage.getItem('nombre');
if (usuario == '' || usuario == null) {
  location.href = 'login.html';
} else {
  document.getElementById('nombre').innerHTML += usuario;
}
let logout = document.getElementById('salir');
logout.addEventListener('click', function () {
  localStorage.removeItem('nombre');
  localStorage.removeItem('email');
  alert('Desconexion exitosa', 'Vuelve pronto');
  location.href = 'login.html';
});
const imagenInput = document.getElementById('imagen');
const perfilImagen = document.getElementById('perfilImagen');

// Cargar la imagen del almacenamiento local al iniciar la página
let fotoPerfil = localStorage.getItem('fotoPerfil');
if (fotoPerfil) {
  perfilImagen.src = fotoPerfil;
}

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el elemento de entrada de archivo y el elemento de imagen

  // Escuchar cambios en el campo de entrada de archivo
  imagenInput.addEventListener('change', function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Crear una URL del archivo seleccionado
      const imageUrl = URL.createObjectURL(selectedFile);

      // Almacenar la URL en el almacenamiento local
      localStorage.setItem('fotoPerfil', imageUrl);

      // Actualizar la imagen del perfil con la imagen seleccionada
      perfilImagen.src = imageUrl;
    }
  });
});

// Script para validaciones del perfil y guardar en el local Storage

document.addEventListener('DOMContentLoaded', () => {
  let botonConfirmarCambios = document.getElementById('guardarCambios');
  //Se obtiene el email guardado
  let email = localStorage.getItem('email');
  //Se cargan los inputs del html
  let firstName = document.getElementById('primerNombre');
  let firstLastName = document.getElementById('primerApellido');
  let secondName = document.getElementById('segundoNombre');
  let secondLastName = document.getElementById('segundoApellido');
  let correo = (document.getElementById('email'));
  correo.value = email;
  correo.disabled = true;
  let phone = document.getElementById('telefono');
  let datosUsuario = {};
  //Tomo datos del storage si los hay.
  if (localStorage.getItem('datosdelUsuario')) {
    let userData = JSON.parse(localStorage.getItem('datosdelUsuario'));
    firstName = document.getElementById('primerNombre').value = userData.primerNombre;
    firstLastName = document.getElementById('primerApellido').value = userData.primerApellido;
    secondName = document.getElementById('segundoNombre').value = userData.segundoNombre;
    secondLastName = document.getElementById('segundoApellido').value = userData.segundoApellido;
    phone = document.getElementById('telefono').value = userData.telefono;
  }
  //Se almacenan los datos del usuario
  botonConfirmarCambios.addEventListener('click', () => {
    let mensajeDeErrorNombre = document.getElementById('mensajeErrorNombre');
    let mensajeDeErrorApellido = document.getElementById('mensajeErrorApellido');
    let mensajeDeErrorTelefono = document.getElementById('mensajeErrorTelefono');
    let alerta = document.getElementById('alerta');

    firstName = document.getElementById('primerNombre').value;
    firstLastName = document.getElementById('primerApellido').value;
    secondName = document.getElementById('segundoNombre').value;
    secondLastName = document.getElementById('segundoApellido').value;
    phone = document.getElementById('telefono').value;

    mensajeDeErrorNombre.textContent = ' ';
    mensajeDeErrorApellido.textContent = ' ';
    mensajeDeErrorTelefono.textContent = ' ';

    if (firstName === '') {
      mensajeDeErrorNombre.textContent = 'Por favor, debe ingresar un nombre';
    }

    if (firstLastName === '') {
      mensajeDeErrorApellido.textContent = 'Por favor, debe ingresar un apellido';
    }

    if (phone === '') {
      mensajeDeErrorTelefono.textContent = 'Por favor, debe ingresar un teléfono de contacto';
    }

    if (firstName !== '' && firstLastName !== '' && correo !== '') {
      datosUsuario = {
        primerNombre: firstName,
        primerApellido: firstLastName,
        segundoNombre: secondName,
        segundoApellido: secondLastName,
        email: correo,
        telefono: phone,
      };
      localStorage.setItem('datosdelUsuario', JSON.stringify(datosUsuario));
    }
    
    // Mostrar alerta de Bootstrap
    alerta.classList.add('show');
  });
});
