// Function to delete a product
// eslint-disable-next-line no-unused-vars
async function deleteProduct (productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
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
// eslint-disable-next-line no-unused-vars
async function addToCart (productId, cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' })
    if (!response.ok) {
      throw new Error('Ha ocurrido un error inesperado al agregar el producto al carrito')
    }
    alert('Producto agregado al carrito correctamente')
  } catch (error) {
    alert('Ha ocurrido un error al agregar el producto al carrito')
    console.error(error)
  }
}
