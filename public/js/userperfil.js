document.addEventListener('DOMContentLoaded', function() {
    cargarPerfil();

    const form = document.getElementById('profile-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        actualizarPerfil();
    });
});

function cargarPerfil() {
    const cedula = localStorage.getItem('cedula');

    console.log('Cédula obtenida del local storage:', cedula); // Log para depuración

        fetch(`http://localhost:3000/api/users/usuarios/${cedula}`)

        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de la API:', data); // Log para depuración

            if (data.success) {
                const perfil = data.data;
                document.getElementById('profile-cedula').textContent = perfil.cedula;
                document.getElementById('profile-name').textContent = perfil.nombre;
                document.getElementById('profile-lastName').textContent = perfil.apellido;
                document.getElementById('profile-email').textContent = perfil.correo;
                document.getElementById('profile-phone').textContent = perfil.telefono;
                document.getElementById('profile-gender').textContent = perfil.id_genero;
                document.getElementById('profile-role').textContent = perfil.id_rol;
                document.getElementById('profile-nit').textContent = perfil.nit_empresa;

                // Rellenar el formulario con los datos del perfil
                document.getElementById('cedula').value = perfil.cedula;
                document.getElementById('first-name').value = perfil.nombre;
                document.getElementById('last-name').value = perfil.apellido;
                document.getElementById('email').value = perfil.correo;
                document.getElementById('phone').value = perfil.telefono;
                document.getElementById('gender').value = perfil.id_genero;
                document.getElementById('role').value = perfil.id_rol;
                document.getElementById('nit').value = perfil.nit_empresa;
            } else {
                alert('Error al cargar el perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
} 
/*

function actualizarPerfil() {
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('first-name').value.trim();
    const apellido = document.getElementById('last-name').value.trim();
    const correo = document.getElementById('email').value.trim();
    const telefono = document.getElementById('phone').value.trim();
    const genero = document.getElementById('gender').value.trim();
    const rol = document.getElementById('role').value.trim();
    const nit_empresa = document.getElementById('nit').value.trim();

    const perfilActualizado = {
        cedula,
        nombre,
        apellido,
        correo,
        telefono,
        genero,
        rol,
        nit_empresa
    };

    fetch(`http://localhost:3000/api/users/${cedula}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfilActualizado),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Perfil actualizado correctamente.');
            // Actualizar la información mostrada en la página
            cargarPerfil();
        } else {
            alert('Error al actualizar el perfil: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el perfil. Por favor, intenta nuevamente.');
    });
}
*/
