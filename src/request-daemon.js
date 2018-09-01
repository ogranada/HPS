
import axios from 'axios';
import {parseString} from 'xml2js';
import {getLogger} from './logger';

const logger = getLogger();

function getParserByName(name) {
  return (data) => new Promise((resolve, reject) => {
    if ((typeof data) === 'object') {
      return resolve(data);
    }
    if (name.toLowerCase() === 'xml') {
      parseString(data, function (err, result) {
        err && reject(err);
        return resolve(result);
      });
    } else {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    }
  });
}

function ProcessorPromise(source) {
  const parse = getParserByName(source.parser);
  return new Promise((resolve, reject) => {
    axios.get(source.url)
      .then((answer) => {
        const result = answer.data;
        return parse(result);
      })
      .then((result) => {
        if(source.parseStatus) {
          resolve(source.parseStatus(result));
        } else {
          resolve(result);
        }
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

function startDataAcquisition(dataSources, databaseInstance) {
  const dataAcquisition = () => {
    const promises = dataSources
      .map(source => ProcessorPromise(source))
      ;
    Promise.all(promises)
      .then(responses => {
        responses.forEach(response => {
          response.date = (new Date()).toISOString();
          databaseInstance.insert('status', response);
        });
      });
  };
  dataAcquisition();
  setInterval(dataAcquisition, 60 * 1000);
}

export default {
  startDataAcquisition
};
