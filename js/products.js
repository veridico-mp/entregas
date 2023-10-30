let catID = localStorage.getItem("catID");
const URL_CATEGORIES = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

const searchInput = document.getElementById("searchInput");


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
      alert('Desconexion exitosa', 'Vuelve pronto');
      location.href = 'login.html';
    });
  });







//Realiza solicitud fetch y espera a que la respuesta se convierta a formato JSON. En caso de error se captura en un bloque catch y muestra mensaje de error en consola
async function fetchProductData(url) {
    try {
        const res = await fetch(url);
        return await res.json();  
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
    
//Se llama a la funcion fetchProductData() con la URL. Cuando se resuelve la promesa muestra los datos con uploadProducts(), sino se crea un mensaje de error
fetchProductData(URL_CATEGORIES)
    .then(data => {
    
        localStorage.setItem('backUp', JSON.stringify(data.products));
        uploadProducts(data.products);
    })
    .catch(error => {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Hubo un error al cargar los productos.";
        document.body.appendChild(errorMessage);
    });


    let storeageOne = {}; 
    //Toma un array de productos y crea un div a medida que itera por cada elemento, dentro coloca todas sus características   
    function uploadProducts(dataArray, searchTerm = "") {
        storeageOne = dataArray;
        console.log(storeageOne);
        let productsList = document.getElementById("products-list");
        productsList.innerHTML = "";

        for (const item of dataArray) {

        if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            ){
          const productDiv = document.createElement("div");
          productDiv.classList.add("product"); // Agrega la clase "product" para aplicar los estilos CSS
          productDiv.setAttribute("onclick", `setProdID(${item.id})`);
          //Acá se construyen todos los div que contienen cada producto
          productDiv.innerHTML = `
            <div class="row">
                <div class="col col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <img src="${item.image}">
                </div>
                <div class="col col-sm-6 col-md-6 col-lg-6 col-xl-6 description-container">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p class="price">${item.currency} ${item.cost}</p>
                </div>
                <div class="col sold-count">
                    <span>${item.soldCount} vendidos</span>
                </div>
            </div>
          `;

          productsList.appendChild(productDiv);
          
        }}   
        /*Aca esta el filtro de productos segun precio */
        const filterBtn = document.getElementById('rangeFilterCount');
        filterBtn.addEventListener('click', function(){
         let min = document.getElementById('rangeFilterCountMin').value;
            let max = document.getElementById('rangeFilterCountMax').value;
            //Aca nos aseguramos de que se contemplen los casos en que el usuario deja un campo vacio
            if (min === "" && max === ""){//Si ambos "minimo y maximo" estan vacios no hace nada mas q enviar un mensaje a consola
                console.log("Los campos estan vacíos")//Esto se puede sustituír por una alerta visual para el usuario
            }else if (min >=0 && max === ""){
                productsList.innerHTML= "";
                let filtrado = dataArray.filter(item => item.cost >= min);
                uploadProducts(filtrado);
            }else if (min === "" && max >= 0){
                productsList.innerHTML= "";
                let filtrado = dataArray.filter(item => item.cost <= max);
                uploadProducts(filtrado);
            }else {
                productsList.innerHTML= "";
                let filtrado = dataArray.filter(item => item.cost >= min && item.cost <= max);
                uploadProducts(filtrado);
            }
        })
    }
    /*Aca se limpian los filtros y se vuelve a cargar los productos en su totalidad */
    const cleanFilter = document.getElementById('clearRangeFilter');
    cleanFilter.addEventListener('click', function(){
        let productsList = document.getElementById("products-list");
        productsList.innerHTML= "";
                
        fetchProductData(URL_CATEGORIES)
        .then(data => {
            uploadProducts(data.products);
                })
        .catch(error => {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Hubo un error al cargar los productos.";
            document.body.appendChild(errorMessage);
        });

    })

    /*Ordenando arreglos */


    let aToZ = document.getElementById('sortAsc');//Botón A-Z
    let zToA = document.getElementById('sortDesc');//Botón Z-Z
    let countD = document.getElementById('sortByCountDown');//Botón ordenador por relevancia
    let countU = document.getElementById('sortByCountUp');//Botón ordenador por relevancia
//Ordena de Max-Min
    aToZ.addEventListener('click', function(){
        let productsList = document.getElementById("products-list");
        let sortedArray = storeageOne.sort((a, b)=> a.cost - b.cost);
        //console.log(sortedArray);
        productsList.innerHTML= "";
        uploadProducts(sortedArray);
    });
//Ordena Min-Max
    zToA.addEventListener('click', function(){
        let productsList = document.getElementById("products-list");
        let sortedArray = storeageOne.sort((a, b)=> b.cost - a.cost);
        productsList.innerHTML= "";
        uploadProducts(sortedArray);
    });
//Ordena segun relevancia mayor a menor
    countD.addEventListener('click', function(){
        let productsList = document.getElementById("products-list");
        let sortedArray = storeageOne.sort((a, b)=> b.soldCount- a.soldCount);
        productsList.innerHTML= "";
        uploadProducts(sortedArray);    
    });
//Busca los productos según ingrese letras en el cuadro de busqueda
    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value;
        uploadProducts(storeageOne, searchTerm);
    });

//Guardar ID de producto en el localStorage para poder hacer fetch a su informacion en product-info.js
function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
}
