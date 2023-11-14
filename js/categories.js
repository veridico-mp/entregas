const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Ordenar categorías
function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
//Guardar id de categoría seleccionada y redirigir
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

//Lista de categorías con filtros
function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}
//Ordenar y mostrar categorías
function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

});
//Evento buscador y filtrado de la lista de categorías en función del texto ingresado
document.addEventListener("DOMContentLoaded", function(){
    //Enlazar a campo de busqueda y lista de artiulos
    const buscador = document.getElementById('Buscador');
    const categoryList = document.getElementById('cat-list-container');

    buscador.addEventListener('input', function(){
        const buscadorText = buscador.value.toLowerCase();
        const categories = categoryList.querySelectorAll('.list-group-item') ;

        categories.forEach(category =>{
            const categoryName = category.querySelector('h4').textContent.toLowerCase();
            const categoryDesc = category.querySelector('p').textContent.toLowerCase();

            if(categoryName.includes(buscadorText) || categoryDesc.includes(buscadorText) ){
                category.style.display = 'block';
            } else {
                category.style.display = 'none'
            }
        })
    })
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


})