const form = document.querySelector('form');
const inputid = document.getElementById('id');
const inputNombre = document.getElementById('first-name');
const inputApellido = document.getElementById('last-name');
const inputCorreo = document.getElementById('email');
const inputTelefono = document.getElementById('phone');
const inputGenero = document.getElementById('gender');
const inputNitEmpresa = document.getElementById('nit_empresa');
const inputContrasenaNueva = document.getElementById('newPassword');
const botonCambios = document.getElementById('GuardaCambiosBtn');

const ponerInformacion = async (cedula) => {
    try {
        // Verificar que la cédula sea válida
        if (!cedula) {
            throw new Error('Cédula no proporcionada');
        }

        const response = await fetch(`http://localhost:3000/api/usuarios/${cedula}`);
        
        // Manejar explícitamente el caso 404
        if (response.status === 404) {
            throw new Error('Usuario no encontrado');
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Verificar que tengamos datos válidos
        if (!data) {
            throw new Error('No se recibieron datos del usuario');
        }

        // Actualizar los campos del formulario
        inputid.value = data.cedula || '';
        inputNombre.value = data.nombre || '';
        inputApellido.value = data.apellido || '';
        inputCorreo.value = data.correo || '';
        inputTelefono.value = data.telefono || '';
        inputGenero.value = data.id_genero || '';
        inputNitEmpresa.value = data.nit_empresa || '';

        // Actualizar también los elementos de información de sesión si existen
        const profileElements = {
            'profile-cedula': data.cedula,
            'profile-name': data.nombre,
            'profile-lastName': data.apellido,
            'profile-email': data.correo,
            'profile-phone': data.telefono,
            'profile-gender': data.id_genero,
            'profile-nit': data.nit_empresa
        };

        Object.entries(profileElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '';
            }
        });

    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        // Mostrar un mensaje más amigable al usuario
        alert(`No se pudo cargar la información del usuario: ${error.message}`);
    }
};

window.onload = function() {
    // Obtener la cédula del localStorage
    const cedulaUsuario = localStorage.getItem('cedula');
    
    // Verificar que tengamos una cédula válida
    if (!cedulaUsuario) {
        console.error('No se encontró la cédula del usuario en el localStorage');
        alert('Por favor, inicie sesión nuevamente');
        // Opcional: Redirigir al login
        window.location.href = '/login.html';
        return;
    }

    // Cargar la información del usuario
    ponerInformacion(cedulaUsuario);

    // Manejar el envío del formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            const userData = {
                cedula: inputid.value,
                nombre: inputNombre.value,
                apellido: inputApellido.value,
                correo: inputCorreo.value,
                telefono: inputTelefono.value,
                id_genero: inputGenero.value,
                nit_empresa: inputNitEmpresa.value,
                contrasenaNueva: inputContrasenaNueva.value
            };

            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos');
            }

            const result = await response.json();
            alert(result.message || 'Cambios guardados con éxito');
            
            // Recargar la información actualizada
            ponerInformacion(userData.cedula);
            
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            alert('Hubo un problema al guardar los cambios: ' + error.message);
        }
    });
};