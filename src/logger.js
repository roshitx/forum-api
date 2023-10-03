const winston = require('winston');

// Konfigurasi format log
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
);

const formatTimestamp = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

// Konfigurasi transport ke console
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    formatTimestamp,
    winston.format.colorize(),
    logFormat,
  ),
});

// Konfigurasi logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [consoleTransport],
});

module.exports = logger;
