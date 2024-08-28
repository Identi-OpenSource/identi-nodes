import './core/config/global_config.js'
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './core/swagger/index.js'
import { router as cryptoWalletRouter } from './routes/index.js'
import config from './core/config/index.js'
import morgan from 'morgan'
import parseErrorMiddleware from './middlewares/parse-error.middleware.js'
import safeJsonParse from './utils/safe_Json_parse.js'

const basePath = '/api/v1'

const app = express()

morgan.token('req-headers-did', function (req, _) {
  return JSON.stringify(req.headers?.did)
})

morgan.token('res-body', function (_, res: any) {
  const response = typeof res.body === 'string' ? safeJsonParse(res.body) : res.body
  // NOTE: User can request auth token, remove it from logs
  delete response?.token
  return JSON.stringify(response)
})

const captureResponseBody = (_: any, res: any, next: any) => {
  const oldSend = res.send
  res.send = function (body: any) {
    res.body = body
    oldSend.apply(res, arguments)
  }
  next()
}

app.use(captureResponseBody)

app.use(
  morgan(
    '[:date[clf]]: :method :url :status :response-time ms HTTP/:http-version :res[content-length] \n":referrer" ":user-agent" \nDID: :req-headers-did \nResponse: :res-body'
  )
)

app.use(express.json())
app.use(cors())

app.use(basePath, cryptoWalletRouter)

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'ok',
    name: 'ms-identi-agent',
    version: config.API_VERSION,
  })
})

if (config.env === 'development') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

app.use(parseErrorMiddleware)

app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
