
import express from 'express';
import {getLogger} from './logger';
import ApiRouter from './routing';

global.info = {};
const logger = getLogger();

function getApplication() {
  /* istanbul ignore else */
  if (!global.info.app) {
    global.info.app = express();
  }
  return global.info.app;
}

function startServer(appInstance, databaseInstance, port = 5000) {
  /* istanbul ignore else */
  if (!appInstance) {
    throw new Error('Invalid server instance');
  }
  /* istanbul ignore else */
  if (!databaseInstance) {
    throw new Error('Invalid database instance');
  }
  global.info.database = databaseInstance;

  appInstance.use('/api', ApiRouter);
  appInstance.listen(port);
  logger.log('Server Started');
}

export default {
  startServer,
  getApplication
};
