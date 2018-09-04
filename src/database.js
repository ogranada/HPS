
import fs from 'fs';
import { getLogger } from './logger';

global.__db_instance = null;
const logger = getLogger();

class Database {

  constructor(storage_path) {
    this.storage_path = storage_path;
    this.collections = {};
    process.once('SIGINT', this.save);
    if (this.storage_path) {
      logger.log(`Using ${this.storage_path} to store information.`);
      this.load();
    }
  }
  
  save() {
    /* istanbul ignore else */
    if (this.storage_path) {
      fs.writeFileSync(this.storage_path, JSON.stringify(this.collections, null, 2));
    }
  }

  load() {
    /* istanbul ignore else */
    if (fs.existsSync(this.storage_path)) {
      const data_loaded = fs.readFileSync(this.storage_path).toString();
      this.collections = JSON.parse(data_loaded);
      logger.log('Collections loaded:');
      Object.keys(this.collections).forEach((c) => {
        logger.log(`   · ${c}`);
      });
    }
  }

  getCollection(collectionName) {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }
    return this.collections[collectionName];
  }

  validElement(filter) {
    return (element) => {
      for (let key in filter) {
        if (!(element[key] === filter[key])) {
          return false;
        }
      }
      return true;
    };
  }

  query(collectionName, filter) {
    return this.getCollection(collectionName)
      .filter(this.validElement(filter))
      .map(element => Object.assign({}, element)) // to avoid modify original information
      ;
  }

  insert(collectionName, newData) {
    this.getCollection(collectionName).push(newData);
    this.save();
    return this;
  }

  update(collectionName, filter, newData) {
    this.getCollection(collectionName)
      .filter(this.validElement(filter))
      .map(element => Object.assign(element, newData))
      .map(element => Object.assign({}, element)) // to avoid modify original information
      ;
  }

}

function getInstance(storage_path) {
  if (!global.__db_instance) {
    global.__db_instance = new Database(storage_path);
  }
  return global.__db_instance;
}

export default {
  getInstance
};
