const buttonSubmit = document.getElementById('button')
const href = window.location.href
buttonSubmit.addEventListener('click', async (e) => {
  e.preventDefault()
  await fetch(href, { method: 'PUT' })
    .then((response) => {
      return response.json()
    })
    .then(data => {
      alert(data)
    })
    .catch(error => console.log(error))
})
