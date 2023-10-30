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
        localStorage.setItem('nombre', nombre.value);
        return true;
    }
}
const labelPass = document.querySelector('label[for="pass"]');
const labelNombre = document.querySelector('label[for="nombre"]');







nombre.addEventListener('input', () => {
    
    if (nombre.value.trim() !== '') {
        labelNombre.style.transform = 'translateY(-30px)';
       
    } else {
        labelNombre.style.transform = 'translateY(-50%)';
    }
});

pass.addEventListener('input', () => {
    
    if (pass.value.trim() !== '') {
        labelPass.style.transform = 'translateY(-30px)';
    } else {
        labelPass.style.transform = 'translateY(-50%)';
    }
});









/*nombre.addEventListener('input', () => {
    if (nombre.value.trim() !== '') {
        document.querySelector('label[for="nombre"]').style.transform = 'translateY(-20px)';
    } else {
        document.querySelector('label[for="nombre"]').style.display = 'block';
    }
});

pass.addEventListener('input', () => {
    if (pass.value.trim() !== '') {
        document.querySelector('label[for="pass"]').style.transform = 'translateY(-20px)';
    } else {
        document.querySelector('label[for="pass"]').style.display = 'block';
    }
}); */
