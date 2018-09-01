/* global describe test expect beforeAll jest */

import express from 'express';
import WebServer from '../web-server';
import ApiRouter from '../routing';

const request = require('supertest');


describe('Test main web server functionalities', () => {

  test('Express application instance couldn\'t be null', () => {
    expect(WebServer.getApplication()).not.toBe(null);
  });

  test('Start application should throw an exception if server param is empty.', () => {
    expect(WebServer.startServer).toThrowError('Invalid server instance');
  });

  test('Start application should throw an exception if database param is empty.', () => {
    function dummy() {
      WebServer.startServer({});
    }
    expect(dummy).toThrowError('Invalid database instance');
  });

  test('Start application should works.', (done) => {
    const dbMock = {};
    let useCalled = false;
    const appMock = {
      use(url, router) {
        expect(url).toBeTruthy();
        expect(router).toBeTruthy();
        useCalled = true;
      },
      listen(port) {
        expect(port).toBeTruthy();
        if (useCalled)
          done();
      }
    };
    WebServer.startServer(appMock, dbMock);
  });

});

describe('Test API functionalities', () => {

  let app = null;

  beforeAll(() => {
    app = WebServer.getApplication();
    if (app.use) {
      app.use('/api/', ApiRouter);
    }
  });

  test('It should response the GET method with url /api/status', () => {
    return request(app).get('/api/status').then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  test('It should response the GET method with url /api/satabase with text/html accept.', () => {
    return request(app)
      .get('/api/database')
      .set('Accept', 'text/html')
      .then(response => {
        expect(response.statusCode).toBe(200);
      })
    ;
  });

});
