
import {parseString} from 'xml2js';

const isMoreRecentThan = (limit) => (element) => {
  const date = new Date(element.date);
  return date >= limit;
};

const groupBy = (criteria) => (acc, element) => {
  if(!acc[element[criteria]]) {
    acc[element[criteria]] = {
      values: [],
      count: 0,
      working: 0,
      availabilityPercentage: 0
    };
  }
  acc[element[criteria]].count++;
  acc[element[criteria]].working += (element.status === 'OK'? 1 : 0);
  acc[element[criteria]].values.push(element);
  acc[element[criteria]].availabilityPercentage =
    acc[element[criteria]].working * 100 / acc[element[criteria]].count;
  return acc;
};

const getParserByName = (name) => {
  return (data) => new Promise((resolve, reject) => {
    /* istanbul ignore else */
    if ((typeof data) === 'object') {
      return resolve(data);
    }
    if (name.toLowerCase() === 'xml') {
      parseString(data, function (err, result) {
        /* istanbul ignore else */
        if(err) {
          return reject(err);
        }
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
};

export default {
  isMoreRecentThan,
  groupBy,
  groupBySource: groupBy('source'),
  getParserByName
};
