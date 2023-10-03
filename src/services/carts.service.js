import { CartManagerDBDAO } from '../DAO/DB/cartManagerDB.dao.js'
import { newMessage } from '../utils/utils.js'
import { CustomError } from './errors/custom-error.js'
import { EErros } from './errors/enums.js'
import { ProductManagerDBService } from './products.service.js'
import { fileURLToPath } from 'url'
const listProducts = new ProductManagerDBService()
const CartManagerDAO = new CartManagerDBDAO()
export class CartManagerDBService {
  async getCartById (id) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(id)
      const totalPrices = cartFindId.products.reduce((acc, pro) => acc + parseInt(pro.idProduct.price), 0)
      if (cartFindId) {
        return newMessage('success', 'Found successfully', { products: [...cartFindId.products], totalPrices, _id: cartFindId._id } || [])
      } else {
        CustomError.createError({
          name: 'Finding cart error',
          cause: 'The cart was not found',
          message: 'Error trying to find cart',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async addCart () {
    try {
      const lastAdded = await CartManagerDAO.addCart()
      return newMessage('success', 'cart added successfully', lastAdded)
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async addProduct (idCart, idProduct, owner) {
    try {
      const cart = await CartManagerDAO.getCartById(idCart)
      if (!cart) {
        CustomError.createError({
          name: 'Finding cart error',
          cause: 'The cart was not found',
          message: 'Error trying to find cart',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
      let product = await listProducts.getProductById(idProduct)
      product = product.data
      if (owner === product.owner) {
        CustomError.createError({
          name: 'Adding a product to the cart error',
          cause: 'The product was not addes(owner)',
          message: 'Error trying to add a product(owner)',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
      if (!product) {
        CustomError.createError({
          name: 'Finding product error',
          cause: 'The product was not found',
          message: 'Error trying to find product',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
      const productRepeated = cart.products.find(pro => pro.idProduct._id.toString() === product._id.toString())
      let messageReturn = {}
      if (productRepeated) {
        const positionProductRepeated = cart.products.indexOf(productRepeated)
        if (cart.products[positionProductRepeated].quantity < product.stock) {
          cart.products[positionProductRepeated].quantity++
          messageReturn = newMessage('warning', 'Product repeated: quantity added correctly', cart)
        } else {
          CustomError.createError({
            name: 'Agregating product to cart error',
            cause: 'Product repeated: quantity is iqual to the stock',
            message: 'Error trying to agregate the product to the cart',
            code: EErros.INCORRECT_CREDENTIALS_ERROR
          })
        }
      } else {
        cart.products.push({ idProduct: product._id, quantity: 1 })
        messageReturn = newMessage('success', 'Product added correctly', cart)
      }
      await CartManagerDAO.addProduct(cart)
      return messageReturn
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async deleteProduct (idCart, idProduct) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      const cartProducts = cartFindId.products
      const positionProduct = cartProducts.indexOf(cartFindId.products.find(pro => pro.idProduct === idProduct))
      cartProducts.splice(positionProduct, 1)
      await CartManagerDAO.deleteProduct(cartFindId)
      return newMessage('success', 'product deleted', cartFindId)
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async addNewProducts (idCart, products) {
    try {
      if (!Array.isArray(products) && products.length === 0) {
        CustomError.createError({
          name: 'Adding an array to cart error',
          cause: 'You must pass an array and at least one product',
          message: 'Error the products could not be agretated',
          code: EErros.INVALID_TYPES_ERROR
        })
      }
      for (const product of products) {
        const productExist = await listProducts.getProductById(product.id)
        if (!productExist) {
          CustomError.createError({
            name: 'Adding an array to cart error',
            cause: `The product with the id (${product.idProduct}) does not exist`,
            message: 'Error the products could not be agretated they do not exist',
            code: EErros.INCORRECT_CREDENTIALS_ERROR
          })
        }
        const idRepeated = products.filter(pro => pro.idProduct === product.idProduct)
        if (idRepeated.length === 2) {
          CustomError.createError({
            name: 'Adding an array to cart error',
            cause: `The product with the id (${product.idProduct}) is repeated in the array you passed`,
            message: 'Error the products could not be agretated they are repeated in the data you passed',
            code: EErros.INCORRECT_CREDENTIALS_ERROR
          })
        }
      }
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      cartFindId.products = products
      await CartManagerDAO.addNewProducts(cartFindId)
      return newMessage('success', 'products updated', cartFindId)
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async deleteAllProducts (idCart) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      cartFindId.products = []
      await CartManagerDAO.deleteAllProducts(cartFindId)
      return newMessage('success', 'products emptied', cartFindId)
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', '', fileURLToPath(import.meta.url))
    }
  }

  async createATicketToBuy (idCart, purchaser) {
    try {
      const cart = await this.getCartById(idCart)
      const productsCouldBuy = []
      const productsCouldNotBuy = []
      for (let i = 0; i < cart.data.products.length; i++) {
        const product = cart.data.products[i]
        if (product.idProduct.stock >= product.quantity) {
          productsCouldBuy.push(product)
          continue
        }
        productsCouldNotBuy.push(product.idProduct._id)
      }
      const total = productsCouldBuy.reduce((acc, pro) => acc + parseInt(pro.idProduct.price), 0)
      const ticket = await CartManagerDAO.createATicketToBuy(purchaser, total)
      for (let i = 0; i < productsCouldBuy.length; i++) {
        const product = productsCouldBuy[i]
        await listProducts.updateProduct(product.idProduct._id, { stock: product.idProduct.stock - product.quantity })
        this.deleteProduct(idCart, product.idProduct._id)
      }
      return newMessage('success', 'the ticket of the product was created', { ticket, productsCouldNotBuy })
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }
}
