import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, CircularProgress, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { getLowStock } from 'api/dashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LowStockChart = ({ threshold = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLowStock();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chuẩn bị dữ liệu cho Chart
  const chartData = {
    labels: products.map(() => ''), // Không hiển thị tên sản phẩm
    datasets: [
      {
        label: 'Tổng số lượng tồn kho',
        data: products.map((product) =>
          product.lowStockSizes.reduce((total, size) => total + size.quantity, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 10, // Bo góc cột
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ẩn chú thích
      },
      title: {
        display: true,
        text: 'Sản phẩm sắp hết hàng',
        color: '#333',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const product = products[tooltipItem.dataIndex];
            const sizeDetails = product.lowStockSizes
              .map((size) => ` Size ${size.sizeName}: ${size.quantity}`)
              .join(', ');
            return `${product.name} - Chi tiết: ${sizeDetails}`;
          },
        },
        
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Ẩn tên sản phẩm dưới biểu đồ
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false, // Ẩn đường viền của lưới
        },
        ticks: {
          beginAtZero: true,
          color: '#333',
        },
      },
    },
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        
      </Grid>
      {loading ? (
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid item xs={12}>
          {products.length === 0 ? (
            <Typography variant="h6" align="center">
              Không có sản phẩm nào sắp hết hàng.
            </Typography>
          ) : (
            <Box
              sx={{
                backgroundColor: 'white', // Nền trắng
                padding: 2,
                borderRadius: 4, // Bo góc toàn bộ biểu đồ
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
              }}
            >
              <Bar data={chartData} options={chartOptions} />
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

LowStockChart.propTypes = {
  threshold: PropTypes.number,
};

export default LowStockChart;
