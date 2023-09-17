// Obtener el ID de producto almacenado en el localStorage
var prodID = localStorage.getItem('prodID');
let URL_prod = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;
let URL_com = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`;

// Hacer la solicitud fetch para obtener la información del producto
fetchData(URL_prod);
fetchComments(URL_com);

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
    <p>Puntuación: ${score}</p>  
    <p>${username}</p>
    <p>Comentario: ${commentText}</p>
    <p>Fecha y Hora: ${formattedDate}</p>
    <hr>
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
    document.getElementById('nombre').innerHTML = usuario;
  }

  let logout = document.getElementById('salir');
  logout.addEventListener('click', function () {
    localStorage.removeItem('nombre');
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
      showProductGalery(data);
      showMainInfo(data);
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
      <div class="mySlides">
          <div class="numbertext">${numImg} / ${data.images.length}</div>
          <img src='${one}' onclick='expose("${one}") style="width:100%'>
      </div>`;
    imgRow.innerHTML += `
      <div class="column">
          <img class="demo cursor" src="${one}"  onclick="currentSlide(${numImg})" style="width:100%;";" >
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
  <div class='container form-control' id='relprod'></div>`;
  showProductRelacionado(data);
}
function showProductRelacionado(data) {
  // Esta funcion obtendra los productos del array y luego se llamará dentro de showRelatedProducts
  let relprod = document.getElementById('relprod');
  for (let product of data.relatedProducts) {
    relprod.innerHTML += ` <div class=containerRelProd> <div class="product-info"> <img src=${product.image}>  <p>${product.name}</p> </div></div>`;
  }
}

function showProductComments(data) {
  let commentsContainer = document.querySelector('#comments');
  commentsContainer.innerHTML = ''; // Limpia el contenido anterior si lo hubiera

  for (let comment of data) {
    let commentElement = document.createElement('div');
    commentElement.classList.add('comment');

    commentElement.innerHTML = `
      <p id="pttts" > Puntuación: ${comment.score} </p>
      <p id="ussser"> <img src="img/usuario.png" id="commusser"> ${comment.user}</p>
      <p id="commm"> ${comment.description}</p>
      <p id="daaate"> ${comment.dateTime}</p>
      <br> <hr>
      
    `;

    commentsContainer.appendChild(commentElement);
  }
}
