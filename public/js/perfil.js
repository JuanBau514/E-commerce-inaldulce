const form = document.querySelector('form');

const inputid = document.getElementById('id');
const inputNombre = document.getElementById('first-name');
const inputApellido = document.getElementById('last-name');
const inputCorreo = document.getElementById('email');
const inputContrasenaActual = document.getElementById('currentPassword');
const inputContrasenaNueva = document.getElementById('newPassword');
const inputGenero = document.getElementById('gender');
const botonCambios = document.getElementById('GuardaCambiosBtn');




const ponerInformacion = (cedula,nombre,apellido,email,genero) =>{

  const perfil_nombre = document.getElementById('profile-name');
  const perfil_apellido = document.getElementById('profile-lastName');
  const perfil_id = document.getElementById('profile-id');
  const perfil_correo = document.getElementById('profile-email');
  const perfil_genero = document.getElementById('profile-gender');
  const perfil_rol = document.getElementById('profile-role');
  

    inputid.value = cedula;
    inputNombre.value = nombre;
    inputApellido.value = apellido;
    inputCorreo.value = email;

    perfil_nombre.innerText = nombre
    perfil_apellido.innerText = apellido
    perfil_id.innerText = cedula
    perfil_correo.innerText = email
    perfil_rol.innerText = 'Administrador'

    console.log(genero);
    if(genero == 1){
        inputGenero.value = 'Masculino';
        perfil_genero.innerText = 'Masculino';
    }else{
        inputGenero.value = 'Femenino';
        perfil_genero.innerText = 'Femenino';
    }
    
    
}

window.onload = function() {
    const token = localStorage.getItem('token');
    //let contrasenaAcutal;
    if (!token) {
      alert('Debes iniciar sesión');
      window.location.href = '/Views/login.html';
    } else {
      fetch('http://localhost:3000/api/users/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('No se pudo obtener la información del usuario');
        } else {
          
          ponerInformacion(data.cedula,data.nombre,data.apellido,data.correo,data.genero)          
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }


    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario
    
        const cedula = inputid.value
        const nombre = inputNombre.value
        const apellido = inputApellido.value
        const correo = inputCorreo.value
        const id_genero= inputGenero.value
        
        const contrasenaAcutal = inputContrasenaActual.value;
        const contrasenaNueva = inputContrasenaNueva.value;
        
        fetch('http://localhost:3000/api/users/modificarUsuario', {
            method: 'PUT', // Método para actualizar
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                id_genero: 2,
                contrasenaAcutal: contrasenaAcutal,
                contrasenaNueva: contrasenaNueva
                
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert('Cambios guardados con éxito.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al guardar los cambios.');
        });
    
    })
      

};

