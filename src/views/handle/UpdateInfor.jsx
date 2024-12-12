import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  DialogContentText
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
import { TabContext, TabPanel } from '@mui/lab';
import { stopCollaborationWithShipping, updateInfor, updatePaymentMethod, updatePaymentStatus, updateShipping } from 'api/updateData';
import { uploadToCloundinary } from 'functions/processingFunction';
import { getPayments, getShips } from 'api/getAllData';
import { formatDate } from 'utils/date';
import { addShipping, createNewMethod } from 'api/createNew';
import Swal from 'sweetalert2';

const AccountSettings = () => {
  const state = useSelector((state) => state.users);
  const user = state.users.user;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState('success');

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '' };

    // Kiểm tra Name
    if (!name.trim()) {
      newErrors.name = 'Vui lòng không để trống tên!';
      isValid = false;
    }

    // Kiểm tra Phone
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = 'Số điện thoại phải đủ 10 số!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const body = {
          avatar,
          name,
          phoneNumber: phone
        };
        const response = await updateInfor(body);
        if (response.status) {
          Swal.fire({
            title: 'Thông báo!',
            text: 'Cập nhật thông tin thành công!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.log('Lỗi cập nhật: ', error);
        Swal.fire({
          title: 'Oops...',
          text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newavatar = await uploadToCloundinary(file);
      setAvatar(newavatar);
    }
  };

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const [lstShip, setlstShip] = useState([]);
  const [loadingShip, setLoadingShip] = useState(false);
  const fetchShip = async () => {
    try {
      setLoadingShip(true);
      const response = await getShips();
      if (response.status) {
        setlstShip(response?.data?.reverse());
      }
    } catch (error) {
      console.log('error: ', error);
    }
    setLoadingShip(false);
  };

  useEffect(() => {
    fetchShip();
  }, []);

  // useEffect(() => {
  //   setlstShip((prev) => prev.filter((shipping) => shipping.isActive !== false));
  // }, [lstShip]);

  // State for Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: '',
    deliveryTime: '',
    cost: '',
    id: null
  });

  const handleDialogOpen = (shipping = null) => {
    if (shipping) {
      setShippingData({
        name: shipping.name,
        deliveryTime: shipping.deliveryTime,
        cost: shipping.cost,
        id: shipping._id
      });
    } else {
      setShippingData({
        name: '',
        deliveryTime: '',
        cost: '',
        id: null
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveShipping = async () => {
    //name, deliveryTime, cost
    const { name, deliveryTime, cost, id } = shippingData;
    if (!name || !deliveryTime || !cost) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      if (id) {
        // Update Shipping
        const response = await updateShipping(id, { name, deliveryTime, cost });
        if (response.status) {
          setlstShip((prevState) =>
            prevState.map((shipping) => (shipping._id === id ? { ...shipping, name, deliveryTime, cost } : shipping))
          );
          Swal.fire({
            title: 'Thông báo!',
            text: 'Cập nhật đơn vị vận chuyển thành công!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } else {
        // Add Shipping
        const delivery = deliveryTime + ' ngày';
        const response = await addShipping({ name, delivery, cost });
        if (response.status) {
          Swal.fire({
            title: 'Thông báo!',
            text: 'Thêm đơn vị vận chuyển thành công!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }

      setOpenDialog(false);
      fetchShip();
    } catch (error) {
      console.error('Lỗi:', error);
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [shippingToConfirm, setShippingToConfirm] = useState(null);

  const handleConfirmDialogOpen = (shipping) => {
    setShippingToConfirm(shipping);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setShippingToConfirm(null);
  };

  const handleStopCollaboration = async () => {
    if (!shippingToConfirm) return;

    try {
      const response = await stopCollaborationWithShipping(shippingToConfirm._id, { isActive: false });

      if (response.status) {
        setlstShip((prevState) =>
          prevState.map((shipping) => (shipping._id === shippingToConfirm._id ? { ...shipping, isActive: false } : shipping))
        );
        Swal.fire({
          title: 'Thông báo!',
          text: 'Đơn vị vận chuyển đã ngừng hợp tác thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      }
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Lỗi:', error);
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
      handleConfirmDialogClose();
    }
  };

  const [lstPayment, setlstPayment] = useState([]);
  const [loadingPayment, setloadingPayment] = useState(false);
  const fetchPayment = async () => {
    try {
      setloadingPayment(true);
      const response = await getPayments();
      if (response.status) {
        setlstPayment(response?.data?.reverse());
      }
    } catch (error) {
      console.log('error: ', error);
    }
    setloadingPayment(false);
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  const [openPaymentDialog, setopenPaymentDialog] = useState(false);
  const [paymentMethodToEdit, setpaymentMethodToEdit] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [image, setImage] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenDialogPayment = (payment) => {
    setpaymentMethodToEdit(payment);
    if (payment) {
      setPaymentMethod(payment.payment_method || '');
      setImage(payment.image || '');
      setIsDefault(payment.isDefault || false);
      setIsActive(payment.isActive || false);
    } else {
      setPaymentMethod('');
      setImage('');
      setIsDefault(false);
      setIsActive(false);
    }

    setopenPaymentDialog(true);
  };

  const onClose = () => {
    setpaymentMethodToEdit({});
    setopenPaymentDialog(false);
  };

  const handleClose = () => {
    setPaymentMethod('');
    setImage('');
    setIsDefault(false);
    setIsActive(false);
    setError('');
    onClose();
  };

  const handleUploadimg = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = await uploadToCloundinary(file);
      setImage(img);
    }
  };

  const validateFormPayment = () => {
    if (!paymentMethod || !image) {
      setError('Tên phương thức và hình ảnh là bắt buộc!');
      return false;
    }
    setError('');
    return true;
  };

  const handleSavePayment = async () => {
    if (!validateFormPayment()) return;
    setLoading(true);

    try {
      const payload = {
        payment_method: paymentMethod,
        image,
        isDefault,
        isActive
      };

      let response;
      if (paymentMethodToEdit) {
        // Cập nhật phương thức thanh toán
        response = await updatePaymentMethod(paymentMethodToEdit._id, payload);
      } else {
        // Thêm mới phương thức thanh toán
        response = await createNewMethod(payload);
      }

      if (response.status) {
        fetchPayment();
        Swal.fire({
          title: 'Thông báo!',
          text: paymentMethodToEdit ? 'Cập nhật phương thức thanh toán thành công!' : 'Thêm phương thức thanh toán thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        handleClose();
        return;
      }
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const [openConfirmDialogPayment, setOpenConfirmDialogPayment] = useState(false);
  const [paymentToDeactivate, setPaymentToDeactivate] = useState(null);
  const [newActive, setnewActive] = useState(false);

  const handleDialogOpenDialogPayment = (payment) => {
    setPaymentToDeactivate(payment);
    setOpenConfirmDialogPayment(true);
  };

  const handleDialogCloseDialogPayment = () => {
    setOpenConfirmDialogPayment(false);
    setPaymentToDeactivate(null);
  };

  const handleConfirmDeactivate = async () => {
    console.log('paymentToDeactivate', paymentToDeactivate);

    if (paymentToDeactivate) {
      const newActiveStatus = !paymentToDeactivate.isActive;
      console.log('newActive', newActiveStatus);
      // callapi
      const response = await updatePaymentStatus(paymentToDeactivate._id, { isActive: newActiveStatus });
      if (response.status) {
        fetchPayment();

        Swal.fire({
          title: 'Thông báo!',
          text: paymentToDeactivate.isActive
            ? `Đã tắt phương thức thanh toán bằng ${paymentToDeactivate.payment_method}`
            : `Đã bậc phương thức thanh toán bằng ${paymentToDeactivate.payment_method}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        handleDialogCloseDialogPayment();
      } else {
        Swal.fire({
          title: 'Oops...',
          text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        handleDialogCloseDialogPayment();
      }
    }
  };

  return (
    <MainCard title="QUẢN LÝ" style={{ padding: 20 }}>
      <TabContext value={tabIndex}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered textColor="primary" indicatorColor="primary">
          <Tab label="Cập Nhật Thông Tin" value={0} />
          <Tab label="Quản Lý Đơn Vị Vận Chuyển" value={1} />
          <Tab label="Quản Lý Phương Thức Thanh Toán" value={2} />
        </Tabs>

        <TabPanel value={0}>
          <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              CẬP NHẬT THÔNG TIN CÁ NHÂN
            </Typography>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
              <Button variant="outlined" component="label">
                Chọn avatar
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
              </Button>
              <TextField
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSave}>
                Lưu
              </Button>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={1}>
          <Typography variant="h4" align="center" gutterBottom>
            QUẢN LÝ ĐƠN VỊ VẬN CHUYỂN
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
            Thêm Đơn Vị Vận Chuyển
          </Button>

          {loadingShip ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <TableContainer fullWidth component={Paper} sx={{ margin: '20px auto', width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Tên đơn vị</b>
                    </TableCell>
                    <TableCell>
                      <b>Thời gian giao hàng</b>
                    </TableCell>
                    <TableCell>
                      <b>Phí vận chuyển</b>
                    </TableCell>
                    <TableCell>
                      <b>Trạng thái</b>
                    </TableCell>
                    <TableCell>
                      <b>Ngày tạo</b>
                    </TableCell>
                    <TableCell style={{ width: '30%' }}>
                      <b>Hoạt động</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lstShip.map((shipping) => (
                    <TableRow key={shipping?._id}>
                      <TableCell>{shipping?.name}</TableCell>
                      <TableCell>{shipping?.deliveryTime}</TableCell>
                      <TableCell>{shipping?.isActive ? 'Đang hợp tác' : 'Ngừng hợp tác'}</TableCell>
                      <TableCell>{shipping?.cost?.toLocaleString('vi-VN')} VNĐ</TableCell>
                      <TableCell>{shipping?.createdAt && formatDate(shipping?.createdAt)}</TableCell>
                      <TableCell style={{ width: '30%' }}>
                        {shipping?.isActive ? (
                          <TableRow style={{ width: '30%' }}>
                            <Button variant="outlined" style={{ marginRight: 5 }} onClick={() => handleDialogOpen(shipping)}>
                              Sửa
                            </Button>
                            <Button variant="outlined" onClick={() => handleConfirmDialogOpen(shipping)}>
                              Ngừng hợp tác
                            </Button>
                          </TableRow>
                        ) : (
                          <Typography style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                            Đã ngừng hợp tác với đơn vị vận chuyển này!
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={2}>
          <Typography variant="h4" align="center" gutterBottom>
            QUẢN LÝ PHƯƠNG THỨC THANH TOÁN
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialogPayment()}>
            Thêm Đơn Phương Thức Thanh Toán
          </Button>
          {loadingPayment ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <TableContainer fullWidth component={Paper} sx={{ margin: '20px auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Phương thức thanh toán</b>
                    </TableCell>
                    <TableCell>
                      <b>Trạng thái</b>
                    </TableCell>
                    <TableCell>
                      <b>Ngày thêm</b>
                    </TableCell>
                    <TableCell>
                      <b>Hoạt động</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lstPayment.map((payment) => (
                    <TableRow key={payment?._id}>
                      <TableCell>{payment?.payment_method}</TableCell>
                      <TableCell>{payment?.isActive ? 'Đã hoạt động' : 'Chưa hoạt động'}</TableCell>
                      <TableCell>{payment?.createdAt && formatDate(payment?.createdAt)}</TableCell>
                      <TableCell>
                        <TableRow>
                          <Button variant="outlined" style={{ marginRight: 5 }} onClick={() => handleOpenDialogPayment(payment)}>
                            Sửa
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDialogOpenDialogPayment(payment)}>
                            {payment?.isActive ? 'Tắt phương thức' : 'Bậc phương thức'}
                          </Button>
                        </TableRow>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </TabContext>

      {/* Dialog for Add/Edit Shipping */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
          {shippingData.id ? 'Chỉnh sửa Đơn Vị Vận Chuyển' : 'Thêm Đơn Vị Vận Chuyển'}
        </DialogTitle>
        <DialogContent>
          <TextField name="name" label="Tên Đơn Vị" value={shippingData.name} onChange={handleShippingChange} fullWidth margin="normal" />
          <TextField
            name="deliveryTime"
            label="Thời gian giao hàng"
            value={shippingData.deliveryTime}
            onChange={handleShippingChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="cost"
            label="Phí vận chuyển"
            value={shippingData.cost}
            onChange={handleShippingChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveShipping} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleConfirmDialogClose}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Xác Nhận Ngừng Hợp Tác</DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center">
            Bạn có chắc chắn muốn ngừng hợp tác với đơn vị vận chuyển <strong>{shippingToConfirm?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleStopCollaboration} color="secondary" variant="contained">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPaymentDialog} onClose={handleClose}>
        <DialogTitle>{paymentMethodToEdit ? 'Chỉnh Sửa Phương Thức Thanh Toán' : 'Thêm Phương Thức Thanh Toán'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Phương Thức Thanh Toán"
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
          />
          <TextField
            label="URL Hình Ảnh"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
          />
          {image && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleUploadimg} style={{ display: 'block', marginBottom: 16 }} />
          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} name="isActive" color="primary" />}
            label="Kích Hoạt"
          />
          <FormControlLabel
            control={<Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} name="isDefault" color="primary" />}
            label="Đặt Là Mặc Định"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSavePayment} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="primary" /> : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialogPayment} onClose={handleDialogCloseDialogPayment}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          Xác nhận tắt phương thức thanh toán : <b>{paymentToDeactivate?.payment_method}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1" align="center">
            Bạn có chắc chắn muốn ngừng hoạt động phương thức thanh toán: <b>{paymentToDeactivate?.payment_method}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCloseDialogPayment} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDeactivate} color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={severitySnackbar} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default AccountSettings;
