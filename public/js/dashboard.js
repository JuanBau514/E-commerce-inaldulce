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
});