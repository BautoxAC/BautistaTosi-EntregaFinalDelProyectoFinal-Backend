import chai from 'chai'
import supertest from 'supertest'
import { fakerES } from '@faker-js/faker'
import { describe, it } from 'mocha'
const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')
let adminSession
let userSession
describe('ENDPOINT /auth', function () {
  const mockUser = {
    email: fakerES.internet.email(),
    firstName: fakerES.person.firstName(),
    lastName: fakerES.person.lastName(),
    age: fakerES.number.int({ min: 18, max: 65 }),
    password: fakerES.internet.password()
  }
  it('POST de un usuario (register)', async function () {
    this.timeout(5000)
    const response = await requester.post('/auth/register').send(mockUser)
    userSession = response.headers['set-cookie'][0]
    expect(userSession).to.be.ok
    expect(userSession).to.be.an('string')
    const { status } = response
    expect(status).to.equal(302)
  })
  it('POST de un usuario con credenciales admin (login)', async function () {
    this.timeout(5000)
    const response = await requester.post('/auth/login').send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' })
    adminSession = response.headers['set-cookie'][0]
    expect(adminSession).to.be.ok
    expect(adminSession).to.be.an('string')
    const { status } = response
    expect(status).to.equal(302)
  })
  it('GET de un usuario', async function () {
    this.timeout(5000)
    const response = await requester.get('/auth/perfil').set('Cookie', [userSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('perfil')
    expect(_body.perfil).to.be.an('object')
    expect(_body.perfil).to.not.be.an('array')
    expect(_body.perfil).to.have.property('email')
    expect(_body.perfil).to.have.property('role')
    expect(_body.perfil.role).to.be.an('string')
    expect(_body.perfil.email).to.be.an('string')
  })
})
describe('ENDPONT /api/carts', function () {
  let cart
  it('GET del carrito del usuario registrado carrito por id', async function () {
    this.timeout(5000)
    const response = await requester.get('/api/carts/').set('Cookie', [userSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('status')
    expect(_body.status).to.equal('success')
    expect(_body).to.have.property('data')
    expect(_body.data).to.be.an('object')
    expect(_body.data).to.not.be.an('array')
    expect(_body.data.data).to.be.an('object')
    expect(_body.data.data).to.not.be.an('array')
    expect(_body.data.data).to.have.property('_id')
    expect(_body.data.data).to.have.property('products')
    expect(_body.data.data.products).to.be.an('array')
    cart = _body.data.data
  })
  it('POST de un producto al carrito del usuario registrado', async function () {
    this.timeout(5000)
    const response = await requester.post(`/api/carts/${cart._id}/products/64c6e4d759a76447575123aa`).set('Cookie', [userSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('status')
    expect(_body.status).to.equal('success')
    expect(_body).to.have.property('data')
    expect(_body.data).to.be.an('object')
    expect(_body.data).to.not.be.an('array')
    expect(_body.data).to.have.property('products')
    expect(_body.data.products).to.be.an('array')
    expect(_body.data).to.have.property('_id')
  })
  it('DELETE de todos los productos de un carrito', async function () {
    this.timeout(5000)
    const response = await requester.delete(`/api/carts/${cart._id}`).set('Cookie', [userSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('data')
    expect(_body.data).to.have.property('_id')
    expect(_body.status).to.equal('success')
  })
})
describe('ENDPONT /api/products', function () {
  it('GET de todos los productos', async function () {
    this.timeout(5000)
    const response = await requester.get('/api/products').set('Cookie', [adminSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('payload')
    expect(_body).to.have.property('status')
    expect(_body.payload).to.be.an('array')
    expect(_body.status).to.equal('success')
    _body.payload.forEach((elemento) => {
      expect(elemento).to.have.property('_id')
    })
  })
  it('POST de un producto', async function () {
    this.timeout(5000)
    const Mockproduct = {
      title: fakerES.commerce.product(),
      description: fakerES.commerce.productDescription(),
      code: fakerES.database.mongodbObjectId(),
      stock: fakerES.finance.amount(),
      price: fakerES.commerce.price(),
      status: fakerES.datatype.boolean(),
      category: fakerES.commerce.productAdjective()
    }
    const response = await requester.post('/api/products').set('Cookie', [adminSession])
      .field('title', Mockproduct.title)
      .field('description', Mockproduct.description)
      .field('code', Mockproduct.code)
      .field('stock', Mockproduct.stock)
      .field('price', Mockproduct.price)
      .field('category', Mockproduct.category)
      .attach('file', './test/productoImagenPrueba.avif')
    const { status } = response
    expect(status).to.equal(302)
  })
  it('GET de un producto por id', async function () {
    this.timeout(5000)
    const response = await requester.get('/api/products/65079ec808b05611619ef775').set('Cookie', [adminSession])
    const { status, _body } = response
    expect(status).to.equal(200)
    expect(_body).to.have.property('status')
    expect(_body.status).to.equal('success')
    expect(_body).to.have.property('data')
    expect(_body.data).to.be.an('object')
    expect(_body.data).to.not.be.an('array')
    expect(_body.data.data).to.be.an('object')
    expect(_body.data.data).to.not.be.an('array')
    expect(_body.data.data).to.have.property('_id')
  })
})
