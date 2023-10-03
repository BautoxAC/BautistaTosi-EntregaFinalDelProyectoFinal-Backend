import { ProductManagerDBService } from '../services/products.service.js'
import { newMessage } from '../utils/utils.js'
const list = new ProductManagerDBService()
export class ProductsAPIController {
  async getProducts (req, res) {
    const { limit, page, query, sort } = req.query
    return res.status(200).json(await list.getProducts(limit, page, query, sort))
  }

  async getProductById (req, res) {
    const Id = req.params.pid
    return res.status(200).json(newMessage('success', 'producto por id', await list.getProductById(Id)))
  }

  async updateProduct (req, res) {
    const Id = req.params.pid
    const productPropsToUpdate = req.body
    return res.status(200).json(newMessage(await list.updateProduct(Id, productPropsToUpdate)))
  }

  async deleteProduct (req, res) {
    const Id = req.params.pid
    const owner = req.session.user.email
    const response = await list.deleteProduct(Id, owner)
    const status = response.status === 'success' ? 200 : 400
    return res.status(status).json(response)
  }

  async newProduct (req, res) {
    const newProduct = req.body
    const owner = req?.session?.user?.email || 'admin'
    const imageUrl = `/${req.file.originalname}`
    await list.addProduct(newProduct.title, newProduct.description, newProduct.price, imageUrl, newProduct.code, newProduct.stock, newProduct.category, owner)
    return res.redirect('/products')
  }
}
