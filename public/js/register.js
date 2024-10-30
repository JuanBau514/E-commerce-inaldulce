function mostrarCampos() {
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const camposNatural = document.getElementById('camposNatural'); 
    const camposEmpresa = document.getElementById('camposEmpresa');
    camposNatural.style.display = tipoUsuario === 'natural' ? 'block' : 'none';
    camposEmpresa.style.display = tipoUsuario === 'empresa' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', cargarRubros);

async function cargarRubros() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/users/rubros'); // URL de tu API para obtener los rubros
        const rubros = await response.json();

        // Accede al primer array que contiene los rubros
        const rubrosArray = rubros[0];

        const rubroSelect = document.getElementById('rubro');
        rubroSelect.innerHTML = ''; // Limpia opciones anteriores

        // Agrega la opción de selección predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione el Rubro";
        rubroSelect.appendChild(defaultOption);

        // Agrega las opciones de rubro dinámicamente
        rubrosArray.forEach(rubro => {
            const option = document.createElement('option');
            option.value = rubro.id_rubro; // ID del rubro en la base de datos
            option.textContent = rubro.rubro; // Nombre del rubro
            rubroSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los rubros:', error);
    }
}

async function registrarPersonaNatural() {
    const nickname = document.getElementById('nickname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const rutFile = document.getElementById('rut').files[0];

    // Log para debug
    console.log('Tipo de archivo:', rutFile.type);

    if (!nickname || !lastname || !email || !rutFile) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un email válido.');
        return;
    }

    // Lista expandida de tipos MIME aceptados
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        // Variaciones comunes de PDF
        'application/x-pdf',
        'application/acrobat',
        'applications/vnd.pdf',
        'text/pdf',
        'text/x-pdf'
    ];

    // Validación de extensión del archivo como respaldo
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileExtension = rutFile.name.split('.').pop().toLowerCase();

    // Log para debug
    console.log('Extensión del archivo:', fileExtension);
    console.log('Tipo MIME:', rutFile.type);

    if (!allowedTypes.includes(rutFile.type) && !allowedExtensions.includes(fileExtension)) {
        alert('El archivo RUT debe ser PDF, JPEG o PNG.');
        return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('rut', rutFile);

    try {
        const response = await fetch("http://localhost:3000/api/users/persona-natural", {
            method: "POST",
            mode: 'cors',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el servidor');
        }

        const data = await response.json();
        alert("Registro exitoso. Se ha enviado un correo de confirmación.");
        window.location.href = '/Views/userPage.html';
    } catch (error) {
        console.error("Error:", error);
        alert(error.message || 'Error al procesar la solicitud');
    }
}

async function registrarEmpresa() {
    const empresaData = {
        razon_social: document.getElementById('razon_social').value.trim(),
        nit: document.getElementById('nit').value.trim(),
        telefono_empresa: document.getElementById('telefono_empresa').value.trim(),
        correo: document.getElementById('email_empresa').value.trim(),
        id_rubro: document.getElementById('rubro').value,
        representante: {
            nombre: document.getElementById('nombre_representante').value.trim(),
            apellido: document.getElementById('apellido_representante').value.trim(),
            cedula: document.getElementById('cedula_representante').value.trim(),
        }
    };

    try {
        const response = await fetch("http://localhost:3000/api/users/enviar-correo", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresaData)
        });

        if (response.status === 200) {
            alert("Registro de empresa exitoso.");
            window.location.href = '/Views/userPage.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el servidor');
        }
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        alert("Hubo un problema al enviar el correo.");
    }
}
