import { createLogger, format, transports } from 'winston';

const { combine, colorize, timestamp, printf, splat, align, errors } = format;

const consoleFormat = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  const logMessage = stack ?? message;
  return `${time} [${level}]: ${logMessage}${metaString}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(errors({ stack: true }), splat(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align()),

  transports: [
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
  ],
});

export default logger;
