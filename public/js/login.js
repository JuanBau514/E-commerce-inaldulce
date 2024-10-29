document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (emailInput && passwordInput) { 
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ correo: email, contraseña: password }),  // Asegúrate de usar las propiedades correctas
                });

                const result = await response.json();

                if (response.ok) {
                    // Redirige al usuario basado en su rol
                    if (result.id_rol === 1) {  // Rol de Administrador
                        window.location.href = '/Views/adminPage.html';
                    } else {
                        window.location.href = '/Views/userPage.html';
                    }
                } else {
                    alert(result.message || 'Error en las credenciales');
                }

            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Error al iniciar sesión');
            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    } else {
        console.error('No se pudo encontrar los campos de email o contraseña');
    }
});
