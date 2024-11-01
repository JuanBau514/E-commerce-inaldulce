import { imagenUrl } from "./imagenAurl.js";
//import { spinner_animation } from "./spinnerAnimation.js";
const spinner = document.querySelector('.spinner');

const productoNombre = document.getElementById('producto-nombre');
const productoPrecio = document.getElementById('producto-precio');
const productoDescripcion = document.getElementById('producto-descripcion');
const productoCantidad = document.getElementById('producto-cantidad');
const productoImagen = document.getElementById('producto-urlImagen');

const campoNombre = document.getElementById('nombre-producto-formulario');
const campoPrecio = document.getElementById('precio-producto-formulario');
const campoDescripcion = document.getElementById('descripcion-producto-formulario');
const campoCantidad = document.getElementById('cantidad-producto-formulario');
const campoImagen = document.getElementById('imagen-producto-formulario');
const previa = document.querySelector('#previa');


window.onload = async function(){


    const producto = await fetch('http://localhost:3000/api/users/productoUnidad');
    producto.json().then((producto)=>{
        productoNombre.textContent = producto.nombre;
        productoPrecio.textContent = producto.precio;
        productoDescripcion.textContent = producto.descripcion;
        productoCantidad.textContent = producto.cantidad_disponible;
        productoImagen.src = producto.url_imagen;
        previa.src = producto.url_imagen;

        campoNombre.value = producto.nombre;
        campoPrecio.value = producto.precio;
        campoDescripcion.value = producto.descripcion;
        campoCantidad.value = producto.cantidad_disponible;
        
        //productoNombre.textContent = producto.nombre;
    })   

    document.querySelector('form').addEventListener('submit',async (e)=>{
        //const previa = document.querySelector('#previa');        
        e.preventDefault();
    
        const nombre=campoNombre.value
        const descripcion=campoDescripcion.value 
        const cantidad_disponible= campoCantidad.value
        const precio= campoPrecio.value
        const url_imagen = (previa.src === "" || previa.src === null || previa.src === undefined) ? "" : previa.src;
        
            alert('ARTICULO MODIFIED')
            window.location.href = "/Views/admin_productos/productos_ver.html"

        await fetch('http://localhost:3000/api/users/productos',{
            method:"PUT",
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


    campoImagen.addEventListener('input', async () => {
        const file = campoImagen.files[0]; // Obtener el primer archivo
        if (file) {
            const base64URL = await imagenUrl.encodeFileAsBase64URL(file);
            previa.setAttribute('src', base64URL); // Establecer la imagen con el src en base64
        }
    });

}



/*     
       
    
        */