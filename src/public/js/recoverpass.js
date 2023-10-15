const buttonSubmitPass = document.getElementById('buttonSubmitPass')
const newPass = document.getElementById('password')
const href = window.location.href
buttonSubmitPass?.addEventListener('click', async (e) => {
  e.preventDefault()
  if (newPass.value === '') {
    alert('la contraseña nueva esta vacia')
    return
  }
  await fetch(`${href}&password=${newPass.value}`, { method: 'PUT' })
    .then((response) => {
      if (!response.ok) {
        alert('ha ocurrido un error, la contaseña no se ha restablecido')
        throw new Error('ha ocurrido un error inesperado')
      }
      return response.json()
    })
    .then(data => {
      alert('contraseña restablecida')
    })
    .catch(error => console.log(error))
})
