    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('form');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío del formulario

            // Obtener valores de los inputs
            const nombre = document.getElementById('first-name').value;
            const apellido = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const contrasena = document.getElementById('password').value;
            const genero = document.getElementById('gender').value;

            // Validación simple
            if (!nombre || !apellido || !email || !contrasena) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Mostrar los datos ingresados
            alert(`Datos guardados:\nNombre: ${nombre}\nApellido: ${apellido}\nCorreo: ${email}\nGénero: ${genero}`);
            
            // Aquí podrías agregar lógica para enviar los datos a un servidor o realizar otras acciones
        });
    });
