const eliminarUsuarioBtn = document.getElementById('eliminarUsuario')

eliminarUsuarioBtn.addEventListener('click', function () {
  fetch('/api/users/', {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        alert('Usuario eliminado con éxito.')
      } else {
        alert('Hubo un error al eliminar el usuario.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
})
