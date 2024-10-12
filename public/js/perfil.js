const form = document.querySelector('form');

const inputid = document.getElementById('id');
const inputNombre = document.getElementById('first-name');
const inputApellido = document.getElementById('last-name');
const inputCorreo = document.getElementById('email');
const inputContrasenaActual = document.getElementById('currentPassword');
const inputContrasenaNueva = document.getElementById('newPassword');
const inputGenero = document.getElementById('gender');
const botonCambios = document.getElementById('GuardaCambiosBtn');



const ponerInformacion = (id,nombre,apellido,email,genero) =>{
    inputid.value = id;
    inputNombre.value = nombre;
    inputApellido.value = apellido;
    inputCorreo.value = email;
    console.log(genero);
    if(genero = 1){
        inputGenero.value = 'Masculino';
    }else{
        inputGenero.value = 'Femenino';
    }
    
    
}

window.onload = function() {
    const token = sessionStorage.getItem('token');
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
          
          ponerInformacion(data.id,data.nombre,data.apellido,data.correo,data.genero)
          //contrasenaAcutal = data.contraseña
          console.log(data);
          //console.log(contrasenaAcutal);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }


    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario
    
        const id = inputid.value
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
                id: id,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                id_genero: 1,
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

