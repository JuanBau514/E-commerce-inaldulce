window.onload = function() {{
    const token = localStorage.getItem('token')
    if (!token) {
        alert('Debes iniciar sesión');
        window.location.href = '/Views/login.html';
      } else {
        
      }
}