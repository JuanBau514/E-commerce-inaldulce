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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("boton-enviar").addEventListener("click", async (event) => {
        event.preventDefault();

        const tipoUsuario = document.getElementById("tipoUsuario").value;

        if (tipoUsuario === "empresa") {
            const empresaData = {
                razon_social: document.getElementById('razon_social').value,
                nit: document.getElementById('nit').value,
                telefono_empresa: document.getElementById('telefono_empresa').value,
                correo: document.getElementById('email_empresa').value,
                id_rubro: document.getElementById('rubro').value,
                representante: {
                    nombre: document.getElementById('nombre_representante').value,
                    apellido: document.getElementById('apellido_representante').value,
                    cedula: document.getElementById('cedula_representante').value,
                }
            };

            // Validar campos de la empresa
            if (!empresaData.razon_social || !empresaData.nit || !empresaData.correo) {
                alert("Por favor, complete todos los campos de la empresa.");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:3000/api/users/empresas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(empresaData),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || "Error al registrar la empresa");
                }

                console.log("Empresa registrada:", await response.json());
            } catch (error) {
                console.error("Error al registrar la empresa:", error.message);
            }
        }
    });
});

