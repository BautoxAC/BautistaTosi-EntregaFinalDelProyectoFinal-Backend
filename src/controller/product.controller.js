import { ProductManagerDBService } from '../services/products.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const list = new ProductManagerDBService()
export class ProductsController {
  async getProducts (req, res) {
    try {
      const { limit, page, query, sort } = req.query
      const response = dataResponseToString(await list.getProducts(limit || 10, page || 1, query, sort || null))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async getProductById (req, res) {
    try {
      const Id = req.params.pid
      const response = dataResponseToString('success', 'producto por id', await list.getProductById(Id))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async updateProduct (req, res) {
    try {
      const Id = req.params.pid
      const productPropsToUpdate = req.body
      const response = dataResponseToString(await list.updateProduct(Id, productPropsToUpdate))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async deleteProduct (req, res) {
    try {
      const Id = req.params?.pid
      const owner = req.session?.user?.email
      const response = dataResponseToString(await list.deleteProduct(Id, owner))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async newProduct (req, res) {
    try {
      const newProduct = req.body
      const owner = req?.session?.user?.email || 'admin'
      const imageUrl = `/${req.file.originalname}`
      const response = dataResponseToString(await list.addProduct(newProduct.title, newProduct.description, newProduct.price, imageUrl, newProduct.code, newProduct.stock, newProduct.category, owner))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }
}
