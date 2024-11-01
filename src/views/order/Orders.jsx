import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Pagination
} from '@mui/material';
import AxiosInstance from 'helper/AxiosInstance';
import { formatDate } from 'utils/date';

const OrderManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filterStatus, setFilterStatus] = useState('all');

  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderRenturn, setOrderRenturn] = useState([]);
  const [orderComplete, setOrderComplete] = useState([]);
  const [orderCancel, setOrderCancel] = useState([]);
  const [data, setData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance().get('/orders/get-all-orders');
        if (response.status) {
          setData(response.data);
          // Initial filter
          setFilteredOrders(response.data);
          updateOrderCounts(response.data);
        }
      } catch (error) {
        console.log('error get data order: ', error);
      }
    };

    const updateOrderCounts = (orders) => {
      setPendingOrders(orders.filter((item) => item.status === 'pending'));
      setOrderRenturn(orders.filter((item) => item.returnRequest && item.returnRequest.status === 'pending'));
      setOrderCancel(orders.filter((item) => item.status === 'cancelled'));
      setOrderComplete(orders.filter((item) => item.status === 'completed'));
    };

    fetchData();
  }, []);

  console.log('data orders =>>>>', data);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(data);
    } else {
      setFilteredOrders(data.filter((order) => order.status === filterStatus));
    }
  }, [filterStatus, data]);

  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const itemsPerPageOrder = 10;
  const paginatedOrder = filteredOrders.slice((currentOrderPage - 1) * itemsPerPageOrder, currentOrderPage * itemsPerPageOrder);

  const handlePageOrderChange = (_, value) => {
    setCurrentOrderPage(value);
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (status, orderId) => {
    if (status === 'processing') {
      try {
        const response = await AxiosInstance().put(`/orders/confirm-order/${orderId}`, { status: 'processing' });
        if (response.status) {
          const updatedOrders = pendingOrders.filter((order) => order._id !== selectedOrder._id);
          setPendingOrders(updatedOrders);
          handleCloseDialog();
          setSnackbarMessage('Đơn hàng đã được xác nhận!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.log('Xac nhan don failed');
        setSnackbarMessage('Lỗi server!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else if (status === 'cancelled') {
      try {
        const response = await AxiosInstance().put(`/orders/confirm-order/${orderId}`, { status: 'cancelled' });
        if (response.status) {
          const updatedOrders = pendingOrders.filter((order) => order._id !== selectedOrder._id);
          setPendingOrders(updatedOrders);
          setOrderCancel((prev) => [...prev, selectedOrder]);
          handleCloseDialog();
          setSnackbarMessage('Đơn hàng đã bị hủy!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.log('Huy don failed');
        setSnackbarMessage('Lỗi server!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleConfirmReturn = async (orderId) => {
    try {
      const response = await AxiosInstance().put(`/orders/return-request/${orderId}`, { status: 'accepted' });
      if (response.status) {
        handleCloseDialog();
        setSnackbarMessage('Xác nhận hoàn hàng!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log('Huy don failed');
      handleCloseDialog();
      setSnackbarMessage('Lỗi server!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeclineReturn = async (orderId) => {
    try {
      const response = await AxiosInstance().put(`/orders/return-request/${orderId}`, { status: 'rejected' });
      if (response.status) {
        handleCloseDialog();
        setSnackbarMessage('Từ chối yêu cầu hoàn hàng!');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }
    } catch (error) {
      handleCloseDialog();
      console.log('Huy don failed');
      setSnackbarMessage('Lỗi server!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
    const filtered = value === 'all' ? data : data.filter((order) => order.status === value);
    setFilteredOrders(filtered);
  };

  console.log('selectedOrder==>', selectedOrder);

  return (
    <MainCard title="QUẢN LÝ ĐƠN HÀNG">
      <div>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đã Hoàn Thành</Typography>
              <Typography variant="h4">{orderComplete.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đã Hủy</Typography>
              <Typography variant="h4">{orderCancel.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đang Xử Lý</Typography>
              <Typography variant="h4">{pendingOrders.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Yêu Cầu Hoàn hàng</Typography>
              <Typography variant="h4">{orderRenturn.length}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <Grid item xs={24} md={4} style={{ marginBlock: 20 }}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Trạng Thái</InputLabel>
              <Select labelId="filter-label" value={filterStatus} onChange={handleFilterChange}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Đang chờ xác nhận</MenuItem>
                <MenuItem value="processing">Đang chuẩn bị đơn hàng</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
                <MenuItem value="refunded">Hoàn hàng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </FormControl>
      </div>

      {/* TẤT CẢ ĐƠN HÀNG */}
      <TableContainer component={Paper}>
        {/* <Typography variant="h2" align="center" sx={{ padding: 2 }}>
          QUẢN LÝ ĐƠN HÀNG
        </Typography> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Đơn Hàng</TableCell>
              <TableCell>Tên Khách Hàng</TableCell>
              <TableCell>Tổng Giá Trị</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ngày Đặt Hàng</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrder.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id && order._id.slice(0, 5) && order._id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell>{order.receiver}</TableCell>
                <TableCell>{order.total_price && order.total_price.toLocaleString('vi-VN')} VND</TableCell>
                <TableCell>
                  {order.status === 'pending'
                    ? 'Đang chờ xử lý'
                    : order.status === 'processing'
                      ? 'Đang chuẩn bị đơn hàng'
                      : order.status === 'completed'
                        ? 'Đã hoàn thành'
                        : order.status === 'cancelled'
                          ? 'Đã hủy'
                          : 'Hoàn hàng'}
                </TableCell>
                <TableCell>{order.timestamps && order.timestamps.placedAt && formatDate(order.timestamps.placedAt)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(order)}>Xem Chi Tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredOrders.length / itemsPerPageOrder)}
          page={currentOrderPage}
          onChange={handlePageOrderChange}
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </TableContainer>

      {/* Dialog cho Chi Tiết Đơn Hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Mã Đơn Hàng"
                  fullWidth
                  value={selectedOrder._id && selectedOrder._id.slice(0, 5) && selectedOrder._id.slice(0, 8).toUpperCase()}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedOrder.receiver} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tổng Giá Trị"
                  fullWidth
                  value={`${selectedOrder.total_price && selectedOrder.total_price.toLocaleString('vi-VN')} VND`}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Trạng Thái" fullWidth value={selectedOrder.status} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Ngày Đặt Hàng" fullWidth value={new Date(selectedOrder.createdAt).toLocaleDateString()} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ghi Chú"
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedOrder.notes ? selectedOrder.notes : 'Không có ghi chú'}
                  disabled
                />
              </Grid>

              {/* Hiện sp */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Chi Tiết Sản Phẩm
                </Typography>
                {selectedOrder.orderDetails &&
                  selectedOrder.orderDetails.map((detail, index) => (
                    <Grid container key={index} alignItems="center" style={{ marginBottom: 20 }}>
                      <Grid item xs={2}>
                        {detail.product.pd_image.length > 0 ? (
                          <img
                            src={detail.product.pd_image[0]}
                            alt={detail.product.name}
                            style={{ width: '70px', height: '70px', borderRadius: '4px' }}
                          />
                        ) : (
                          <img src={'../../assets/images/no_img.png'} style={{ width: '70px', height: '70px', borderRadius: '4px' }} />
                        )}
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body1">{detail.product.name}</Typography>
                        <Typography variant="body2">Số lượng: {detail.product.pd_quantity}</Typography>
                        <Typography variant="body2">Size: {detail.product.size_name}</Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>

              <Grid item xs={12}>
                {selectedOrder.status === 'pending' && (
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateStatus('processing', selectedOrder._id)}
                      color="success"
                      style={{ marginRight: '10px' }}
                    >
                      Xác Nhận Đơn Hàng
                    </Button>
                    <Button variant="contained" onClick={() => handleUpdateStatus('cancelled', selectedOrder._id)} color="error">
                      Hủy Đơn Hàng
                    </Button>
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                {selectedOrder.returnRequest && selectedOrder.returnRequest.status === 'pending' && (
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleConfirmReturn(selectedOrder._id)}
                      color="primary"
                      style={{ marginRight: '10px' }}
                    >
                      Xác Nhận Hoàn Hàng
                    </Button>
                    <Button variant="contained" onClick={handleDeclineReturn(selectedOrder._id)} color="secondary">
                      Từ Chối Hoàn Hàng
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default OrderManagement;
