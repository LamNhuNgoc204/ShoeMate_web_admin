import MainCard from 'ui-component/cards/MainCard';
import React, { useState } from 'react';
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
  Typography
} from '@mui/material';

const OrderManagement = () => {
  const sampleOrders = [
    {
      _id: '1',
      order_code: 'OD001',
      customer_name: 'Nguyễn Văn A',
      total_amount: 500000,
      status: 'pending',
      createdAt: '2024-10-01T10:00:00Z',
      notes: 'Ghi chú đơn hàng 1'
    },
    {
      _id: '2',
      order_code: 'OD002',
      customer_name: 'Trần Thị B',
      total_amount: 300000,
      status: 'completed',
      createdAt: '2024-10-02T11:00:00Z',
      notes: 'Ghi chú đơn hàng 2'
    },
    {
      _id: '3',
      order_code: 'OD003',
      customer_name: 'Lê Văn C',
      total_amount: 700000,
      status: 'canceled',
      createdAt: '2024-10-03T12:00:00Z',
      notes: 'Ghi chú đơn hàng 3'
    },
    {
      _id: '4',
      order_code: 'OD004',
      customer_name: 'Phạm Văn D',
      total_amount: 450000,
      status: 'pending',
      createdAt: '2024-10-04T13:00:00Z',
      notes: 'Ghi chú đơn hàng 4'
    }
  ];

  const [orders, setOrders] = useState(sampleOrders);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (status) => {
    // Cập nhật trạng thái đơn hàng mẫu
    const updatedOrders = orders.map((order) => (order._id === selectedOrder._id ? { ...order, status } : order));
    setOrders(updatedOrders);
    handleCloseDialog();
    setSnackbarMessage('Cập nhật trạng thái thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    const updatedOrders = orders.filter((order) => order._id !== id);
    setOrders(updatedOrders);
    setSnackbarMessage('Xóa đơn hàng thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleConfirmReturn = async () => {
    // Xác nhận hoàn hàng
    const updatedOrders = orders.map((order) => (order._id === selectedOrder._id ? { ...order, status: 'returned' } : order));
    setOrders(updatedOrders);
    handleCloseDialog();
    setSnackbarMessage('Xác nhận hoàn hàng thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDeclineReturn = async () => {
    const updatedOrders = orders.map((order) => (order._id === selectedOrder._id ? { ...order, status: 'return declined' } : order));
    setOrders(updatedOrders);
    handleCloseDialog();
    setSnackbarMessage('Từ chối yêu cầu hoàn hàng thành công!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Hàm để lọc đơn hàng theo trạng thái
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
    const filtered = value === 'all' ? orders : orders.filter((order) => order.status === value);
    setFilteredOrders(filtered);
  };

  // Hàm xuất báo cáo đơn hàng
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      filteredOrders
        .map((order) => {
          return `${order.order_code},${order.customer_name},${order.total_amount},${order.status},${new Date(order.createdAt).toLocaleDateString()},${order.notes}`;
        })
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orders_report.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <MainCard title="QUẢN LÝ ĐƠN HÀNG">
      <FormControl fullWidth>
        <TextField label="Search đơn hàng" variant="outlined" />
      </FormControl>
      <Grid container sx={{ marginTop: 2, alignItems: 'center', marginBottom: 5 }}>
        <Grid item xs={16} md={4}>
          <FormControl fullWidth>
            <InputLabel id="filter-label">Trạng Thái</InputLabel>
            <Select labelId="filter-label" value={filterStatus} onChange={handleFilterChange}>
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Đang xử lý</MenuItem>
              <MenuItem value="completed">Đã hoàn thành</MenuItem>
              <MenuItem value="canceled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8} md={4} style={{ marginLeft: 20 }}>
          <Button variant="contained" onClick={handleExportReport} color="primary">
            Xuất Báo Cáo
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Typography variant="h2" align="center" sx={{ padding: 2 }}>
          BẢNG THỐNG KÊ ĐƠN HÀNG
        </Typography>
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
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.order_code}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.total_amount} VND</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(order)}>Xem Chi Tiết</Button>
                  <Button onClick={() => handleDeleteOrder(order._id)} color="error">
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog cho Chi Tiết Đơn Hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Mã Đơn Hàng" fullWidth value={selectedOrder.order_code} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedOrder.customer_name} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tổng Giá Trị" fullWidth value={`${selectedOrder.total_amount} VND`} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Trạng Thái" fullWidth value={selectedOrder.status} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Ngày Đặt Hàng" fullWidth value={new Date(selectedOrder.createdAt).toLocaleDateString()} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Ghi Chú" fullWidth multiline rows={4} value={selectedOrder.notes || ''} disabled />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleUpdateStatus('completed')} color="success" style={{ marginRight: '10px' }}>
                  Xác Nhận Đơn Hàng
                </Button>
                <Button variant="contained" onClick={() => handleUpdateStatus('canceled')} color="error">
                  Hủy Đơn Hàng
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleConfirmReturn} color="primary" style={{ marginRight: '10px' }}>
                  Xác Nhận Hoàn Hàng
                </Button>
                <Button variant="contained" onClick={handleDeclineReturn} color="secondary">
                  Từ Chối Hoàn Hàng
                </Button>
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
