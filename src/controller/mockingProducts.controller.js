import { MockingProductsService } from '../services/mockingProducts.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const MockingProductsManager = new MockingProductsService()
export class MockingProductsController {
  async createMockProducts (req, res) {
    const response = dataResponseToString(MockingProductsManager.createMockProducts())
    return res.status(200).render('response', { response })
  }
}
