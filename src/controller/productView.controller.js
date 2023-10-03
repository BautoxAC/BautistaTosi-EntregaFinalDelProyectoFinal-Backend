import { ProductManagerDBService } from '../services/products.service.js'
import { UserManagerDBService } from '../services/user.service.js'
const UserManager = new UserManagerDBService()
const list = new ProductManagerDBService()
export class ProductViewController {
  async renderAllProducts (req, res) {
    const { limit, page, query, sort } = req.query
    const { email, role, cart } = req.session.user
    const userId = await UserManager.getUserByUserName(email)
    const pageInfo = await list.getProducts(limit, page, query, sort)
    return res.status(200).render('products', {
      ...pageInfo,
      email,
      urlCart: `/carts/${cart}`,
      role,
      userId: userId?.data?._id
    })
  }

  async renderDetails (req, res) {
    const productId = req.params.pid
    const detailsProduct = await list.getProductById(productId)
    return res.status(200).render('details', { detailsProduct: detailsProduct.data })
  }
}
