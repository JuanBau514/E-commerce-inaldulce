function mostrarCampos() {
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const camposNatural = document.getElementById('camposNatural'); 
    const camposEmpresa = document.getElementById('camposEmpresa');
    camposNatural.style.display = tipoUsuario === 'natural' ? 'block' : 'none';
    camposEmpresa.style.display = tipoUsuario === 'empresa' ? 'block' : 'none';
}
    document.getElementById('boton-enviar').addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Botón enviar presionado');

        const tipoUsuario = document.getElementById('tipoUsuario').value;
        const nickname = document.getElementById('nickname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const razon_social = document.getElementById('razon_social') ? document.getElementById('razon_social').value : '';
        const nit = document.getElementById('nit') ? document.getElementById('nit').value : '';
        const telefono_empresa = document.getElementById('telefono_empresa') ? document.getElementById('telefono_empresa').value : '';
        const correo_empresa = document.getElementById('correo_empresa') ? document.getElementById('correo_empresa').value : '';
        const representante = document.getElementById('representante') ? document.getElementById('representante').value : '';
        const cedula_representante = document.getElementById('cedula_representante') ? document.getElementById('cedula_representante').value : '';

        const usuario_nuevo = document.getElementById('usuario_nuevo') ? document.getElementById('usuario_nuevo').value : '';
        const rol_usuario = document.getElementById('rol_usuario') ? document.getElementById('rol_usuario').value : '';

        const registroData = {
            tipoUsuario,
            nickname,
            lastname,
            email,
            password,
            razon_social,
            nit,
            telefono_empresa,
            correo_empresa,
            representante,
            cedula_representante,
            usuario_nuevo,
            rol_usuario,
            id_genero: 1, // Puedes ajustar este valor según el formulario
            id_rol: tipoUsuario === 'empresa' ? 2 : 1 // Rol de Empresa o Persona Natural
        };

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registroData)
            });

            const data = await response.text();
            console.log(data);
            alert(data);
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error en el registro');
        }
    });

