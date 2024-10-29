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
    const tablaUsuarios = document.getElementById('tabla_usuarios').getElementsByTagName('tbody')[0]
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
            
        });
    })
}
