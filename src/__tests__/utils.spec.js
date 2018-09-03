/* global describe test expect */

import utils from '../utils';

describe('Test utils module', () => {

  test('Utils.isMoreRecentThan should return all values more recent than limit.', () => {
    const limit = new Date('2018-09-02T21:34:01.368Z');
    const data = [
      {
        date: '2018-09-02T21:31:01.368Z'
      },
      {
        date: '2018-09-02T21:32:01.368Z'
      },
      {
        date: '2018-09-02T21:33:01.368Z'
      },
      {
        date: '2018-09-02T21:34:01.368Z'
      },
      {
        date: '2018-09-02T21:34:01.368Z'
      },
      {
        date: '2018-09-02T21:36:01.368Z'
      },
      {
        date: '2018-09-02T21:37:01.368Z'
      }
    ];
    const total = data
      .filter(utils.isMoreRecentThan(limit))
      .reduce((a) => a + 1, 0)
      ;
    expect(total).toBe(4);
  });

  test('Utils.groupBy should return an object with values grouped by a defined criteria', () => {
    const data = [
      { criteria: '1', status: 'OK' },
      { criteria: '2', status: 'OK' },
      { criteria: '3', status: 'OK' },
      { criteria: '1', status: 'OK' },
      { criteria: '2', status: 'OK' },
      { criteria: '3', status: 'FAIL' },
      { criteria: '1', status: 'OK' },
      { criteria: '2', status: 'FAIL' },
      { criteria: '3', status: 'FAIL' }
    ];
    const ans = data.reduce(utils.groupBy('criteria'), {});
    expect(ans['1'].count).toBe(3);
    expect(ans['2'].count).toBe(3);
    expect(ans['3'].count).toBe(3);
    expect(ans['1'].availabilityPercentage).toBe(100);
    expect(parseInt(ans['2'].availabilityPercentage)).toBe(66);
    expect(parseInt(ans['3'].availabilityPercentage)).toBe(33);
  });

  test('Get parser acording passed parameter', () => {
    expect(utils.getParserByName('xml')).not.toBeFalsy();
    expect(utils.getParserByName('json')).not.toBeFalsy();
  });

  test('Get parser acording passed parameter and should parse data of json type.', (done) => {
    const parser = utils.getParserByName('json');
    const sample = { a: 1, b: 2 };
    const sampleString = JSON.stringify(sample);
    parser(sampleString).then((result) => {
      expect(result).toEqual(sample);
      done();
    });
  });

  test('Get parser acording passed parameter and should parse data of XML type.', (done) => {
    const parser = utils.getParserByName('xml');
    const sampleString = `<sample>
    <item1>1</item1>
    <item2>Hello</item2>
    </sample>`;
    parser(sampleString).then((result) => {
      expect(result).toEqual({sample: {item1: ['1'], item2: ['Hello']}});
      done();
    });
  });

  test('Get parser acording passed parameter but avoid if is a JS Object.', (done) => {
    const parser = utils.getParserByName('xml');
    const data = {a:1};
    parser(data).then((result) => {
      expect(result).toEqual(data);
      done();
    });
  });

  test('Get parser for xml but throw an error if parse process fail.', async (done) => {
    const parser = utils.getParserByName('xml');
    try {
      let d = await parser('Hello World :D');
      expect(d).toBe(1);
    } catch (error) {
      done();
    }
  });

  test('Get parser for json but throw an error if parse process fail.', async (done) => {
    const parser = utils.getParserByName('json');
    try {
      let d = await parser('Hello World :D');
      expect(d).toBe(1);
    } catch (error) {
      done();
    }
  });

});
