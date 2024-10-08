document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const nickname = document.querySelector('#nickname').value;
    const lastname = document.querySelector('#lastname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const idGenero = document.querySelector('#genero').value;  // Obtén el id del género seleccionado

    if (nickname && lastname && email && password && idGenero) {
        const response = await fetch('http://localhost:3000/api/users/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, lastname, email, password, id_genero: idGenero }), // Incluye id_genero en la solicitud
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = '/Views/login.html';
        } else {
            alert(result.message);
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
});