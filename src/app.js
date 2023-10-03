require('dotenv').config();

const logger = require('./logger');
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  try {
    logger.info('Starting application!');
    const server = await createServer(container);
    await server.start();
    logger.info(`Server start at ${server.info.uri}`);
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
  }
})();
