//const { createServer } = require("mysql2");

const creaFila = (id,nombre,apellido,correo,id_genero,id_rol) =>{
    
    if(id_genero == 1){
        id_genero = 'Masculino';
    }else{
        id_genero = 'Femenino';
    }

    if(id_rol == 1){
        id_rol = 'Administrador'
    }else{
        id_rol = 'Cliente';
    }

    const fila = document.createElement('tr')
    fila.innerHTML = `
    <tr>
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${correo}</td>
        <td>${id_genero}</td>
        <td>${id_rol}</td>
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
         usuario.id_genero,
         usuario.id_rol
        )
        tablaUsuarios.appendChild(nuevaFila)
    })

}


window.onload = function() {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('Debes iniciar sesión');
        window.location.href = '/Views/login.html';
      } else {
        fetch('http://localhost:3000/api/users/usuarios',{
            method:'GET'
        }).then((data)=>{
            data.json().then((usuarios)=>{            
                agregarUsuariosTabla(usuarios[0])
                
            });
        })
      }
   
}