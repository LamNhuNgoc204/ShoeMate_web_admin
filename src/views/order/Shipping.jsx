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
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AxiosInstance from 'helper/AxiosInstance';

const ShippingManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShip, setfilterShip] = useState('all');
  const [ships, setShips] = useState([]);
  const [data, setData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
    fetchShipData();
  }, []);

  useEffect(() => {
    let filtered = data;

    // Lọc theo trạng thái nếu có chọn một trạng thái cụ thể
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Lọc theo đơn vị vận chuyển nếu có chọn một đơn vị cụ thể
    if (filterShip !== 'all') {
      filtered = filtered.filter((order) => order.shipping_id && order.shipping_id._id === filterShip);
    }

    setFilteredOrders(filtered);
  }, [data, filterStatus, filterShip]);

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleShipFilterChange = (event) => {
    setfilterShip(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Tính toán thống kê
  const totalOrders = data.length;
  const deliveredOrders = data.filter((order) => order.status === 'delivered').length;
  const shippingOrders = data.filter((order) => order.status === 'processing').length;

  const fetchData = async () => {
    try {
      const response = await AxiosInstance().get('/ship/get-order-forship');
      if (response.status) {
        setData(response.data);
      }
    } catch (error) {
      console.log('Get order failed: ', error);
    }
  };
  console.log('data=============>', data);

  const fetchShipData = async () => {
    try {
      const response = await AxiosInstance().get('/ship/get-shipping');
      if (response.status) {
        setShips(response.data);
      }
    } catch (error) {
      console.log('Get ship failed: ', error);
    }
  };

  const handleOpenDialog = (shipment) => {
    setSelectedShipment(shipment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShipment(null);
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await AxiosInstance().put(`/orders/confirm-order/${selectedShipment._id}`, { status: status });
      if (response.status) {
        console.log('response: ', response.data);

        setData((prevShipments) =>
          prevShipments.map((shipment) => (shipment._id === selectedShipment._id ? { ...shipment, status } : shipment))
        );

        handleCloseDialog();
        setSnackbarMessage('Cập nhật trạng thái thành công!');
      }
    } catch (error) {
      console.log('error update status order: ', error);
    } finally {
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  return (
    <MainCard title="QUẢN LÝ VẬN CHUYỂN">
      <>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Tổng Đơn Hàng</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đã Giao</Typography>
              <Typography variant="h4">{deliveredOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Đơn Đang Giao</Typography>
              <Typography variant="h4">{shippingOrders}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <Grid container spacing={2} style={{ marginBlock: 20 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="filter-label">Trạng Thái</InputLabel>
                <Select labelId="filter-label" value={filterStatus} onChange={handleFilterChange}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="processing">Đang giao</MenuItem>
                  <MenuItem value="delivered">Đã giao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="filter-ship">Lọc đơn vị vận chuyển</InputLabel>
                <Select labelId="filter-ship" value={filterShip} onChange={handleShipFilterChange}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  {ships.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </FormControl>
      </>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Khách Hàng</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Địa Chỉ</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Trạng Thái</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Thời gian</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Đơn vị vận chuyển</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell>{shipment._id && shipment._id.slice(0, 8) && shipment._id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{shipment.receiver}</TableCell>
                <TableCell>{shipment.address}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{shipment.status === 'processing' ? 'Đang giao' : 'Đã giao'}</TableCell>
                <TableCell>
                  {new Date(
                    shipment.status === 'processing'
                      ? shipment.timestamps && shipment.timestamps.shippedAt
                      : shipment.timestamps && shipment.timestamps.deliveredAt
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{shipment.shipping_id && shipment.shipping_id.name}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button onClick={() => handleOpenDialog(shipment)}>Xem Chi Tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredOrders.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}
        />
      </TableContainer>

      {/* Dialog cho Chi Tiết Vận Chuyển */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Chi Tiết Vận Chuyển</DialogTitle>
        <DialogContent>
          {selectedShipment && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Mã Đơn" fullWidth value={selectedShipment._id && selectedShipment._id.toUpperCase()} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedShipment.receiver} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Địa Chỉ" fullWidth value={selectedShipment.address} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Trạng Thái"
                  fullWidth
                  value={selectedShipment.status === 'processing' ? 'Đang giao' : 'Đã giao'}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ngày Giao Hàng Dự Kiến"
                  fullWidth
                  value={new Date(
                    selectedShipment.status === 'processing'
                      ? selectedShipment.timestamps && selectedShipment.timestamps.shippedAt
                      : selectedShipment.timestamps && selectedShipment.timestamps.deliveredAt
                  ).toLocaleDateString()}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <h4>Danh Sách Sản Phẩm</h4>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ảnh Sản Phẩm</TableCell>
                        <TableCell>Tên Sản Phẩm</TableCell>
                        <TableCell>Số Lượng</TableCell>
                        <TableCell>Giá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedShipment.orderDetails &&
                        selectedShipment.orderDetails.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={
                                  product.product &&
                                  product.product.pd_image &&
                                  product.product.pd_image &&
                                  product.product.pd_image.filter((asset) => asset.type === 'jpg')[0]?.url
                                }
                                style={{ width: '100px', height: '100px' }}
                              />
                            </TableCell>
                            <TableCell>{product.product && product.product.name}</TableCell>
                            <TableCell>{product.product && product.product.pd_quantity}</TableCell>
                            <TableCell>{product.product && product.product.price && product.product.price.toLocaleString()} VNĐ</TableCell>
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
                {/* <Button variant="contained" onClick={() => handleUpdateStatus('pending')} color="warning">
                  Đang Chờ
                </Button> */}
                {/* <Button variant="contained" onClick={() => handleUpdateStatus('canceled')} color="error" style={{ marginLeft: '10px' }}>
                  Hủy Vận Chuyển
                </Button> */}
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
