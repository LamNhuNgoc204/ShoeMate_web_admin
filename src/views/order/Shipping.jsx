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
  Pagination,
  CircularProgress
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AxiosInstance from 'helper/AxiosInstance';
import Swal from 'sweetalert2';

const ShippingManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShip, setfilterShip] = useState('all');
  const [ships, setShips] = useState([]);
  const [data, setData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        await Promise.all([fetchData(), fetchShipData()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAsync();
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

  // console.log('filtered', filteredOrders);

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
  const deliveredOrders = data.filter((order) => order.status === 'delivered' || order.status === 'completed').length;
  const shippingOrders = data.filter((order) => order.status === 'processing').length;

  const fetchData = async () => {
    try {
      setloading(true);
      const response = await AxiosInstance().get('/ship/get-order-forship');
      if (response.status) {
        const data = response.data;
        setData(data.reverse());
      }
    } catch (error) {
      console.log('Get order failed: ', error);
    }
    setloading(false);
  };
  // console.log('data=============>', data);

  const fetchShipData = async () => {
    try {
      setloading(true);
      const response = await AxiosInstance().get('/ship/get-shipping');
      if (response.status) {
        setShips(response.data);
      }
    } catch (error) {
      console.log('Get ship failed: ', error);
    }
    setloading(false);
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
        // console.log('response: ', response.data);

        setData((prevShipments) =>
          prevShipments.map((shipment) => (shipment._id === selectedShipment._id ? { ...shipment, status } : shipment))
        );

        handleCloseDialog();

        Swal.fire({
          title: 'Thông báo!',
          text: 'Cập nhật trạng thái thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
      console.log('error update status order: ', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleReturnOrder = async (orderId) => {
    console.log('hoàn hàng nè-------------------');

    try {
      ///return-order/:orderId
      const response = await AxiosInstance().put(`/orders/return-order/${orderId}`);
      if (response.status) {
        Swal.fire({
          title: 'Thông báo!',
          text: 'Đơn hàng đã được hoàn trả về shop! Hoàn tất hoàn hàng.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.log('Lỗi cập nhật trạng thái: ', error);
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      handleCloseDialog();
    }
  };

  // console.log('selectedShipment===>', selectedShipment);

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
                  <TableCell>ID</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Khách Hàng</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Địa Chỉ</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Trạng Thái</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Thời gian</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Đơn vị vận chuyển</TableCell>
                  <TableCell style={{ textAlign: 'center', width: '15%' }}>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((shipment) => (
                  <TableRow key={shipment._id}>
                    <TableCell>{shipment._id && shipment._id.slice(0, 8) && shipment._id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{shipment.receiver}</TableCell>
                    <TableCell>{shipment.address}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {shipment.status === 'processing' && !shipment?.returnRequest
                        ? 'Đang giao'
                        : shipment.status === 'processing' && shipment?.returnRequest?.status === 'accepted'
                          ? 'Đang giao về shop'
                          : 'Đã giao'}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        shipment.status === 'processing'
                          ? shipment.timestamps && shipment.timestamps.shippedAt
                          : shipment.timestamps && shipment.timestamps.deliveredAt
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{shipment.shipping_id && shipment.shipping_id.name}</TableCell>
                    <TableCell style={{ textAlign: 'center', width: '15%' }}>
                      <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(shipment)}>
                        Xem Chi Tiết
                      </Button>
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
        )}
      </>

      {/* Dialog cho Chi Tiết Vận Chuyển */}
      <Dialog open={openDialog} fullWidth onClose={handleCloseDialog}>
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
                  value={
                    selectedShipment.status === 'processing' && !selectedShipment?.returnRequest
                      ? 'Đang giao'
                      : selectedShipment.status === 'processing' && selectedShipment?.returnRequest?.status === 'accepted'
                        ? 'Đang hoàn hàng về shop'
                        : 'Đã giao'
                  }
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
                        selectedShipment.orderDetails.map((product, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <img
                                  src={
                                    product.product?.pd_image[0] ||
                                    'https://i.pinimg.com/236x/b4/0a/b2/b40ab2c7bb076494734828022251bce8.jpg'
                                  }
                                  style={{ width: '100px', height: '100px' }}
                                />
                              </TableCell>
                              <TableCell>{product.product && product.product.name}</TableCell>
                              <TableCell>{product.product && product.product.pd_quantity}</TableCell>
                              <TableCell>
                                {product.product && product.product.price && product.product.price.toLocaleString()} VNĐ
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                {!selectedShipment?.returnRequest && selectedShipment.status !== 'delivered' && selectedShipment.status !== 'completed' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateStatus('delivered')}
                    style={{ marginRight: '10px' }}
                  >
                    Đã Giao Hàng
                  </Button>
                ) : (
                  <Typography variant="h4" align="center">
                    {!selectedShipment?.returnRequest && 'Đơn hàng đã được giao thành công'}
                  </Typography>
                )}

                {selectedShipment?.returnRequest?.status === 'accepted' ? (
                  <Button
                    onClick={() => handleReturnOrder(selectedShipment._id)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px', marginTop: 10 }}
                  >
                    Đã Hoàn Hàng
                  </Button>
                ) : (
                  <Typography variant="h4" align="center">
                    {selectedShipment?.returnRequest?.status === 'refunded' && 'Đơn hàng đã được hoàn về shop'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ShippingManagement;
