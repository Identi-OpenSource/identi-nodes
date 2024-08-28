import express from 'express'
import { agent } from './setup-local.js'
import { AgentRouter, RequestWithAgentRouter, apiKeyAuth } from '@veramo/remote-server'
import swaggerUi from 'swagger-ui-express'
// @ts-ignore
import swaggerDocument from '../docs/swagger/open-api.json' assert { type: 'json' }
import cors from 'cors'
import config from './core/config/index.js'

//...agent.availableMethods(),
const exposedMethods = ['keyManagerCreate', 'transferTokens', 'balance']

const basePath = '/agent'
const schemaPath = '/open-api.json'
const apiDocsPath = '/api-docs'
var options = {
  customSiteTitle: 'Crypto Agent',
  swaggerOptions: {
    // url: 'http://localhost:3332/open-api.json',
  },
}

const agentRouter = AgentRouter({
  exposedMethods,
})

const app = express()
app.use(cors())

app.use(RequestWithAgentRouter({ agent }))
if (config.ENV === 'development') {
  // @ts-ignore
  app.use(apiDocsPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
}

app.use(schemaPath, (req, res) => {
  res.json(swaggerDocument)
})

app.use(apiKeyAuth({ apiKey: config.AGENT_API_KEY }))
app.use(basePath, agentRouter)

app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`))
