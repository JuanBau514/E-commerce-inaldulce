document.getElementById('btnAddUsuarios').addEventListener('click', function() {
            document.getElementById('camposUsuariosAdicionales').style.display = 'block';
        });

        function mostrarCampos() {
            const tipoUsuario = document.getElementById('tipoUsuario').value;
            const camposNatural = document.getElementById('camposNatural');
            const camposEmpresa = document.getElementById('camposEmpresa');
            camposNatural.style.display = tipoUsuario === 'natural' ? 'block' : 'none';
            camposEmpresa.style.display = tipoUsuario === 'empresa' ? 'block' : 'none';
        }

        function mostrarRegistroUsuarios() {
            const checkBox = document.getElementById('registrar_usuarios');
            const camposUsuariosAdicionales = document.getElementById('camposUsuariosAdicionales');
            const representante = document.getElementById('representante').value;
            const cedulaRepresentante = document.getElementById('cedula_representante').value;

            if (checkBox.checked) {
                if (representante.trim() !== "" && cedulaRepresentante.trim() !== "") {
                    camposUsuariosAdicionales.style.display = 'block';
                } else {
                    alert("Por favor, ingrese los datos del representante legal antes de registrar más usuarios.");
                    checkBox.checked = false;  // Desmarca el checkbox si faltan datos
                }
            } else {
                camposUsuariosAdicionales.style.display = 'none';
            }
        }
/*

document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const cedula = document.querySelector('#cedula').value;
    const nickname = document.querySelector('#nickname').value;
    const lastname = document.querySelector('#lastname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const idGenero = document.querySelector('#genero').value;  // Obtén el id del género seleccionado

    if (cedula && nickname && lastname && email && password && idGenero) {
        const response = await fetch('http://localhost:3000/api/users/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cedula,nickname, lastname, email, password, id_genero: idGenero }), // Incluye id_genero en la solicitud
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

//Register de Administradores

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
        e.preventDefault();

        const cedula = document.querySelector('#cedula').value;
        const nickname = document.querySelector('#first-name').value;
        const lastname = document.querySelector('#last-name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const gender = document.querySelector('#gender').value;
        const id_rol = document.querySelector('#rol').value;

        const idGenero = gender === 'male' ? 1 : gender === 'female' ? 2 : 3;

        if (cedula && nickname && lastname && email && password && idGenero) {
            let urlPeticion = ''
            let objetoPeticion;
            if(rol == 1){
                 urlPeticion = 'http://localhost:3000/api/users/registerAdmin'
                 objetoPeticion = { cedula,nickname, lastname, email, password,id_genero: idGenero }
            }else{
                 urlPeticion = 'http://localhost:3000/api/users/register'
                 objetoPeticion = { cedula,nickname, lastname, email, password, id_rol,id_genero: idGenero }
            }

            const response = await fetch(urlPeticion, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetoPeticion),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '/Views/adminPage.html';
            } else {
                alert(result.message);
            }
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });
});

*/