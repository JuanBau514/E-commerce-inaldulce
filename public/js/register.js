document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const nickname = document.querySelector('#nickname').value;
    const lastname = document.querySelector('#lastname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (nickname && lastname && email && password) {
        const response = await fetch('http://localhost:3000/api/users/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, lastname, email, password }),
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
