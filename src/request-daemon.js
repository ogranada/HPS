
import axios from 'axios';
import {getLogger} from './logger';
import utils from './utils';

const logger = getLogger();

function ProcessorPromise(source) {
  const parse = utils.getParserByName(source.parser);
  return new Promise((resolve /*,reject */) => {
    axios.get(source.url)
      .then((answer) => {
        const result = answer.data;
        return parse(result);
      })
      .then((partial_result) => {
        let result;
        if(source.parseStatus) {
          result = source.parseStatus(partial_result);
        } else {
          result = partial_result;
        }
        return Promise.resolve(result);
      })
      .then((result) => {
        result.source = source.url;
        result.date = (new Date()).toISOString();
        resolve(result);
      })
      .catch(error => {
        resolve({
          status: 'FAIL',
          error: error.message
        });
      })
    ;
  });
}

function startDataAcquisition(dataSources, databaseInstance, seconds) {
  /* istanbul ignore next */
  if(!seconds){
    seconds = 60;
  }
  const dataAcquisition = () => {
    const promises = dataSources
      .map(source => ProcessorPromise(source))
    ;
    Promise.all(promises)
      .then(responses => {
        responses.forEach(response => {
          databaseInstance.insert('status', response);
        });
        logger.log('Data added...');
      });
  };
  // dataAcquisition();
  return setInterval(dataAcquisition, seconds * 1000);
}

export default {
  ProcessorPromise,
  startDataAcquisition
};
