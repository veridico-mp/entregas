// Obtener el ID de producto almacenado en el localStorage
var prodID = localStorage.getItem('prodID');
let URL_prod = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;
let URL_com = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`;

let cantidadProducto = 1;
let precioProducto = 0;
let productData;
let productosEnCarrito = JSON.parse(localStorage.getItem('cartProducts')) || [];
// let productosEnCarrito = [];

// Hacer la solicitud fetch para obtener la información del producto
fetchData(URL_prod);
fetchComments(URL_com);

document.querySelector('#units').addEventListener('change', function () {
  calcularSubtotal(precioProducto);
});

document.querySelector('#btnCart').addEventListener('click', function () {
  agregarAlCarrito(productData, cantidadProducto);
});

document.querySelector('#btnBuy').addEventListener('click', function () {
  agregarAlCarrito(productData, cantidadProducto);
  window.location.href = "cart.html";
});

// Obtener una referencia al formulario y al contenedor de comentarios
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments');

// Agregar un evento de envío al formulario
commentForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar que la página se recargue al enviar el formulario

  // Obtener los valores ingresados por el usuario
  let username = localStorage.getItem('nombre');
  let score = Number(document.getElementById('score').value);
  let commentText = document.getElementById('comment').value;

  if (score === -1) {
    alert('Tu comentario debe ir acompañado de una puntuación.');
    return;
  }
  // Validar que se haya ingresado un comentario
  if (commentText.trim() === '') {
    alert('Por favor, ingrese un comentario.');
    return;
  }

  // Obtener la fecha y hora actual
  const now = new Date();
  const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  // Crear un nuevo elemento de comentario y agregarlo al contenedor de comentarios
  const newComment = document.createElement('div');
  newComment.className = 'comment';
  newComment.innerHTML = `
    <p class="pttts">Puntuación: ${score}</p>  
    <p class="ussser">${username}</p>
    <p class="commm">Comentario: ${commentText}</p>
    <p class="daaate">Fecha y Hora: ${formattedDate}</p>
    <br> <hr>
  `;

  commentsContainer.appendChild(newComment);

  // Limpiar el formulario después de enviar el comentario
  commentForm.reset();
});

document.addEventListener('DOMContentLoaded', function () {
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
});

//Funcion para cargar contenidos.
function fetchData(url) {
  //Esta es para mostrar imagenes
  fetch(url)
    .then(response => response.json())
    .then(data => {
      productData = data;
      showProductGalery(data);
      showMainInfo(data);
      calcularSubtotal(precioProducto);
      showProductDescription(data);
      showRelatedProducts(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Función para cargar comentarios.
function fetchComments(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      showProductComments(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function showProductGalery(data) {
  //Muestra galeria de imagenes.

  showImgList(data);
  showSlides(1);
}

function showImgList(data) {
  //Agrega imagenes a la lista
  let imgList = document.getElementById('expImg');
  let imgRow = document.getElementById('row');
  let numImg = 1;
  for (let one of data.images) {
    imgList.innerHTML += `
      <div class="mySlides ">
          <div class="numbertext">${numImg} / ${data.images.length}</div>
          <img class="img-fluid" src='${one}' onclick='expose("${one}") style="width:100%'>
      </div>`;
    imgRow.innerHTML += `
      <div class="column">
          <img class="demo cursor img-fluid" src="${one}"  onclick="currentSlide(${numImg})" style="width:100%;";" >
      </div>`;
    numImg++;
  }
}

let slideIndex = 1;
showSlides(slideIndex);
// Controles
function plusSlides(n) {
  showSlides((slideIndex += n));
}
// Thumbnail
function currentSlide(n) {
  showSlides((slideIndex = n));
}
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName('mySlides');
  let dots = document.getElementsByClassName('demo');
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].className += ' active';
}
function showMainInfo(data) {
  let des = document.getElementById('mainInfo');
  let prodName = document.getElementById('prodName');
  let prodCost = document.getElementById('prodCost');

  precioProducto = data.cost;

  prodName.innerHTML += `${data.name}`;

  prodCost.innerHTML += `${data.currency}:  <span id="cost">${data.cost} </span>`;
}
function showProductDescription(data) {
  let des = document.getElementById('descripcion');

  des.innerHTML += `<h2>Descripción:</h2> <br> <p>${data.description}</p><br>`;

  console.log(des);
}
function showRelatedProducts(data) {
  // Funcion que mostrara los productos relacionados
  let relproduct = document.getElementById('prodRelacionados');
  relproduct.innerHTML += `
  <div class='container form-control ' id='relprod'></div>`;
  showProductRelacionado(data);
}
function showProductRelacionado(data) {
  // Esta funcion obtendra los productos del array y luego se llamará dentro de showRelatedProducts
  let relprod = document.getElementById('relprod');
  for (let product of data.relatedProducts) {
    relprod.innerHTML += `
    <div class="containerRelProd dMode" id="${product.id}" onclick="setProdID(${product.id})">
     <div class="product-info">
     <img class="img-fluid"src=${product.image}>
     <p>${product.name}</p> 
     </div>
    </div>
    `;
  }
}

function showProductComments(data) {
  let commentsContainer = document.querySelector('#comments');
  commentsContainer.innerHTML = ''; // Limpia el contenido anterior si lo hubiera

  for (let comment of data) {
    let commentElement = document.createElement('div');
    commentElement.classList.add('comment');

    commentElement.innerHTML = `
      <p class="pttts" > Puntuación: ${comment.score} </p>
      <p class="ussser"> <img src="img/usuario.png" id="commusser"> ${comment.user}</p>
      <p class="commm"> ${comment.description}</p>
      <p class="daaate"> ${comment.dateTime}</p>
      <br> <hr>
      
    `;

    commentsContainer.appendChild(commentElement);
  }
}
function setProdID(id) {
  localStorage.setItem('prodID', id);
  window.location = 'product-info.html';
}

function calcularSubtotal(precioProducto) {
  cantidadProducto = document.querySelector('#units').value;
  let div = document.querySelector('#divSubtotal');

  subtotal = precioProducto * cantidadProducto;

  div.innerHTML = `Subtotal ${subtotal}`;
}

function agregarAlCarrito(productData, cantidadProducto) {
  let productoExistente = false;
  cantidadProducto = parseInt(cantidadProducto);

  for (let i = 0; i < productosEnCarrito.length; i++) {
    if (productosEnCarrito[i].id === productData.id) {
      productosEnCarrito[i].count += cantidadProducto;
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
      image: productData.images[0],
      currency: productData.currency,
      cost: productData.cost,
    };

    // Agrega el nuevo producto al arreglo de productos en el carrito
    productosEnCarrito.push(productoEnCarrito);
  }

  // Guarda el arreglo actualizado en el localStorage
  localStorage.setItem('cartProducts', JSON.stringify(productosEnCarrito));

  console.log(cantidadProducto);
}
