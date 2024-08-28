import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Identi',
      version: '1.0.0',
      description:
        'Microservicio que administra las DID y Crypto Wallets utilizando los agentes DID Veramo Agent y Crypto Veramo Agent',
    },
    servers: [
      {
        url: 'http://localhost:3330/api/v1',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/modules/*/routes/*.ts'], // Path to the API routes
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
