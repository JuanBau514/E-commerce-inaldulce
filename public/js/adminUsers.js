document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const cedula = document.getElementById('cedula').value;
        const nombre = document.getElementById('first-name').value;
        const apellido = document.getElementById('last-name').value;
        const correo = document.getElementById('email').value;
        const contraseña = document.getElementById('password').value;
        const id_rol = document.getElementById('rol').value;
        const id_genero = document.getElementById('gender').value === 'male' ? 1 : 
                         document.getElementById('gender').value === 'female' ? 2 : 3;

        // Validaciones básicas
        if (!cedula || !nombre || !apellido || !correo || !contraseña) {
            alert('Por favor complete todos los campos');
            return;
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            alert('Por favor ingrese un correo válido');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/createAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula,
                    nombre,
                    apellido,
                    correo,
                    contraseña,
                    id_genero,
                    id_rol
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario creado exitosamente');
                form.reset();
                window.location.href = '/Views/admin/index.html'; // Redirigir a la lista de usuarios
            } else {
                alert(data.message || 'Error al crear usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear usuario');
        }
    });
});