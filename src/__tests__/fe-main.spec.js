/* global describe test expect */

import main from '../public/scripts/main';

describe('Test request-daemon module', () => {
  /*
  test('', () => {
    expect(4).toBe(4);
  });
  */

  test('Test a chart creation', (done) => {
    global.Chart = function(context, data){
      expect(context.id).toBe('im the context');
      expect(data.type).toEqual('pie');
      expect(data.data.labels).toContain('lbl0');
      done();
    };
    const doc = {
      getElementById:() => ({
        getContext: () => ({id:'im the context'})
      })
    };
    main.createChart(doc, 0, [{
      label: 'lbl0',
      backgroundColor: 'red',
      value: 1
    }]);
  });

  test('Test chart information construction', () => {
    const values = {
      'http://demo.autodesk.com': {

      }
    };
    const chartsContainer = {
      innerHTML: ''
    };
    const callable = main.prepareChartInfo(values, chartsContainer);
    callable(Object.keys(values)[0], 0);
    expect(chartsContainer.innerHTML).toContain('<h2>demo</h2>');
    expect(chartsContainer.innerHTML).toContain('id="cnt-0" ');
    expect(chartsContainer.innerHTML).toContain('id="chart-0" ');
  });
  
});
