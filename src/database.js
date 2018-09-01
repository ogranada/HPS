
global.__db_instance = null;

class Database {

  constructor() {
    this.collections = {};
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

function getInstance() {
  if (!global.__db_instance) {
    global.__db_instance = new Database();
  }
  return global.__db_instance;
}

export default {
  getInstance
};
