/* global Chart axios */

function createChart(document, index, chartInfo) {
  const context = document.getElementById(`chart-${index}`).getContext('2d');
  const labels = chartInfo.map(x => x.label);
  const backgroundColor = chartInfo.map(x => x.backgroundColor);
  const data = chartInfo.map(x => x.value);
  return new Chart(context, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        backgroundColor,
        data,
      }]
    },
    options: {}
  });
}

async function getInfoFromAPI() {
  return await axios.get('/api/status');
}

const prepareChart = (id, title) => `<div style="text-align:center;margin-top:2.5em;">
<h2>${title}</h2>
<div id="cnt-${id}" style="width:300px;height:300px;margin-left:50%;transform:translateX(-50%);">
<canvas id="chart-${id}" width="100" height="100"></canvas>
</div>
</div>`;

const prepareChartInfo = (values, chartsContainer) => (key, index) => {
  const title = `${key.split('://')[1].split('.autodesk.com')[0]}`;
  const chartHTML = prepareChart(index, title);
  chartsContainer.innerHTML += chartHTML;
  const av = values[key].availabilityPercentage;
  const unav = 100 - values[key].availabilityPercentage;
  const chartInfo = [
    {
      label: `Available (${av}%)`,
      backgroundColor: '#57c777',
      value: av
    },
    {
      label: `Unavailable (${unav}%)`,
      backgroundColor: 'tomato',
      value: unav
    }
  ];
  return {chartInfo, index};
};

async function main() {
  const response = await getInfoFromAPI();
  const values = response.data.data;
  const chartsContainer = document.querySelector('.chartsContainer');
  chartsContainer.innerHTML = '';
  Object.keys(values)
    .map(prepareChartInfo(values, chartsContainer))
    .map(info => createChart(document, info.index, info.chartInfo))
  ;
}

main();

export default {
  prepareChartInfo,
  createChart
};
