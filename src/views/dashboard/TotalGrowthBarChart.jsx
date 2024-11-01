import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getRevenueByProduct } from 'api/dashboard';
import chartData from './chart-data/total-growth-bar-chart';

const statusOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

const offsetOptionsDay = [
  { value: 0, label: 'Today' },

];

const offsetOptionsWeek = [
  { value: 0, label: 'Week Present' },
  { value: 1, label: '1 Week Ago' },
  { value: 2, label: '2 Weeks Ago' },
  { value: 3, label: '3 Weeks Ago' },
  { value: 4, label: '4 Weeks Ago' }
];

const offsetOptionsMonth = [
  { value: 0, label: 'Month Present' },
  { value: 1, label: '1 Month Ago' },
  { value: 2, label: '2 Months Ago' },
  { value: 3, label: '3 Months Ago' },
  { value: 6, label: '6 Months Ago' }
];

const offsetOptionsYear = [
  { value: 0, label: 'Year Present' },
  { value: 1, label: '1 Year Ago' },
  { value: 2, label: '2 Years Ago' },
  { value: 3, label: '3 Years Ago' }
];

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = useState('week');
  const [offset, setOffset] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartSeries, setChartSeries] = useState(chartData.series);
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];
  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  const getPeriodParams = () => {
    let period = value;
    return { period, offset, status: 'completed' };
  };

  const getOffsetOptions = () => {
    if (value === 'week') {
      return offsetOptionsWeek;
    }
    if (value === 'month') {
      return offsetOptionsMonth
    };
    if (value === 'year') {
      return offsetOptionsYear
    };
    if (value === 'day') {
      return offsetOptionsDay
    };
    return [];
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const params = getPeriodParams();
        const response = await getRevenueByProduct({ ...params, sort: 'asc' });
        const products = response.data;

        const categories = products.map((product) => product.productName);
        const salesData = products.map((product) => product.totalSales);
        const revenueData = products.map((product) => product.totalRevenue);
        const totalRevenueSum = revenueData.reduce((sum, revenue) => sum + revenue, 0);

        const updatedChartData = {
          ...chartData,
          options: {
            ...chartData.options,
            xaxis: { ...chartData.options.xaxis, categories }
          },
          series: [
            {
              name: 'Total Sales',
              data: salesData
            }
          ]
        };

        setChartSeries(updatedChartData.series);
        setTotalRevenue(totalRevenueSum);
        ApexCharts.exec('bar-chart', 'updateOptions', updatedChartData.options);
      } catch (error) {
        console.error('Error fetching revenue by product:', error);
      }
    };

    fetchChartData();
  }, [value, offset]);

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: Array(12).fill(primary)
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, divider, isLoading, grey500]);

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
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Price</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{totalRevenue}</Typography>
                    </Grid>
                  </Grid>
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
                    disabled={value === 'day'}
                    sx={{ marginLeft: 2 }}
                  >
                    {getOffsetOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Chart {...chartData} series={chartSeries} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;