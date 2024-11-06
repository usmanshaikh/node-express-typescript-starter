import winston from 'winston';
import config from './config';
import DailyRotateFile from 'winston-daily-rotate-file';

const fileLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: fileLogFormat,
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: fileLogFormat,
    }),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileLogFormat,
    }),
  ],
});

if (config.env === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`),
      ),
    }),
  );
} else if (config.env === 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  );
}

export default logger;
