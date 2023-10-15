import { ProductManagerDBService } from '../services/products.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const list = new ProductManagerDBService()
export class ProductsController {
  async getProducts (req, res) {
    const { limit, page, query, sort } = req.query
    const response = dataResponseToString(await list.getProducts(limit, page, query, sort))
    return res.status(200).render('response', { response })
  }

  async getProductById (req, res) {
    const Id = req.params.pid
    const response = dataResponseToString('success', 'producto por id', await list.getProductById(Id))
    return res.status(200).render('response', { response })
  }

  async updateProduct (req, res) {
    const Id = req.params.pid
    const productPropsToUpdate = req.body
    const response = dataResponseToString(await list.updateProduct(Id, productPropsToUpdate))
    return res.status(200).render('response', { response })
  }

  async deleteProduct (req, res) {
    const Id = req.params?.pid
    const owner = req.session?.user?.email
    const response = dataResponseToString(await list.deleteProduct(Id, owner))
    return res.status(200).render('response', { response })
  }

  async newProduct (req, res) {
    const newProduct = req.body
    const owner = req?.session?.user?.email || 'admin'
    const imageUrl = `/${req.file.originalname}`
    const response = dataResponseToString(await list.addProduct(newProduct.title, newProduct.description, newProduct.price, imageUrl, newProduct.code, newProduct.stock, newProduct.category, owner))
    return res.status(200).render('response', { response })
  }
}
