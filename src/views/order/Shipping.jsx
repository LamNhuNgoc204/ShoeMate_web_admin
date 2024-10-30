import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import shipIcon from '../../assets/images/icons/ship.png';
import completeIcon from '../../assets/images/icons/complete.png';

const sampleData = [
  {
    _id: '1',
    shipping_code: 'SH123456',
    customer_name: 'Nguyễn Văn A',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    status: 'Đang giao',
    expectedDelivery: '2024-10-10T00:00:00Z',
    products: [
      { name: 'Sản phẩm 1', quantity: 2, price: 50000 },
      { name: 'Sản phẩm 2', quantity: 1, price: 75000 }
    ]
  },
  {
    _id: '2',
    shipping_code: 'SH123457',
    customer_name: 'Trần Thị B',
    address: '456 Đường DEF, Quận 2, TP.HCM',
    status: 'Đã giao',
    expectedDelivery: '2024-10-09T00:00:00Z',
    products: [
      { name: 'Sản phẩm 3', quantity: 3, price: 30000 },
      { name: 'Sản phẩm 4', quantity: 1, price: 20000 }
    ]
  }
];

const ShippingManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Tính toán thống kê
  const totalOrders = shipments.length;
  const deliveredOrders = shipments.filter((order) => order.status === 'Đã giao').length;
  const shippingOrders = shipments.filter((order) => order.status === 'Đang giao').length;
  const processingOrders = shipments.filter((order) => order.status === 'Đang xử lý').length;

  useEffect(() => {
    setShipments(sampleData);
  }, []);

  const handleOpenDialog = (shipment) => {
    setSelectedShipment(shipment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShipment(null);
  };

  const handleUpdateStatus = (status) => {
    // Cập nhật trạng thái cho đơn hàng đã chọn
    setShipments((prevShipments) =>
      prevShipments.map((shipment) => (shipment._id === selectedShipment._id ? { ...shipment, status } : shipment))
    );

    handleCloseDialog();
    setSnackbarMessage('Cập nhật trạng thái thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <MainCard title="QUẢN LÝ VẬN CHUYỂN">
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Tổng Đơn Hàng</Typography>
            <Typography variant="h4">{totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Đơn Đã Giao</Typography>
            <Typography variant="h4">{deliveredOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Đơn Đang Giao</Typography>
            <Typography variant="h4">{shippingOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Đơn Đang Xử Lý</Typography>
            <Typography variant="h4">{processingOrders}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Vận Chuyển</TableCell>
              <TableCell>Tên Khách Hàng</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ngày Giao Hàng Dự Kiến</TableCell>
              <TableCell>Đơn vị vận chuyển</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.shipping_code}</TableCell>
                <TableCell>{shipment.customer_name}</TableCell>
                <TableCell>{shipment.address}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>{new Date(shipment.expectedDelivery).toLocaleDateString()}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {shipment.status === 'Đang giao' ? (
                    <img src={shipIcon} alt={shipment.status} style={{ width: 50, height: 50 }} />
                  ) : shipment.status === 'Đã giao' ? (
                    <img src={completeIcon} alt={shipment.status} style={{ width: 50, height: 50 }} />
                  ) : (
                    <CircularProgress />
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(shipment)}>Xem Chi Tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog cho Chi Tiết Vận Chuyển */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi Tiết Vận Chuyển</DialogTitle>
        <DialogContent>
          {selectedShipment && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Mã Vận Chuyển" fullWidth value={selectedShipment.shipping_code} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedShipment.customer_name} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Địa Chỉ" fullWidth value={selectedShipment.address} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Trạng Thái" fullWidth value={selectedShipment.status} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ngày Giao Hàng Dự Kiến"
                  fullWidth
                  value={new Date(selectedShipment.expectedDelivery).toLocaleDateString()}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <h4>Danh Sách Sản Phẩm</h4>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Sản Phẩm</TableCell>
                        <TableCell>Số Lượng</TableCell>
                        <TableCell>Giá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedShipment.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.price.toLocaleString()} VNĐ</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleUpdateStatus('delivered')} color="success" style={{ marginRight: '10px' }}>
                  Đã Giao Hàng
                </Button>
                <Button variant="contained" onClick={() => handleUpdateStatus('pending')} color="warning">
                  Đang Chờ
                </Button>
                <Button variant="contained" onClick={() => handleUpdateStatus('canceled')} color="error" style={{ marginLeft: '10px' }}>
                  Hủy Vận Chuyển
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default ShippingManagement;
