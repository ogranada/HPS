/* global describe test expect */

import RequestDaemon from '../request-daemon';

describe('Test request-daemon module', () => {
  /*
  test('', () => {
    expect(4).toBe(4);
  });
  */

  test('Create promise using axios request', async () => {
    const data = await RequestDaemon.ProcessorPromise({
      url: 'https://commands.bim360dm-dev.autodesk.com/health',
      parser: 'json'
    });
    expect(data['date']).not.toBeFalsy();
  });

  test('Create promise using axios request and preprocessing using custom parse status', async () => {
    const data = await RequestDaemon.ProcessorPromise({
      url: 'https://commands.bim360dm-dev.autodesk.com/health',
      parser: 'json',
      parseStatus(data) {
        return {
          check: 101,
          carry: data
        };
      }
    });
    expect(data['carry']['build']).not.toBeFalsy();
    expect(data['check']).toBe(101);
  });

  test('Create promise using axios request and catch an exception', async () => {
    const data = await RequestDaemon.ProcessorPromise({
      url: 'https://commands.bim360dm-dev.autodesk.com/health',
      parser: 'json',
      parseStatus() {
        throw new Error('sample error');
      }
    });
    expect(data).toEqual({
      error: 'sample error',
      status: 'FAIL'
    });
  });

  test('Check Data acquisition', (done) => {
    const intervalId = RequestDaemon.startDataAcquisition([
      {
        url: 'https://commands.bim360dm-dev.autodesk.com/health',
        parser: 'json'
      }
    ], {
      insert(table, data){
        expect(table).toBe('status');
        expect(data['date']).toBeTruthy();
        clearInterval(intervalId);
        done();
      }
    }, 1);
  });

});
