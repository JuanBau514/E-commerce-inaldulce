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


document.getElementById("boton-enviar").addEventListener("click", async (event) => {
    event.preventDefault();

    const tipoUsuario = document.getElementById("tipoUsuario").value;

    if (tipoUsuario === "natural") {
        // Captura los datos de la persona natural
        const data = {
            cedula: document.getElementById("cedula").value,
            nombre: document.getElementById("nickname").value,
            apellido: document.getElementById("lastname").value,
            correo: document.getElementById("email").value,
            contraseña: "Contraseña", // Reemplaza por una contraseña segura
            id_genero: 1, // Ajusta según el valor seleccionado
            id_rol: 1, // Cliente por defecto
        };
        
        await fetch("http://127.0.0.1:3000/api/users/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } else if (tipoUsuario === "empresa") {
        // Captura los datos de la empresa
        const data = {
            nit: document.getElementById("nit").value,
            razon_social: document.getElementById("razon_social").value,
            correo: document.getElementById("correo_empresa").value,
            telefono: document.getElementById("telefono_empresa").value,
            id_rubro: 1, // Ajusta según el valor
            cedula_representante_legal: document.getElementById("cedula_representante").value,
        };
        
        await fetch("http://127.0.0.1:3000/api/users/empresas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }
});
