// ==============================|| DASHBOARD - BAJAJ AREA CHART ||============================== //

// chart-data.js

const chartData = (products) => {
  return {
    type: 'area',
    height: 95,
    options: {
      chart: {
        id: 'support-chart',
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => 'Top Product ',
          },
        },
        marker: {
          show: false,
        },
      },
    },
    series: [
      {
        data: products.map((product) => product.totalSold),
      },
    ],
  };
};

export default chartData;
