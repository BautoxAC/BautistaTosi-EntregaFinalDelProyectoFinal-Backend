// eslint-disable-next-line no-unused-vars
async function finishBuying (cartId) {
  await fetch(`/api/carts/${cartId}/purchase`, { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        console.log(response)
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      alert('compra realizada')
      setTimeout(() => {
        location.reload()
      }, 2500)
    })
    .catch(error => console.log(error))
}
