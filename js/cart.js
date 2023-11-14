const URL_CART = `https://japceibal.github.io/emercado-api/user_cart/25801.json`;
let costeDeProductosTotal = 0;
let costeEnvio = 0;

// Recuperar datos de localStorage
let cartFromLocalStorage = JSON.parse(localStorage.getItem('cartProducts')) || [];
let productosEnCarrito = JSON.parse(localStorage.getItem('cartProducts')) || [];


fetch(URL_CART)
.then(response => response.json())
.then(data => {
  recorrerJapList(data);
})
.catch(err => {
  console.error('Hubo un error al cargar los datos', err);
});

document.addEventListener('DOMContentLoaded', function () {
  // Si existe un carrito almacenado en el almacenamiento local, se llaman a las funciones 
 
  if(cartFromLocalStorage){
    console.log(cartFromLocalStorage);
    showListFromStorage(cartFromLocalStorage);
    actualizarCostos();
  }

  //Nombre de usuario y boton desconectar
  let usuario = localStorage.getItem('nombre');
  if (usuario=="" || usuario==null){
      location.href='login.html';
  }else{
      document.getElementById('nombre').innerHTML += usuario;
  }
  let logout = document.getElementById('salir');
  logout.addEventListener('click', function(){
      localStorage.removeItem('nombre');
      localStorage.removeItem('email');
      alert('Desconexion exitosa', 'Vuelve pronto');
      location.href="login.html";
  })
});
//Muestra una lista de elementos de carrito de compras
function showListFromStorage(data) {
  let list = document.getElementById('listaCarrito');
  list.innerHTML = "";
  for (let article of data) {
    list.innerHTML += `
    <div class="row">
    <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
      <!-- Image -->
      <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
        <img src="${article.image}" title="producto""
          class="w-100" alt="imagenProducto" />
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
        </a>
      </div>
      <!-- Image -->
    </div>
    <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
      <!-- Data -->
      <p><strong>${article.name}</strong></p>
      <!-- Price -->
      <div class="text-start text-md-center">
        <div>${article.currency}</div>
        <div class="cost">${article.cost}</div>
      </div>
      <!-- Price -->
      <button type="button" class="btn btn-primary btn-sm me-1 mb-2" data-mdb-toggle="tooltip"
        title="Remove item" onclick="eliminarProducto('${article.name}')">
        <i class="fas fa-trash"></i>
      </button>
      <!-- Data -->
    </div>
    <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
      <!-- Quantity -->
      <div class="d-flex mb-4" style="max-width: 300px">
        <button class="btn btn-primary px-3 me-2"
          onclick="this.parentNode.querySelector('input[type=number]').stepDown(), actualizarCostos()">
          <i class="fas fa-minus"></i>
        </button>
        <div class="form-outline">
          <input id="form1" min="0" name="quantity" value="${article.count}" type="number" class="form-control cantidadProd" />
          <label class="form-label" for="form1">Cantidad</label>
        </div>
        <button class="btn btn-primary px-3 ms-2"
          onclick="this.parentNode.querySelector('input[type=number]').stepUp(), actualizarCostos()">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <!-- Price -->
      <div class="row">
        <div class="col">
          Subtotal: USD
          <div class="col-10 text-end subTot">
            ${article.count * obtenerMoneda(article.cost, article.currency)}
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr class="my-4"/>
    `;
  }
  // Agregar el evento change a todos los elementos con la clase "cantidadProd"
  let cantidadInputs = document.querySelectorAll('.cantidadProd');
  cantidadInputs.forEach(input => {
    input.addEventListener('change', function () {
      actualizarCostos();
    });
  });
}
//Actualizar los subtotales de los productos en el carrito de compras en función de la cantidad seleccionada por el usuario.
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
//Mostrar costo total de los productos en el carrito de compras
function calcularCostos() {
  let mostrarPreciosProductos = document.querySelector('#costo');
  let preciosProductos = document.querySelectorAll('.subTot');

  costeDeProductosTotal = 0;

  for (let i = 0; i < preciosProductos.length; i++) {
    costo = Number(preciosProductos[i].innerHTML);
    
    costeDeProductosTotal += costo;
  }

  mostrarPreciosProductos.innerHTML = costeDeProductosTotal;
  //console.log(costeDeProductosTotal);
}
//Calcular costo de envío y mostrarlo
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
  mostrarPrecioEnvio.innerHTML = parseInt(costeEnvio);
}

function precioTotal() {
  let mostrarPrecioTotal = document.querySelector('#total');
  mostrarPrecioTotal.innerHTML = costeEnvio + costeDeProductosTotal;
}
//Validaciones de datos
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
      modalPago.hide();
      validacionPago=true;
      alertaPagoExito.style.display = 'block'; // Muestra la alerta de éxito
      alertaPagoExito.classList.add('animate__bounceIn'); // Aplica la animación
      setTimeout(function () {

        // Closing the alert
        bsAlertaPago.close();
      }, 5000);
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
      modalPago.hide();
      validacionPago=true;
      alertaPagoExito.style.display = 'block'; // Muestra la alerta de éxito
      alertaPagoExito.classList.add('animate__bounceIn'); // Aplica la animación
      setTimeout(function () {

        // Closing the alert
        bsAlertaPago.close();
      }, 5000);
    }
  }
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


