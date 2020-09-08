import winston from 'winston';
import logform from 'logform';

const {
  colorize, combine, printf, simple, timestamp,
} = logform.format;

const logger = winston.createLogger({
  exitOnError: false,
  format: combine(
    printf((info: logform.TransformableInfo) => `${String(info.timestamp)} ${String(info.level)}: ${String(info.message)}`),
    simple(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true })),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
