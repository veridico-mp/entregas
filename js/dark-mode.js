document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.querySelector("input[type='checkbox']");
  const body = document.body;
  const formu = document.getElementById("formulario");

  // Verifica si hay una preferencia en el localStorage
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';

  // Aplica el modo oscuro si está habilitado en el localStorage
  if (isDarkModeEnabled) {
    body.classList.add('dark-mode');
    checkbox.checked = true;
    formu.classList.add('dark-mode');
    
  }

  checkbox.addEventListener('change', function () {
    if (this.checked) {
      body.classList.add('dark-mode');
      // Almacena la preferencia en localStorage
      localStorage.setItem('darkMode', 'true');
      formu.classList.add('dark-mode');
      
    } else {
      body.classList.remove('dark-mode');
      // Almacena la preferencia en localStorage
      localStorage.setItem('darkMode', 'false');
      formu.classList.remove('dark-mode');
    }
  });
});
