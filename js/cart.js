const URL_CART = `https://japceibal.github.io/emercado-api/user_cart/25801.json`;
let costeDeProductosTotal = 0;
let costeEnvio = 0;

// Recuperar datos de localStorage
const cartFromLocalStorage = JSON.parse(localStorage.getItem('cartProducts'));


fetch(URL_CART)
  .then(response => response.json())
  .then(data => {
    showList(data);
    calcularCostos();
  })
  .catch(err => {
    console.error('Hubo un error al cargar los datos', err);
  });

document.addEventListener('DOMContentLoaded', function () {
  let values = document.getElementsByClassName('cantidadProd');
  let envio = document.getElementById('tipoEnvio'); //Este es el div que contiene los radio check para el tipo de envio.

  if (cartFromLocalStorage) {
    showListFromStorage(cartFromLocalStorage);
    modificarSubtotal();
    calcularCostos();
  }
});

function showList(data) {
  let list = document.getElementById('listaCarrito');
  for (let one of data.articles) {
    list.innerHTML += `
        <div class="form-control py-1" id="cssList">
            <div class="row py-0">
                <div class="col text-center fnt-size px-1"><img src="${one.image}" title="producto" class="imagenCart img-fluid float-start"></div>
                <div class="col text-center fnt-size px-1">${one.name}</div>
                <div class="col text-center fnt-size px-0 py-0"><div class="col"><div class="col">${one.currency}</div><div class="col cost">${one.unitCost}</div></div></div>
                <div class="col text-center fnt-size px-1 py-1"><input type="number" id="units" min="1" value="${one.count}" class="cantidadProd"></div>
                <div class="col text-center fnt-size px-1 py-0"><div class="col"><div class="col">${one.currency}</div><div class="col subTot">${one.unitCost * one.count}</div></div></div>
            </div>
        </div>
        `;
  }
  let cantidadInputs = document.querySelectorAll('.cantidadProd');
  cantidadInputs.forEach(input => {
    input.addEventListener('change', function () {
      modificarSubtotal();
      calcularCostos();
      tipoEnvio();
      precioTotal();
    });
  });
}

function showListFromStorage(data) {
  let list = document.getElementById('listaCarrito');
  for (let article of data) {
    list.innerHTML += `
      <div class="form-control py-1" id="cssList">
        <div class="row py-0">
          <div class="col text-center fnt-size px-1"><img src="${article.Imagen}" title="producto" class="imagenCart img-fluid float-start"></div>
          <div class="col text-center fnt-size px-1">${article.Nombre}</div>
          <div class="col text-center fnt-size px-0 py-0"><div class="col"><div class="col">${article.Divisa}</div><div class="col cost">${article.CosteUnidad}</div></div></div>
          <div class="col text-center fnt-size px-1 py-1"><input type="number" min="1" value="${article.Cantidad}" class="cantidadProd"></div>
          <div class="col text-center fnt-size px-1 py-0"><div class="col"><div class="col">${article.Divisa}</div><div class="col subTot">${article.Cantidad * article.CosteUnidad}</div></div></div>
        </div>
      </div>
    `;
  }

  // Agregar el evento change a todos los elementos con la clase "cantidadProd"
  let cantidadInputs = document.querySelectorAll('.cantidadProd');
  cantidadInputs.forEach(input => {
    input.addEventListener('change', function () {
      modificarSubtotal();
      calcularCostos();
      tipoEnvio();
      precioTotal();
    });
  });
}

function modificarSubtotal() {
  let cantidadInputs = document.querySelectorAll('.cantidadProd');
  let preciosProducto = document.querySelectorAll('.cost');
  let subtotales = document.querySelectorAll('.subTot');

  for (let i = 0; i < cantidadInputs.length; i++) {
    let cantidad = parseInt(cantidadInputs[i].value);
    let precio = parseFloat(preciosProducto[i].textContent);
    subtotales[i].innerHTML = cantidad * precio;
  }
}

function calcularCostos() {
  let mostrarPreciosProductos = document.querySelector('#costo');
  let preciosProductos = document.querySelectorAll('.subTot');

  costeDeProductosTotal = 0;

  for (let i = 0; i < preciosProductos.length; i++) {
    costo = Number(preciosProductos[i].innerHTML);
    
    costeDeProductosTotal += costo;
  }

  mostrarPreciosProductos.value = costeDeProductosTotal;
  console.log(costeDeProductosTotal);
}

