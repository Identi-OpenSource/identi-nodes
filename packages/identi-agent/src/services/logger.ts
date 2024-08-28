import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // Include stack trace
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'ms-identi-veramo-agent' },
})

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.printf((info) => {
        const stack = info.stack ? `\n${info.stack}` : ''
        delete info.stack
        let message = JSON.stringify(info)
        if (stack && process.env.NODE_ENV !== 'production') {
          message += stack
        }
        return message
      })
    ),
  })
)

export default logger
