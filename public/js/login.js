document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (email && password) {
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {  // Asegúrate de usar el puerto correcto
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '/Views/dashboard.html';  // Redirigir a otra página si es necesario
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error, intenta de nuevo.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
});
