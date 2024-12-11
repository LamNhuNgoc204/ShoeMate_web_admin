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
  Pagination,
  CircularProgress
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

  const [lstOd, setlstOd] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderRenturn, setOrderRenturn] = useState([]);
  const [orderCancel, setOrderCancel] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setpage(1);
      try {
        setloading(true);
        const response = await AxiosInstance().get(`/orders/get-all-orders?page=${page}&limit=${limit}&filterStatus=${filterStatus}`);
        // console.log('order respose==>', response);

        if (response.status) {
          setlstOd(response);
          setPendingOrders(response.pendingOrders);
          setOrderCancel(response.ordersCancel);
          setOrderRenturn(response.refundedOrder);
          setData(response.data);
        }
      } catch (error) {
        console.log('error get data order: ', error);
      }
      setloading(false);
    };

    fetchData();
  }, [filterStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const response = await AxiosInstance().get(`/orders/get-all-orders?page=${page}&limit=${limit}&filterStatus=${filterStatus}`);
        console.log('order respose==>', response);

        if (response.status) {
          setlstOd(response);
          setPendingOrders(response.pendingOrders);
          setOrderCancel(response.ordersCancel);
          setOrderRenturn(response.refundedOrder);
          setlstOd(response);
          const reversedData = response.data.reduceRight((acc, item) => {
            acc.push(item);
            return acc;
          }, []);
          setData(response.data);
        }
      } catch (error) {
        console.log('error get data order: ', error);
      }
      setloading(false);
    };

    fetchData();
  }, [page]);

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
      const response = await AxiosInstance().put(`/orders/return-request/${orderId}`, { returnStatus: 'accepted' });
      console.log('accepted==>', response);

      if (response.status) {
        setData((prevData) => prevData.map((order) => (order.id === orderId ? { ...order, 'returnRequest.status': 'accepted' } : order)));
        setSnackbarMessage('Xác nhận hoàn hàng!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log('Huy don failed: ', error);
      setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  const handleDeclineReturn = async (orderId) => {
    try {
      const response = await AxiosInstance().put(`/orders/return-request/${orderId}`, { returnStatus: 'rejected' });
      console.log('rejected==>', response);

      if (response.status) {
        setSnackbarMessage('Từ chối yêu cầu hoàn hàng!');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log('Huy don failed: ', error);
      setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
  };

  return (
    <MainCard title="QUẢN LÝ ĐƠN HÀNG">
      <div>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đã Hoàn Thành</Typography>
              <Typography variant="h4">{lstOd?.completedOrder || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đã Hủy</Typography>
              <Typography variant="h4">{orderCancel.length || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đang Xử Lý</Typography>
              <Typography variant="h4">{pendingOrders.length || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Yêu Cầu Hoàn hàng</Typography>
              <Typography variant="h4">{orderRenturn.length || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <Grid item xs={24} md={4} style={{ marginBlock: 20 }}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Trạng Thái</InputLabel>
              <Select labelId="filter-label" value={filterStatus} onChange={handleFilterChange}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="processing">Đang vận chuyển</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
                <MenuItem value="refunded">Hoàn hàng</MenuItem>
                {/* Thêm trạng thái hoàn trả */}
                <MenuItem value="return-pending">Hoàn trả - Chờ xác nhận</MenuItem>
                <MenuItem value="return-accepted">Hoàn trả - Được chấp nhận</MenuItem>
                <MenuItem value="return-rejected">Hoàn trả - Bị từ chối</MenuItem>
                <MenuItem value="return-refunded">Hoàn trả - Đã hoàn tiền</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </FormControl>
      </div>

      {/* TẤT CẢ ĐƠN HÀNG */}
      <>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn</TableCell>
                  <TableCell>Tên Khách Hàng</TableCell>
                  <TableCell>Tổng Giá Trị</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Ngày Đặt Hàng</TableCell>
                  <TableCell>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id && order._id.slice(0, 5) && order._id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{order.receiver}</TableCell>
                    <TableCell>{order.total_price && order.total_price.toLocaleString('vi-VN')} VND</TableCell>
                    <TableCell>
                      {order?.status === 'pending'
                        ? 'Chờ xác nhận'
                        : order?.status === 'processing'
                          ? 'Đang vận chuyển'
                          : order?.status === 'completed'
                            ? 'Đã hoàn thành'
                            : order?.status === 'cancelled'
                              ? 'Đã hủy'
                              : order?.returnRequest?.status === 'pending'
                                ? 'Đang yêu cầu hoàn hàng'
                                : order?.returnRequest?.status === 'accepted'
                                  ? 'Yêu cầu hoàn hàng đã được chấp nhận'
                                  : order?.returnRequest?.status === 'rejected'
                                    ? 'Yêu cầu hoàn hàng đã bị từ chối'
                                    : 'Đã trả hàng - hoàn tiền'}
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
              count={lstOd?.totalPages}
              page={page}
              onChange={(e, value) => setpage(value)}
              color="primary"
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
          </TableContainer>
        )}
      </>

      {/* Dialog cho Chi Tiết Đơn Hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
          Chi Tiết Đơn Hàng {selectedOrder?._id && selectedOrder?._id?.slice(0, 5) && selectedOrder?._id?.slice(0, 8)?.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Mã Đơn Hàng" fullWidth value={selectedOrder._id && selectedOrder._id.toUpperCase()} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedOrder.receiver} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phương thức thanh toán"
                  fullWidth
                  value={
                    selectedOrder.payment_id &&
                    selectedOrder.payment_id.payment_method_id &&
                    selectedOrder.payment_id.payment_method_id.payment_method
                  }
                  disabled
                />
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
                <TextField
                  label="Trạng Thái"
                  fullWidth
                  value={
                    selectedOrder?.status === 'pending'
                      ? 'Chờ xác nhận'
                      : selectedOrder?.status === 'processing'
                        ? 'Đang vận chuyển'
                        : selectedOrder?.status === 'completed'
                          ? 'Đã hoàn thành'
                          : selectedOrder?.status === 'cancelled'
                            ? 'Đã hủy'
                            : selectedOrder?.returnRequest?.status === 'pending'
                              ? 'Đang yêu cầu hoàn hàng'
                              : selectedOrder?.returnRequest?.status === 'accepted'
                                ? 'Yêu cầu hoàn hàng đã được chấp nhận'
                                : selectedOrder?.returnRequest?.status === 'rejected'
                                  ? 'Yêu cầu hoàn hàng đã bị từ chối'
                                  : 'Đã trả hàng - hoàn tiền'
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ngày Đặt Hàng"
                  fullWidth
                  value={new Date(selectedOrder.timestamps && selectedOrder.timestamps.placedAt).toLocaleDateString()}
                  disabled
                />
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

              {selectedOrder.returnRequest && selectedOrder.returnRequest.status !== '' && (
                <Grid item xs={12}>
                  <TextField label="Lý do hoàn hàng" fullWidth value={selectedOrder.returnRequest.reason || 'Không có lý do'} disabled />
                </Grid>
              )}

              <Grid item xs={12}>
                {selectedOrder.returnRequest && selectedOrder.returnRequest.status === 'pending' && (
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmReturn(selectedOrder._id)}
                      color="primary"
                      style={{ marginRight: '10px' }}
                    >
                      Xác Nhận Hoàn Hàng
                    </Button>
                    <Button variant="contained" onClick={() => handleDeclineReturn(selectedOrder._id)} color="secondary">
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
