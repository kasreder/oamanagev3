import { createLogger, format, transports } from 'winston';

const { combine, colorize, timestamp, printf, splat } = format;

const logFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}] ${message}${metaString}`;
});

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(splat(), timestamp(), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],
});

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
