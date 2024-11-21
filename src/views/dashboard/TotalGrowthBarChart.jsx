import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getRevenueByProduct } from 'api/dashboard';

const statusOptions = [
  // { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

const getOffsetOptions = (period) => {
  switch (period) {
    // case 'day':
    //   return [
    //     { value: 0, label: 'Today' },
    //     { value: 1, label: '1 Day Ago' },
    //     { value: 2, label: '2 Days Ago' },
    //     { value: 3, label: '3 Days Ago' }
    //   ];
    case 'week':
      return [
        { value: 0, label: 'This Week' },
        { value: 1, label: '1 Week Ago' },
        { value: 2, label: '2 Weeks Ago' },
        { value: 3, label: '3 Weeks Ago' }
      ];
    case 'month':
      return [
        { value: 0, label: 'This Month' },
        { value: 1, label: '1 Month Ago' },
        { value: 2, label: '2 Months Ago' },
        { value: 3, label: '3 Months Ago' }
      ];
    case 'year':
    default:
      return [
        { value: 0, label: 'This Year' },
        { value: 1, label: '1 Year Ago' },
        { value: 2, label: '2 Years Ago' },
        { value: 3, label: '3 Years Ago' }
      ];
  }
};

const TotalGrowthLineChart = ({ isLoading }) => {
  const [value, setValue] = useState('year');
  const [offset, setOffset] = useState(0);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { id: 'line-chart', type: 'line', toolbar: { show: true } },
      xaxis: {
        categories: [],
        labels: { style: { colors: '#6b7280' } }
      },
      yaxis: { labels: { style: { colors: '#6b7280' } } },
      tooltip: { theme: 'light' },
      stroke: { curve: 'smooth' }
    }
  });

  const fetchChartData = async () => {
    try {
      const params = { period: value, offset, status: 'completed' };
      const response = await getRevenueByProduct(params);
      const data = response.data || [];
      const categories = data.map((item) => item._id);
      const revenueData = data.map((item) => item.dailyRevenue);
      const salesData = data.map((item) => item.dailySales);

      setChartData((prevState) => ({
        ...prevState,
        series: [
          { name: 'Revenue', data: revenueData },
          { name: 'Sales', data: salesData }
        ],
        options: { ...prevState.options, xaxis: { ...prevState.options.xaxis, categories } }
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchChartData();
    }
  }, [value, offset, isLoading]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle2">Total Revenue & Sales</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    id="select-period"
                    select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="select-offset"
                    select
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                    sx={{ marginLeft: 2 }}
                  >
                    {getOffsetOptions(value).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart options={chartData.options} series={chartData.series} type="line" />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthLineChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthLineChart;
