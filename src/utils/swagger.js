import { __dirname } from './__dirname.js'
export const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion Pizzas',
      description: 'Este proyecto no es de pizzas, es de carritos y productos'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}
