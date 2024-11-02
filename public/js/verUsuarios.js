const barraBusqueda = document.getElementById('busqueda')
const botonBuscar = document.getElementById('botonBusqueda')
const tablaUsuarios = document.getElementById('tabla_usuarios').getElementsByTagName('tbody')[0]

const creaFila = (id,nombre,apellido,correo,genero,id_rol,nit_empresa,razon_social) =>{
    
    if(!nit_empresa || !razon_social){
        nit_empresa = 'No registra'
        razon_social= 'No registra'
        
    }

    const fila = document.createElement('tr')
    fila.innerHTML = `
    <tr>
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${correo}</td>
        <td>${genero}</td>
        <td>${id_rol}</td>
        <td>${nit_empresa}</td>
        <td>${razon_social}</td>
    </tr>    
    `
    return fila;
}


const agregarUsuariosTabla = (usuarios)=>{
    
    usuarios.forEach((usuario)=>{
        
        const nuevaFila = creaFila(
         usuario.cedula,
         usuario.nombre,
         usuario.apellido,
         usuario.correo,
         usuario.genero,
         usuario.rol,
         usuario.nit_empresa,
         usuario.razon_social
        )
        tablaUsuarios.appendChild(nuevaFila)
    })

}


window.onload = function() {
    fetch('http://localhost:3000/api/users/usuarios',{
        method:'GET'
    }).then((data)=>{
        data.json().then((usuarios)=>{            
            agregarUsuariosTabla(usuarios[0])
            
            botonBuscar.addEventListener('click',(e)=>{
                const cedula_buscar = (barraBusqueda.value).trim();   

                let usuarioEncontrado = usuarios[0].filter((usuario)=>{
                    if(usuario.cedula == cedula_buscar ){
                        return usuario;
                    }
                })
                            
                if(usuarioEncontrado.length > 0){
                    tablaUsuarios.innerHTML =''
                   usuarioEncontrado = creaFila(
                        usuarioEncontrado[0].cedula,
                        usuarioEncontrado[0].nombre,
                        usuarioEncontrado[0].apellido,
                        usuarioEncontrado[0].correo,                    
                        usuarioEncontrado[0].genero,
                        usuarioEncontrado[0].rol,
                        usuarioEncontrado[0].nit_empresa,                    
                        usuarioEncontrado[0].razon_social,
                    )                    
                    
                    tablaUsuarios.innerHTML =''
                    tablaUsuarios.appendChild(usuarioEncontrado);
                    
                }else{            
                    alert("usuario NO encontrado")
                    window.location.href = '/Views/admin_usuarios/usuarios_ver.html';
                    
                }
                
            })
    
        });

        
    })
}

