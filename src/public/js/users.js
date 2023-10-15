const eliminarUsuarioBtn = document.getElementById('eliminarUsuario')

eliminarUsuarioBtn.addEventListener('click', function (e) {
  fetch('/api/users/', {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        alert('Usuarios eliminados con éxito.')
      } else {
        alert('Hubo un error al eliminar los usuarios.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
})
// Function to delete a user
// eslint-disable-next-line no-unused-vars
async function deleteUser (userName) {
  try {
    const response = await fetch(`/api/users/${userName}`, { method: 'DELETE' })
    if (!response.ok) {
      throw new Error('An unexpected error occurred while deleting the user')
    }
    alert('User deleted successfully')
  } catch (error) {
    console.error(error)
  }
}

// Function to modify a user's role
// eslint-disable-next-line no-unused-vars
async function modifyUserRole (userName) {
  try {
    const response = await fetch(`/api/users/premium/${userName}`, {
      method: 'POST'
    })
    if (!response.ok) {
      throw Error('An unexpected error occurred while modifying the user role')
    }
    alert('User role modified successfully')
  } catch (error) {
    console.error(error)
  }
}
