const buttonSubmit = document.getElementById('buttonSubmitPass')
const href = window.location.href
buttonSubmit?.addEventListener('click', async (e) => {
  e.preventDefault()
  await fetch(href, { method: 'PUT' })
    .then((response) => {
      if (!response.ok) {
        alert('ha ocurrido un error, la contraseña no se ha cambiado')
        throw new Error('ha ocurrido un error inesperado')
      }
      return response.json()
    })
    .then(data => {
      alert(data.message)
    })
    .catch(error => console.log(error))
})
