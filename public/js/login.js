document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    // Asegúrate de que estos IDs coincidan con los del HTML
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    // Asegúrate de que los inputs existen antes de acceder a sus valores
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
                   if (result.role === 2 ) {
                    window.location.href = '/Views/adminPage.html';
                   }
                   else{
                    window.location.href = '/Views/userPage.html';
                   }
                } else {
                    alert(result.message);
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
