import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, CircularProgress, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { getRegistrationStats } from 'api/dashboard'; // Cập nhật API của bạn ở đây
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

const TotalRegistration = ({ period = 'week' }) => {
  const [stats, setStats] = useState([]); // Đảm bảo stats là một mảng
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period); // Trạng thái cho period
  const [availablePeriods] = useState(['week', 'month']); // Các lựa chọn period

  // Hàm xử lý thay đổi lựa chọn period
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegistrationStats(selectedPeriod); // Gọi API với tham số period
        if (response && Array.isArray(response.data)) {
          setStats(response.data); // Cập nhật dữ liệu từ API
        } else {
          setStats([]); // Nếu không có dữ liệu hợp lệ, set stats là mảng rỗng
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats([]); // Nếu có lỗi khi gọi API, set stats là mảng rỗng
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]); // Chạy lại khi selectedPeriod thay đổi

  // Chuẩn bị dữ liệu cho Chart
  const chartData = {
    labels: stats && stats.length > 0 ? stats.map(stat => stat.day || stat._id) : [], // Tạo nhãn theo thời gian (ngày, tuần, tháng, năm)
    datasets: [
      {
        label: 'Số người dùng đăng ký',
        data: stats && stats.length > 0 ? stats.map(stat => stat.count) : [], // Số lượng người đăng ký
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
        text: 'Thống kê người dùng đăng ký',
        color: '#333',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const stat = stats[tooltipItem.dataIndex];
            return `Thời gian: ${stat.day || stat._id} - Đăng ký: ${stat.count}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: true, // Hiển thị tên thời gian (ngày, tuần, tháng, năm)
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
    <Grid container spacing={0}>
      <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ marginTop: 3 }}>
        {/* Dropdown để chọn period ở góc phải */}
        <FormControl fullWidth sx={{ maxWidth: 200 }}>
          <InputLabel id="period-select-label">Chọn khoảng thời gian</InputLabel>
          <Select
            labelId="period-select-label"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            label="Chọn khoảng thời gian"
          >
            {availablePeriods.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)} {/* Hiển thị chữ cái đầu in hoa */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {loading ? (
        
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid item xs={12}>
          {stats.length === 0 ? (
            <Typography variant="h6" align="center">
              Không có dữ liệu thống kê.
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

TotalRegistration.propTypes = {
  period: PropTypes.string, // Cho phép chọn period: 'week', 'month'
};

export default TotalRegistration;
