import { DateTime } from 'luxon';
import { createLogger, transports } from 'winston';
import { format } from 'logform';

const sessionTimestamp: string = DateTime.now().toISO();

const logger = createLogger({
  exitOnError: false,
  format: format.combine(
    format.printf((info) => `${String(info.timestamp)} ${String(info.level)}: ${String(info.message)}`),
    format.simple(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
      ),
    }),
    new transports.File({
      filename: `logs/${sessionTimestamp}/combined.log`,
    }),
    new transports.File({
      filename: `logs/${sessionTimestamp}/errors.log`,
      level: 'error',
    }),
  ],
});

export default logger;
