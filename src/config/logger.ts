import winston from 'winston'

const { combine, timestamp, printf, errors, json } = winston.format

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return JSON.stringify({
    level,
    message,
    timestamp,
    stack,
    ...meta
  })
})

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new winston.transports.Console()
  ]
})