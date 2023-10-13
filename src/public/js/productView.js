const origin = window.location.origin

// Function to get user profile
async function getUserProfile () {
  try {
    const response = await fetch(`${origin}/auth/perfil`, { method: 'GET' })
    if (!response.ok) {
      throw new Error('Ha ocurrido un error inesperado al obtener el perfil del usuario')
    }
    const data = await response.json()
    return data.perfil
  } catch (error) {
    alert('Ha ocurrido un error al obtener el perfil del usuario')
    console.error(error)
  }
}

// Function to get products
async function getProducts () {
  try {
    const response = await fetch(`${origin}/api/products`, { method: 'GET' })
    if (!response.ok) {
      throw new Error('Ha ocurrido un error inesperado al obtener los productos')
    }
    const data = await response.json()
    return data.payload
  } catch (error) {
    alert('Ha ocurrido un error al obtener los productos')
    console.error(error)
  }
}

// Function to delete a product
async function deleteProduct (productId) {
  try {
    const response = await fetch(`${origin}/api/products/${productId}`, { method: 'DELETE' })
    if (!response.ok) {
      throw new Error('Ha ocurrido un error inesperado al eliminar el producto')
    }
    alert('Producto eliminado correctamente')
  } catch (error) {
    alert('Ha ocurrido un error al eliminar el producto')
    console.error(error)
  }
}

// Function to add a product to the cart
async function addToCart (productId, cartId) {
  try {
    const response = await fetch(`${origin}/api/carts/${cartId}/products/${productId}`, { method: 'POST' })
    if (!response.ok) {
      throw new Error('Ha ocurrido un error inesperado al agregar el producto al carrito')
    }
    alert('Producto agregado al carrito correctamente')
  } catch (error) {
    alert('Ha ocurrido un error al agregar el producto al carrito')
    console.error(error)
  }
}

// Main function that handles the flow
async function main () {
  const user = await getUserProfile()
  if (user) {
    const products = await getProducts()
    products.forEach(product => {
      const botonEliminar = document.getElementById(`buttonEliminate${product._id}`)
      botonEliminar.addEventListener('click', async (e) => {
        e.preventDefault()
        await deleteProduct(product._id)
      })

      const agregarAlCarrito = document.getElementById('agregateOne' + product._id)
      agregarAlCarrito.addEventListener('click', async (e) => {
        e.preventDefault()
        await addToCart(product._id, user.cart)
      })
    })
  }
}

main()
