document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        if (checkCont()) {
            location.href = 'index.html';
        }
    });
});

function checkCont() {
    const nombre = document.getElementById('nombre');
    const pass = document.getElementById('pass');
    const errorMessage = "Ninguno de los campos puede estar vacío";

    if (nombre.value === "" || pass.value === "") {
        alert(errorMessage);
        return false;
    } else {
        localStorage.setItem('nombre', JSON.stringify(nombre.value));
        return true;
    }
}