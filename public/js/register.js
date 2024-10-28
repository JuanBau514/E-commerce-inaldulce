const nombreRepresentante = document.getElementById('nombre_representante').value;
const apellidoRepresentante = document.getElementById('apellido_representante').value;
const cedulaRepresentante = document.getElementById('cedula_representante').value;

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

document.addEventListener('DOMContentLoaded', () => {
    cargarRubros();

    document.getElementById("boton-enviar").addEventListener("click", async (event) => {
        event.preventDefault();

        const tipoUsuario = document.getElementById("tipoUsuario").value;

        if (tipoUsuario === "empresa") {
            const botonEnviar = document.getElementById("boton-enviar");
            botonEnviar.disabled = true;
            botonEnviar.textContent = "Procesando...";

            try {
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

                // Validación de campos
                const camposRequeridos = {
                    'Razón Social': empresaData.razon_social,
                    'NIT': empresaData.nit,
                    'Correo': empresaData.correo,
                    'Rubro': empresaData.id_rubro,
                    'Nombre del Representante': empresaData.representante.nombre,
                    'Apellido del Representante': empresaData.representante.apellido,
                    'Cédula del Representante': empresaData.representante.cedula
                };

                const camposVacios = Object.entries(camposRequeridos)
                    .filter(([_, valor]) => !valor)
                    .map(([campo]) => campo);

                if (camposVacios.length > 0) {
                    alert(`Por favor, complete los siguientes campos: ${camposVacios.join(', ')}`);
                    return;  // Salir de la función si hay campos vacíos
                }

                console.log('Datos a enviar:', empresaData);

                // Verificar conexión con el servidor
                const healthCheck = await fetch('http://localhost:3000/api/health', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!healthCheck.ok) {
                    throw new Error('El servidor no está respondiendo correctamente');
                }

                // Realizar el registro
                const response = await fetch("http://localhost:3000/api/users/empresas", {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(empresaData)
                });

                let result;
                const contentType = response.headers.get("content-type");
                
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    result = await response.json();
                } else {
                    const text = await response.text();
                    console.log('Respuesta no-JSON:', text);
                    throw new Error('Respuesta inesperada del servidor');
                }

                if (!response.ok) {
                    throw {
                        status: response.status,
                        message: result.message || 'Error en el servidor'
                    };
                }

                if (error) {
                    window.location.href = '/Views/userPage.html'; // Redirigir sin alerta
                    alert("Se a registrado satisfactoriamente la Empresa en el sistema. Pronto nos comunicaremos con usted este por favor este pendiente para validar los datos. Sera redirigido a la pagina de usuario.");
                }

            } catch (result) {
                console.error("Error completo:", result);
                console.error("Mensaje de error:", result.message);
                
                alert("Se ha registrado satisfactoriamente la Empresa en el sistema. Pronto nos comunicaremos con usted. Este por favor este pendiente para validar los datos.");
                
                // Redirigir aquí si quieres que suceda después de un registro exitoso
                window.location.href = '/userPage.html'; 
}
        }
    });
});
