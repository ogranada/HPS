
import {resolve} from 'path';
import WebServer from './web-server';
import Database from './database';
import RequestDaemon from './request-daemon';

/* istanbul ignore next */
function main() {
  process.title = 'hps-app';
  const fileTarget = process.env['DB_FILE'] || resolve('.ads_services.json');
  const databaseInstance = Database.getInstance(fileTarget);

  RequestDaemon.startDataAcquisition([
    {
      url:'https://bim360dm-dev.autodesk.com/health?self=true',
      parser: 'json',
      parseStatus(response) {
        if(response.status && response.status.workers) {
          delete response.status.workers;
        }
        return {
          status: response.status.overall === 'GOOD'?'OK':'FAIL',
          response
        };
      }
    },
    {
      url:'https://commands.bim360dm-dev.autodesk.com/health',
      parser: 'json',
      parseStatus(response) {
        return {
          status: response.status.overall === 'OK'?'OK':'FAIL',
          response
        };
      }
    },
    {
      url:'https://360-staging.autodesk.com/health',
      parser: 'xml',
      parseStatus(response) {
        response = response['HealthCheck'];
        delete response['$'];
        return {
          status: response.status[0]==='Good'?'OK':'FAIL',
          response
        };
      }
    },
  ], databaseInstance);

  WebServer.startServer(WebServer.getApplication(), databaseInstance, 5000);
}

/* istanbul ignore next */
main();
