/* global describe test expect afterAll */

import fs from 'fs';
import Database from '../database';

const STORAGE_PATH = '/tmp/dbtest.json';

describe('Test main database functionalities', () => {
  
  afterAll(() => {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify({'users':[]}, null, 2));
  });

  test('Get a database instance', () => {
    expect(Database.getInstance(STORAGE_PATH)).not.toBe(undefined);
    expect(Database.getInstance(STORAGE_PATH)).not.toBe(null);
  });

  test('Get a database collection', () => {
    const collectionUsers = Database.getInstance(STORAGE_PATH).getCollection('users');
    expect(collectionUsers).not.toBe(undefined);
    expect(collectionUsers).not.toBe(null);
    expect(collectionUsers).toHaveLength(0);
    collectionUsers.push({
      id: 0,
      username: 'oscar granada'
    });
    const collectionUsersCopy = Database.getInstance(STORAGE_PATH).getCollection('users');
    expect(collectionUsersCopy).toHaveLength(1);
  });

  test('Could query specific data according query criterias', () => {
    let result = Database.getInstance(STORAGE_PATH).query('users', {username: 'oscar granada'});
    expect(result).toHaveLength(1);
    result = Database.getInstance(STORAGE_PATH).query('users', {username: 'nicola tesla'});
    expect(result).toHaveLength(0);
  });

  test('Could insert new data into an specific collection', () => {
    const size = Database.getInstance(STORAGE_PATH).getCollection('users').length;
    Database.getInstance(STORAGE_PATH).insert('users', {username: 'julián granada'});
    expect(Database.getInstance(STORAGE_PATH).getCollection('users')).toHaveLength(size + 1);
  });

  test('Could update data into an specific collection', () => {
    const currents = Database.getInstance(STORAGE_PATH).query('users', {id: 0});
    expect(currents).toHaveLength(1);
    expect(currents[0]['username']).toBe('oscar granada');
    Database.getInstance(STORAGE_PATH).update('users', {id: 0}, {username: 'oscar andrés granada'});
    const newValues = Database.getInstance(STORAGE_PATH).query('users', {id: 0});
    expect(newValues).toHaveLength(1);
    expect(newValues[0]['username']).toBe('oscar andrés granada');
  });

});
