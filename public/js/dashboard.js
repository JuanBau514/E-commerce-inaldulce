document.addEventListener("DOMContentLoaded", function () {
    const toggleIcon = document.querySelector('.menu-toggle label');
    const sidebar = document.querySelector('.sidebar');

    const mainContent = document.querySelector('.main-content');

    toggleIcon.addEventListener('click', function () {
        // Alternar la clase para mostrar/esconder el sidebar
        sidebar.classList.toggle('sidebar-hidden');
        // Alternar la clase para ajustar el ancho del contenido principal
        mainContent.classList.toggle('full-width');
    });

    // Recuperar datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Actualizar el nombre y el rol en la página
    if (usuario) {
        document.querySelector('.sidebar-user h3').innerText = `${usuario.nombre} ${usuario.apellido}`;
        document.querySelector('.info-p h4').innerText = `${usuario.nombre} ${usuario.apellido}`;
        document.querySelector('.info-p small').innerText = usuario.rol === 2 ? "Administrador" : "Usuario";
    }

});