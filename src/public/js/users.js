const eliminarUsuarioBtn = document.getElementById('eliminarUsuario')

eliminarUsuarioBtn.addEventListener('click', function () {
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

// Function to fetch all users
async function getUsers () {
  try {
    const response = await fetch('/api/users', { method: 'GET' })
    if (!response.ok) {
      throw new Error('An unexpected error occurred while fetching users')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// Function to delete a user
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

// Main function that handles the flow
async function main () {
  const users = await getUsers()
  if (users) {
    users.data.forEach(user => {
      const deleteButton = document.getElementById(`deleteUserButton${user.email}`)
      deleteButton.addEventListener('click', async (e) => {
        e.preventDefault()
        await deleteUser(user.email)
      })

      const modifyRoleButton = document.getElementById(`modifyRoleButton${user.email}`)
      modifyRoleButton.addEventListener('click', async (e) => {
        e.preventDefault()
        await modifyUserRole(user.email)
      })
    })
  }
}

// Call the main function to start the process
main()
