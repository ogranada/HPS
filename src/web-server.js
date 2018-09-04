
import express from 'express';
import nunjucks from 'nunjucks';
import {getLogger} from './logger';
import {ApiRouter, RootRouter} from './routing';

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

  appInstance.use(express.static('public'));
  appInstance.use('/', RootRouter);
  appInstance.use('/api', ApiRouter);

  nunjucks.configure('views', {
    autoescape: true,
    express: appInstance,
    watch: true
  });

  appInstance.listen(port);
  logger.log(`Server Started at ${port}`);
}

export default {
  startServer,
  getApplication
};
