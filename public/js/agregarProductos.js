const campoNombre = document.getElementById('nombre-producto-formulario');
const campoPrecio = document.getElementById('precio-producto-formulario');
const campoDescripcion = document.getElementById('descripcion-producto-formulario');
const campoCantidad = document.getElementById('cantidad-producto-formulario');
const campoImagen = document.getElementById('imagen-producto-formulario');
const previa = document.querySelector('#previa');

import { imagenUrl } from "./imagenAurl.js";

window.onload = async function(){

    document.querySelector('form').addEventListener('submit',async (e)=>{
        e.preventDefault();

        const nombre=campoNombre.value
        const descripcion=campoDescripcion.value 
        const cantidad_disponible= campoCantidad.value
        const precio= campoPrecio.value
        const url_imagen = (previa.src === "" || previa.src === null || previa.src === undefined) ? "" : previa.src;

                    alert('producto creado')
            window.location.href = "/Views/admin_productos/productos_ver.html"

        await fetch('http://localhost:3000/api/users/productos',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            
            body:JSON.stringify({
                nombre,
                descripcion,
                cantidad_disponible,
                precio,
                url_imagen
            })
        })
        
    })


    campoImagen.addEventListener('input', async (event) => {
        const file = campoImagen.files[0]; // Obtener el primer archivo
        if (file) {
            const base64URL = await imagenUrl.encodeFileAsBase64URL(file);
            previa.setAttribute('src', base64URL); // Establecer la imagen con el src en base64
        }
    });
}

