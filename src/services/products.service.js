import { ProductManagerDBDAO } from '../DAO/DB/productManagerDB.dao.js'
import { newMessage } from '../utils/utils.js'
import { CustomError } from './errors/custom-error.js'
import { EErros } from './errors/enums.js'
import { dataVerification } from '../utils/dataVerification.js'
import { fileURLToPath } from 'url'
import { sendMail } from '../utils/nodemailer.js'
const ProductManagerDAO = new ProductManagerDBDAO()
export class ProductManagerDBService {
  async addProduct (title, description, price, thumbnails, code, stock, category, owner) {
    try {
      if (owner === 'adminCoder@coder.com') {
        owner = 'admin'
      }
      dataVerification([title, description, category, code, owner, thumbnails, 'string'], [Math.round(Number(price)), Number(stock), 'number'], [[thumbnails], 'array'])
      const product = { title, description, price, thumbnails, code, stock, category, owner }
      const products = await this.getProducts()
      const codeVerificator = products.data.payload.some((productToFind) => productToFind.code === code)
      if (codeVerificator) {
        CustomError.createError({
          name: 'Product creation error',
          cause: 'The code was equal to another one in the database',
          message: 'Error trying to create product',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      } else {
        const lastAdded = await ProductManagerDAO.addProduct(product)
        return newMessage('success', 'Product added successfully', lastAdded, '', 200)
      }
    } catch (e) {
      throw newMessage('failure', 'Failed to create a product', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async updateProduct (id, propsReceivedToUpdate) {
    try {
      dataVerification([id, 'string'], [propsReceivedToUpdate, 'object'])
      let productToUpdate = await this.getProductById(id)
      productToUpdate = productToUpdate.data
      const entriesRecieved = Object.entries(propsReceivedToUpdate)
      const valuesToUpdate = Object.keys(productToUpdate)
      const dataTypes = Object.entries(productToUpdate).map((prop) => ({ key: prop[0], type: prop[0] === 'thumbnails' ? 'string' : typeof (prop[1]) }))
      const messages = []
      const propToUpdateFound = entriesRecieved.map((entry) => {
        const status = valuesToUpdate.some((propUpdate) => entry[0] === propUpdate && entry[0] !== 'id' && entry[0] !== 'status')
        return { entries: { key: entry[0], value: entry[1] }, status, type: typeof (entry[1]) }
      })
      let status2 = ''
      for (let i = 0; i < propToUpdateFound.length; i++) {
        const prop = propToUpdateFound[i]
        const sameTypeAndKey = dataTypes.find((type) => type.type === prop.type && type.key === prop.entries.key)
        const sameKey = dataTypes.find(type => type.key === prop.entries.key)
        status2 = ''
        if (prop.status && sameTypeAndKey) {
          if (prop.entries.key === 'thumbnails') {
            const thumbnailRepeated = productToUpdate.thumbnails.some(thumbnail => thumbnail === prop.entries.value)
            thumbnailRepeated ? messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) has a value repeated`) : productToUpdate.thumbnails.push(prop.entries.value)
            status2 = 'warning'
          } else {
            productToUpdate[prop.entries.key] = prop.entries.value
            status2 = 'success'
          }
        } else {
          status2 = 'warning'
          messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) was provided incorrectly`)
          prop.status ? messages.push(`Must be ${sameKey?.type}`) : messages.push('The prop must be title, description, price, thumbnails, code or stock')
        }
      }
      await ProductManagerDAO.updateProduct(productToUpdate)
      return newMessage(status2, 'Updated successfully' + (messages).toString(), productToUpdate, '', 200)
    } catch (e) {
      throw newMessage('failure', 'Failed to update a product', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getProducts (limit, page, query, sort) {
    const res = (status, payload, restPaginate) => {
      let prevLink = `/home?limit=${limit || ''}&category=${query || ''}&sort=${sort || ''}&page=`
      let nextLink = `/home?limit=${limit || ''}&category=${query || ''}&sort=${sort || ''}&page=`
      restPaginate.hasPrevPage ? prevLink += restPaginate.prevPage : prevLink = null
      restPaginate.hasNextPage ? nextLink += restPaginate.nextPage : nextLink = null
      return {
        status, payload, prevLink, nextLink, totalPages: restPaginate.totalPages, prevPage: restPaginate.prevPage, nextPage: restPaginate.nextPage, page: restPaginate.page, hasPrevPage: restPaginate.hasPrevPage, hasNextPage: restPaginate.hasNextPage
      }
    }
    try {
      dataVerification([query || 'none', 'string'], [limit, page, sort, 'number'])
      const { docs, rest } = await ProductManagerDAO.getProducts(limit, page, query, sort)
      return newMessage('success', 'the products were found correctly', res('success', docs, rest), '', 200)
    } catch (e) {
      throw newMessage('failure', 'the products were not found', res(e, {}, {}), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getProductById (id) {
    try {
      dataVerification([id, 'string'])
      const productFindId = await ProductManagerDAO.getProductById(id)
      if (productFindId) {
        return newMessage('success', 'Product found successfully', productFindId, '', 200)
      } else {
        CustomError.createError({
          name: 'Finding product error',
          cause: 'The product was not found',
          message: 'Error trying to find product',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      throw newMessage('failure', 'Failed to get the product', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async deleteProduct (id, owner) {
    try {
      dataVerification([id, owner, 'string'])
      const product = await this.getProductById(id)
      if (owner === product.data.owner || owner === 'adminCoder@coder.com') {
        const productToDelete = await ProductManagerDAO.deleteProduct(id)
        if (product.data.owner !== 'admin') {
          await sendMail(product.data.owner, 'Eliminación de producto', `
        <div>
          <h1>Su producto(${product.data.title}) ha sido eliminado por ${owner === 'adminCoder@coder.com' ? 'administrador' : 'usted'}</h1>
        </div>
        `)
        }
        return newMessage('success', 'Deleted successfully', productToDelete, '', 200)
      } else {
        CustomError.createError({
          name: 'Deleting product error',
          cause: 'The product was not deleted(owner)',
          message: 'Error trying to delete product(owner)',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      throw newMessage('failure', 'Failed to delete the product', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }
}
