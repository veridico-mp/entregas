document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.querySelector("input[type='checkbox']");
  const body = document.body;

  // Verifica si hay una preferencia en el localStorage
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';

  // Aplica el modo oscuro si está habilitado en el localStorage
  if (isDarkModeEnabled) {
    body.classList.add('dark-mode');
    checkbox.checked = true;
  }

  checkbox.addEventListener('change', function () {
    if (this.checked) {
      body.classList.add('dark-mode');
      // Almacena la preferencia en localStorage
      localStorage.setItem('darkMode', 'true');
    } else {
      body.classList.remove('dark-mode');
      // Almacena la preferencia en localStorage
      localStorage.setItem('darkMode', 'false');
    }
  });
});