function tipoEnvio() {
  let mostrarPrecioEnvio = document.querySelector('#envio');

  envioStandard = document.querySelector('#envioStandard').checked;
  envioRapido = document.querySelector('#envioRapido').checked;
  envioExpress = document.querySelector('#envioExpress').checked;

  if (envioStandard) {
    costeEnvio = costeDeProductosTotal * 0.05;
  } else if (envioRapido) {
    costeEnvio = costeDeProductosTotal * 0.07;
  } else if (envioExpress) {
    costeEnvio = costeDeProductosTotal * 0.15;
  }
  mostrarPrecioEnvio.value = costeEnvio;
}

var radios = document.getElementsByName('envío');

radios.forEach(function (radio) {
  radio.addEventListener('change', function () {
    if (radio.checked) {
      tipoEnvio();
      precioTotal();
    }
  });
});

function precioTotal() {
  let mostrarPrecioTotal = document.querySelector('#total');

  mostrarPrecioTotal.value = costeEnvio + costeDeProductosTotal;
}

const validacion = document.getElementById('validar');
const obTransferencia = document.getElementById('Transferencia');
const obTarjeta = document.getElementById('tarjetacredito');
const avisoMetodo = document.getElementById('DebeCambiar');
const obNumTarjeta = document.getElementById('numero1');
const obCodSeg = document.getElementById('codigo');
const obVencimiento = document.getElementById('vencimiento');
const obNumCuenta = document.getElementById('Numcuenta');
const mensajeErrorNumero1 = document.getElementById('mensajeErrorNumero1');
const mensajeErrorCodigo = document.getElementById('mensajeErrorCodigo');
const mensajeErrorVencimiento = document.getElementById('mensajeErrorVencimiento');
const mensajeErrorNumCuenta = document.getElementById('mensajeErrorNumCuenta');

validacion.addEventListener('click', (event) => {
  event.preventDefault();

  let resultado = "";
  mensajeErrorNumero1.textContent = '';
  mensajeErrorCodigo.textContent = '';
  mensajeErrorVencimiento.textContent = '';
  mensajeErrorNumCuenta.textContent = '';

  if (obTransferencia.checked) {
    if (obNumTarjeta.value !== '') {
      obNumTarjeta.value = ''; // Borrar número de tarjeta
    }
    if (obCodSeg.value !== '') {
      obCodSeg.value = ''; // Borrar código de seguridad
    }
    if (obVencimiento.value !== '') {
      obVencimiento.value = ''; // Borrar vencimiento
    }
    if (obNumCuenta.value === '') {
      mensajeErrorNumCuenta.textContent = 'Debe poner su número de cuenta';
    } else {
      resultado = "Transferencia Bancaria";
    }
  } else if (obTarjeta.checked) {
    if (obNumCuenta.value !== '') {
      obNumCuenta.value = ''; // Borrar número de cuenta
    }
    const numeroTarjeta = obNumTarjeta.value.trim();
    const codigoSeguridad = obCodSeg.value.trim();
    const vencimiento = obVencimiento.value.trim();

    if (numeroTarjeta === '') {
      mensajeErrorNumero1.textContent = 'Debe poner su número de tarjeta';
    }
    if (codigoSeguridad === '') {
      mensajeErrorCodigo.textContent = 'Debe poner su código de seguridad';
    }
    if (vencimiento === '') {
      mensajeErrorVencimiento.textContent = 'Debe seleccionar una fecha de vencimiento';
    }
    
    if (numeroTarjeta !== '' && codigoSeguridad !== '' && vencimiento !== '') {
      resultado = "Tarjeta de Crédito";
    }
  }
  avisoMetodo.textContent = resultado;
});

const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

modal._element.addEventListener('hidden.bs.modal', function () {
  // Limpiar campos y mensajes cuando se cierra el modal
  obNumTarjeta.value = '';
  obCodSeg.value = '';
  obVencimiento.value = '';
  obNumCuenta.value = '';
  mensajeErrorNumero1.textContent = '';
  mensajeErrorCodigo.textContent = '';
  mensajeErrorVencimiento.textContent = '';
  mensajeErrorNumCuenta.textContent = '';
});

// Bloqueo y desbloqueo de campos según la opción seleccionada
obTransferencia.addEventListener('change', () => {
  if (obTransferencia.checked) {
    // Si selecciona "Transferencia Bancaria," bloquea los campos de tarjeta de crédito
    obNumTarjeta.disabled = true;
    obCodSeg.disabled = true;
    obVencimiento.disabled = true;

    // Desbloquea el campo de número de cuenta
    obNumCuenta.disabled = false;
  }
});