//Botón de validacion dirección
let validacionDireccion = false;
let validacionPago = false;
let validacionTipoEnvio = true;
const validarDireccion = document.getElementById('validarDireccion');
const calle = document.getElementById('calle');
const numeroDireccion = document.getElementById('numerodireccion');
const esquina = document.getElementById('esquina');

const mensajeErrorCalle = document.getElementById('mensajeErrorCalle');
const mensajeErrorNumero = document.getElementById('mensajeErrorNumero');
const mensajeErrorEsquina = document.getElementById('mensajeErrorEsquina');

const alertaExito = document.getElementById('alertaExito');
const alertaDireccionExito = document.getElementById('alertaDireccionExito');
const alertaPagoExito = document.getElementById('alertaPagoExito');

var modalDireccion = new bootstrap.Modal(document.getElementById('modalDireccion'), {
  keyboard: false
})
var modalPago = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
  keyboard: false
})
var alertaDireccion = document.getElementById('alertaDireccionExito')
var bsAlertaDireccion = new bootstrap.Alert(alertaDireccion)


validarDireccion.addEventListener('click', () => {
  const calleValue = calle.value.trim();
  const numeroDireccionValue = numeroDireccion.value.trim();
  const esquinaValue = esquina.value.trim();

  // Restablece todos los mensajes de error
  
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

 

  if (calleValue !== '' && numeroDireccionValue !== '' && esquinaValue !== '') {
    modalDireccion.hide();
    validacionDireccion = true;
    alertaDireccionExito.style.display = 'block'; // Muestra la alerta de éxito
    alertaDireccionExito.classList.add('animate__bounceIn'); // Aplica la animación
    setTimeout(function () {

      // Closing the alert
      bsAlertaDireccion.close();
    }, 5000);
  }
  
  
});

function mostrarMensajeError(elemento, mensaje) {
  elemento.textContent = mensaje;
}

//Botón comprar


var alertaExitoBS = document.getElementById('alertaExito')
var bsAlertaExito = new bootstrap.Alert(alertaExitoBS)

const botonCompra = document.getElementById('botonCompra');
botonCompra.addEventListener('click',()=> {
  if (validacionDireccion &&  validacionPago && validacionTipoEnvio ) {
    alertaExito.style.display = 'block'; // Muestra la alerta de éxito
    alertaExito.classList.add('animate__bounceIn'); // Aplica la animación
    setTimeout(function () {

      // Closing the alert
      bsAlertaExito.close();
    }, 8000);
  }
});
function actualizarCostos(){
  modificarSubtotal();
  calcularCostos();
  tipoEnvio();
  precioTotal();
}
function eliminarProducto(nombreProducto) {
  // Recupera el carrito del almacenamiento local
  let carritoLocalStorage = JSON.parse(localStorage.getItem('cartProducts')) || [];

  // Filtra el producto a eliminar del carrito
  carritoLocalStorage = carritoLocalStorage.filter(producto => producto.name !== nombreProducto);

  // Guarda el carrito actualizado en el almacenamiento local
  localStorage.setItem('cartProducts', JSON.stringify(carritoLocalStorage));

  // Elimina el producto visualmente
  const productoAEliminar = document.querySelector(`[data-nombre="${nombreProducto}"]`);
  if (productoAEliminar) {
    productoAEliminar.remove();
  }
  showListFromStorage(carritoLocalStorage);
  // Actualiza los costos después de eliminar un producto
  actualizarCostos();
}

function agregarAlCarrito(productData, cantidadProducto) {
  let productoExistente = false;
  cantidadProducto = parseInt(cantidadProducto); 

  for (let i = 0; i < productosEnCarrito.length; i++) {
    if (productosEnCarrito[i].id === productData.id) {
      productoExistente = true;
      break;
    }
  }
  if (!productoExistente) {
    let productoEnCarrito = {
      name: productData.name,
      description: productData.description,
      count: cantidadProducto,
      id: productData.id,
      image: productData.image,
      currency: productData.currency,
      cost: productData.unitCost,
    };
    // Agrega el nuevo producto al arreglo de productos en el carrito
    productosEnCarrito.push(productoEnCarrito);
  }
  // Guarda el arreglo actualizado en el localStorage
  localStorage.setItem('cartProducts', JSON.stringify(productosEnCarrito));
  cartFromLocalStorage = JSON.parse(localStorage.getItem('cartProducts')) || [];
  productosEnCarrito = JSON.parse(localStorage.getItem('cartProducts')) || [];
  showListFromStorage(cartFromLocalStorage);
  //console.log(cantidadProducto);
}
//Recorro la lista de productos del carrito que hay guardados en jap server
function recorrerJapList(data){
  for(let one of data.articles){
    agregarAlCarrito(one, one.count);  
  }
}
/*--------------------------------------------------------------------Validaciónes Inicio----------------------------------------------------*/
var alertaPago = document.getElementById('alertaPagoExito')
var bsAlertaPago = new bootstrap.Alert(alertaPago)
/*--------------------------------------------------------------------Validaciónes Fin-------------------------------------------------------*/
/*--------------------------------------------------------------Conversión de monedas-----------------------------------------------------------*/
function obtenerMoneda(num, currency){
  let pesos = 40;
  let a = 1/pesos;
  /*fetch()
  .then(response=> response.json())
  .then(data=>{

  })
  .catch(error=>{
    console.error("Error al cargar datos", error)
  });*/
  if(currency==="UYU"){
    return num*a;
  }else if(currency==="USD"){
    return num;
  }
}
/*-----------------------------------------------------------Fin conversión de monedas----------------------------------------------------------*/