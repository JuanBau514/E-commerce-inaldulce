document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    // Guarda el token en localStorage
                    //localStorage.setItem('token', result.token);
                    //console.log(`token : ${result.token}`);
                    // Verifica el rol del usuario
                    if (result.role === 1) {  // Asegúrate de que este es el rol de Administrador
                        window.location.href = '/Views/adminPage.html';
                    } else {
                        window.location.href = '/Views/userPage.html';
                    }
                } else {
                    alert(result.message);
                }

            } catch (error) {
                console.error('Error en la solicitud:', error.message);

                alert('Error al iniciar sesión', error.message);

            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    } else {
        console.error('No se pudo encontrar los campos de email o contraseña');
    }
});
