/* global describe test expect */

import Database from '../database';


describe('Test main database functionalities', () => {
    
  test('Get a database instance', () => {
    expect(Database.getInstance()).not.toBe(undefined);
    expect(Database.getInstance()).not.toBe(null);
  });

  test('Get a database collection', () => {
    const collectionUsers = Database.getInstance().getCollection('users');
    expect(collectionUsers).not.toBe(undefined);
    expect(collectionUsers).not.toBe(null);
    expect(collectionUsers).toHaveLength(0);
    collectionUsers.push({
      id: 0,
      username: 'oscar granada'
    });
    const collectionUsersCopy = Database.getInstance().getCollection('users');
    expect(collectionUsersCopy).toHaveLength(1);
  });

  test('Could query specific data according query criterias', () => {
    let result = Database.getInstance().query('users', {username: 'oscar granada'});
    expect(result).toHaveLength(1);
    result = Database.getInstance().query('users', {username: 'nicola tesla'});
    expect(result).toHaveLength(0);
  });

  test('Could insert new data into an specific collection', () => {
    const size = Database.getInstance().getCollection('users').length;
    Database.getInstance().insert('users', {username: 'julián granada'});
    expect(Database.getInstance().getCollection('users')).toHaveLength(size + 1);
  });

  test('Could update data into an specific collection', () => {
    const currents = Database.getInstance().query('users', {id: 0});
    expect(currents).toHaveLength(1);
    expect(currents[0]['username']).toBe('oscar granada');
    Database.getInstance().update('users', {id: 0}, {username: 'oscar andrés granada'});
    const newValues = Database.getInstance().query('users', {id: 0});
    expect(newValues).toHaveLength(1);
    expect(newValues[0]['username']).toBe('oscar andrés granada');
  });

});
