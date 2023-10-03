const origin = window.location.origin
fetch(`${origin}/auth/perfil`, { method: 'GET' })
  .then((response) => {
    if (!response.ok) {
      alert('ha ocurrido un error, el usuario no se ha encontrado')
      throw new Error('ha ocurrido un error inesperado')
    }
    return response.json()
  })
  .then(data => {
    getProducts(data.perfil)
  })
  .catch(error => console.log(error))
function getProducts (user) {
  fetch(`${origin}/api/products`, { method: 'GET' })
    .then((response) => {
      if (!response.ok) {
        alert('ha ocurrido un error, el product no se ha eliminado')
        throw new Error('ha ocurrido un error inesperado')
      }
      return response.json()
    })
    .then(data => {
      deleteProductsAndAgregatrToCart(data.payload, user)
      return data
    })
    .catch(error => console.log(error))
}

function deleteProductsAndAgregatrToCart (products, user) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const botonEliminar = document.getElementById(`buttonEliminate${product._id}`)
    botonEliminar.addEventListener('click', async (e) => {
      e.preventDefault()
      await fetch(`${origin}/api/products/${product._id}`, { method: 'DELETE' })
        .then((response) => {
          if (!response.ok) {
            alert('ha ocurrido un error, el producto no se ha eliminado')
            throw new Error('ha ocurrido un error inesperado')
          }
          return response.json()
        })
        .then(data => {
          alert('producto eliminado correctamente')
        })
        .catch(error => console.log(error))
    })

    document.getElementById('agregateOne' + product._id).addEventListener('click', async (e) => {
      e.preventDefault()
      await fetch(`${origin}/api/carts/${user.cart}/products/${product._id}`, { method: 'POST' })
        .then((response) => {
          if (!response.ok) {
            alert('ha ocurrido un error, el producto no se ha agregado')
            throw new Error('ha ocurrido un error inesperado')
          }
          return response.json()
        })
        .then(data => {
          alert('producto agregado al carrito correctamente')
        })
        .catch(error => console.log(error))
    })
  }
}