obTarjeta.addEventListener('change', () => {
  if (obTarjeta.checked) {
    // Si selecciona "Tarjeta de Crédito," bloquea el campo de número de cuenta
    obNumCuenta.disabled = true;

    // Desbloquea los campos de tarjeta de crédito
    obNumTarjeta.disabled = false;
    obCodSeg.disabled = false;
    obVencimiento.disabled = false;
  }
});

//Validacion campo vencimiento

document.getElementById('vencimiento').addEventListener('input', function (e) {
  const input = e.target;
  let value = input.value;
  const errorMessage = document.getElementById('mensajeErrorVencimiento');
  
  // Eliminar cualquier mensaje de error previo
  errorMessage.textContent = '';

  if (/^\d{2}\/\d{4}$/.test(value)) {
    const month = value.split('/')[0];
    const year = value.split('/')[1];
    
    if (month >= '01' && month <= '12' && year >= '2024' && year <= '2036') {
      // Formato válido y año en el rango permitido
    } else {
      errorMessage.textContent = 'La fecha no es válida';
    }
  }
  // Agregar automáticamente la barra después de escribir el mes
  else if (/^\d{2}$/.test(value)) {
    input.value = value + '/';
  }
  // Permite borrar la barra
  else if (/^\d{2}\/$/.test(value)) {
    input.value = value.substring(0, 2);
  }
  // Permite borrar la barra y el mes si se desea
  else if (/^\d{0,2}\/\d{0,4}$/.test(value)) {
    // No se hace nada, permite borrar la barra y el mes
  }
  // Restringe que después de la barra haya exactamente 4 dígitos
  else if (/^\d{2}\/\d{5,}$/.test(value)) {
    input.value = value.substring(0, 7);
  }
});


//Validaciones del botón de Compra


const BotónComprar = document.getElementById('BotóndeCompra');
const calle = document.getElementById('calle');
const numeroDireccion = document.getElementById('numerodireccion');
const esquina = document.getElementById('esquina');

const mensajeErrorCalle = document.getElementById('mensajeErrorCalle');
const mensajeErrorNumero = document.getElementById('mensajeErrorNumero');
const mensajeErrorEsquina = document.getElementById('mensajeErrorEsquina');

const alertaExito = document.getElementById('alertaExito');

const mensajeErrorPago = document.getElementById("mensajedeError");

BotónComprar.addEventListener('click', () => {
  const calleValue = calle.value.trim();
  const numeroDireccionValue = numeroDireccion.value.trim();
  const esquinaValue = esquina.value.trim();

  // Restablece todos los mensajes de error
  mensajeErrorPago.textContent = '';
  mensajeErrorCalle.textContent = '';
  mensajeErrorNumero.textContent = '';
  mensajeErrorEsquina.textContent = '';

  if (calleValue === '') {
    mostrarMensajeError(mensajeErrorCalle, 'Por favor, ingrese una calle');
  }

  if (numeroDireccionValue === '') {
    mostrarMensajeError(mensajeErrorNumero, 'Por favor, ingrese un número');
  }

  if (esquinaValue === '') {
    mostrarMensajeError(mensajeErrorEsquina, 'Por favor, ingrese una esquina');
  }

  if(avisoMetodo.textContent === "No ha seleccionado"){
    mostrarMensajeError(mensajeErrorPago, "Debe seleccionar una forma de pago");
  }

  if (calleValue !== '' && numeroDireccionValue !== '' && esquinaValue !== '' && avisoMetodo.textContent != "No ha seleccionado") {
    alertaExito.style.display = 'block'; // Muestra la alerta de éxito
    alertaExito.classList.add('animate__bounceIn'); // Aplica la animación
  }
  
  
});

function mostrarMensajeError(elemento, mensaje) {
  elemento.textContent = mensaje;
}

document.getElementById("BotóndeCompra").addEventListener("click", function() {
  let tipoEnvioInputs = document.getElementsByName("envío");
  let seleccionado = false;

  for (let i = 0; i < tipoEnvioInputs.length; i++) {
    if (tipoEnvioInputs[i].checked) {
      seleccionado = true;
      break;
    }
  }

  if (!seleccionado) {
    document.getElementById("errorMensaje").textContent = "Por favor, seleccione un tipo de envío.";
    return false;
  }

  // Continuar con el proceso de finalizar compra si se ha seleccionado un tipo de envío.
});
