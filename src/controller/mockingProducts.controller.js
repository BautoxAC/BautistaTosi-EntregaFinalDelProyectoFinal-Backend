import { MockingProductsService } from '../services/mockingProducts.service.js'
import { errorCases } from '../services/errors/errorCases.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const MockingProductsManager = new MockingProductsService()
export class MockingProductsController {
  async createMockProducts (req, res) {
    try {
      const response = dataResponseToString(MockingProductsManager.createMockProducts())
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }
}
