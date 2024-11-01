/*Esta es una animación de un spinner
Para usarla busque el elemento html con clase spinner
y use una de las funciones de spinner_animation, ya sea mostrar o esconder
*/
import { spinner_animation } from "./spinnerAnimation.js";

const barraBusqueda = document.getElementById('busqueda')
const botonBuscar = document.getElementById('botonBusqueda')

function crearProducto(codigo_producto, nombre,descripcion,precio,cantidad_disponible,imagen_url='https://via.placeholder.com/150') {
    // Crear contenedor principal del producto
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");
   // productoDiv.id = codigo_producto;

    // Crear contenedor de la imagen
    const imagenDiv = document.createElement("div");
    const imagen = document.createElement("img");
    imagen.src = imagen_url;
    imagen.alt = "Imagen de un producto inaldulces";
    imagen.classList.add("producto__imagen");
    imagenDiv.appendChild(imagen);

    // Crear elementos de información del producto
    const nombreSpan = document.createElement("span");
    nombreSpan.classList.add("producto__nombre");
    nombreSpan.textContent = nombre;

    const codigoSpan = document.createElement("span");
    codigoSpan.classList.add("producto__codigo");
    codigoSpan.textContent = `Codigo : ${codigo_producto}`;

    const descripcionSpan = document.createElement("span");
    descripcionSpan.classList.add("producto__descripcion");
    descripcionSpan.textContent = descripcion;

    const precioSpan = document.createElement("span");
    precioSpan.classList.add("producto__precio");
    precioSpan.textContent = `$${precio}`;

    const cantidadSpan = document.createElement("span");
    cantidadSpan.classList.add("producto__cantidadDisponible");
    cantidadSpan.textContent = `${cantidad_disponible} disponibles`;

    // Crear botón de editar
    const editarBtn = document.createElement("button");
    editarBtn.classList.add("producto__editar");
    editarBtn.textContent = "Editar";
    
    /*Al presionar el boton editar, haré una petición post al servidor para guardar el codigo_producto del actual producto
     y así guardarlo en el servidor para mayor seguridad
    */
    editarBtn.onclick = async function () {        
        await fetch('http://localhost:3000/api/users/establecerProductoParaEdicion',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo_producto })
        });

        window.location.href = '/Views/admin_productos/productos_modificar.html';
    };

    // Agregar elementos al contenedor principal
    productoDiv.appendChild(imagenDiv);
    productoDiv.appendChild(nombreSpan);
    productoDiv.appendChild(codigoSpan);
    productoDiv.appendChild(descripcionSpan);
    productoDiv.appendChild(precioSpan);
    productoDiv.appendChild(cantidadSpan);
    productoDiv.appendChild(editarBtn);

    // Insertar el componente en el DOM
    //document.body.appendChild(productoDiv);

    return productoDiv;
}


window.onload = async function() {
    const spinner = document.querySelector('.spinner');
    spinner_animation.showSpinner(spinner);
   try {
        const lista_productos = document.querySelector('.listaProductos__productos'); 
        

       
        const response = await fetch('http://localhost:3000/api/users/productos')
        const productos = response.json()

        
        productos.then((información)=>{
            información = información[0]
            
            información.forEach((producto)=>{                
            
                producto.url_imagen = (producto.url_imagen === "" || producto.url_imagen === null || producto.url_imagen === undefined) ? undefined : producto.url_imagen;
            
                const nuevoProducto = crearProducto(producto.codigo_producto,
                    producto.nombre,
                    producto.descripcion,
                    producto.precio,                    
                    producto.cantidad_disponible,
                    producto.url_imagen,
                )
        
                lista_productos.appendChild(nuevoProducto)
                
            })

            botonBuscar.addEventListener('click',(e)=>{
                const codigo_buscar = (barraBusqueda.value).trim();   

                let productoEncontrado = información.filter((producto)=>{
                    if(producto.codigo_producto == codigo_buscar ){
                        return producto;
                    }
                })
                            
                if(productoEncontrado.length > 0){
                    lista_productos.innerHTML = ''
                   productoEncontrado = crearProducto(productoEncontrado[0].codigo_producto,
                        productoEncontrado[0].nombre,
                        productoEncontrado[0].descripcion,
                        productoEncontrado[0].precio,                    
                        productoEncontrado[0].cantidad_disponible,
                        productoEncontrado[0].url_imagen                    
                    )                    
                    lista_productos.appendChild(productoEncontrado)
                    
                }else{            
                    alert("producto NO encontrado")
                    window.location.href = '/Views/admin_productos/productos_ver.html';
                    
                }
                
            })
    
        })

        spinner_animation.hideSpinner(spinner)

        
        
    } catch (error) {
        alert(`Hubo un error ${error}`)
    }
};
