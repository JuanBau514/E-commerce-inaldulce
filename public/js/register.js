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

    document.getElementById("boton-enviar").addEventListener("click", async (event) => { // Declara la función como async
        // Evitar que el formulario se envíe y refresque la página
        event.preventDefault();

        const tipoUsuario = document.getElementById("tipoUsuario").value;
        const botonEnviar = document.getElementById("boton-enviar"); // Define el botón aquí para ambas condiciones
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Procesando...";

        if (tipoUsuario === "empresa") {
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

            console.log('Datos a enviar:', empresaData);

            // Realiza la solicitud fetch
            fetch("http://localhost:3000/api/users/empresas", {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresaData)
            })
            .then(response => {
                // Verifica el estado de la respuesta
                if (response.status === 204) {
                    // Si la respuesta es 204, creamos un objeto simulado
                    return { status: 201, message: "Creación exitosa", data: {} };
                } else if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
                    });
                }
                // Si la respuesta es válida, retornamos el JSON
                return response.json();
            })
            .then(result => {
                console.log("Resultado:", result);
                alert("Empresa registrada con éxito.");
                // Redirigir solo después de que se haya completado el registro
                window.location.href = '/Views/userPage.html';
            })
            .catch(error => {
                console.error("Error completo:", error.message);
                alert("Se a registrado satisfactoriamente la Empresa en el sistema. Pronto nos comunicaremos con usted este por favor este pendiente para validar los datos.");
            })
            .finally(() => {
                // Habilitar el botón nuevamente
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Enviar";
            });
        } else if (tipoUsuario === "natural") {
            const nickname = document.getElementById('nickname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const email = document.getElementById('email').value.trim();
            const rut = document.getElementById('rut').files[0];

            // Validación de campos requeridos
            if (!nickname || !lastname || !email || !rut) {
                alert('Todos los campos son obligatorios.');
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Enviar";
                return;
            }

            const formData = new FormData();
            formData.append('nickname', nickname);
            formData.append('lastname', lastname);
            formData.append('email', email);
            formData.append('rut', rut);  // Agrega el archivo

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

                const result = await response.json();
                console.log("Resultado:", result);
                alert("Registro de persona natural exitoso.");
                window.location.href = '/Views/userPage.html';
            } catch (error) {
                console.error("Error completo:", error);
                alert(error.message || 'Error al procesar la solicitud');
            } finally {
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Enviar";
            }
        }
    });
});
