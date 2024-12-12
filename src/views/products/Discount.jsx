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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  CircularProgress,
  Pagination
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { addVoucher, getListVoucher, updateVoucher } from 'api/voucher';
import { formatDate } from 'utils/date';
import Swal from 'sweetalert2';

const PromotionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    discount_value: 0,
    voucher_name: '',
    quantity: 1,
    voucher_image: '',
    voucher_code: '',
    expiry_date: '',
    start_date: '',
    usage_conditions: '',
    usage_scope: '',
    min_order_value: 0,
    max_discount_value: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState('all');
  const [lstVC, setlstVC] = useState({});

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setPage(1);
      setLoading(true);
      try {
        const response = await getListVoucher(page, rowsPerPage, statusFilter);
        // console.log('response==>', response);

        if (response.status) {
          setlstVC(response);
          const data = response.data;
          setVouchers(data);
          // console.log('vouchers:', response.data);
        }
      } catch (error) {
        console.log('error==>', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [statusFilter]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getListVoucher(page, rowsPerPage, statusFilter);
        // console.log('response==>', response);

        if (response.status) {
          setlstVC(response);
          const data = response.data;
          setVouchers(data);
          // console.log('vouchers:', response.data);
        }
      } catch (error) {
        console.log('error==>', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [page]);
  // console.log('vouchers ================>', vouchers);

  const handleOpenDialog = (promotion = null) => {
    const defaultForm = {
      discount_value: 0,
      voucher_name: '',
      quantity: 1,
      voucher_image: '',
      voucher_code: '',
      expiry_date: '',
      start_date: '',
      usage_conditions: '',
      usage_scope: '',
      min_order_value: 0,
      max_discount_value: 0
    };

    setSelectedPromotion(promotion);

    if (promotion) {
      setFormData({
        ...defaultForm,
        ...promotion,
        start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().slice(0, 10) : '', // format YYYY-MM-DD
        expiry_date: promotion.expiry_date ? new Date(promotion.expiry_date).toISOString().slice(0, 10) : '' // format YYYY-MM-DD
      });
    } else {
      setFormData(defaultForm);
    }
    setOpenDialog(true);
  };

  const [error, setError] = useState({
    voucher_nameError: '',
    quantityError: '',
    discount_valueError: '',
    voucher_codeError: '',
    startDateError: '',
    endDateError: '',
    min_order_valueError: '',
    max_discount_valueError: '',
    usage_conditionsError: '',
    usage_scopeError: ''
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData || !formData.voucher_name?.trim()) {
      errors.voucher_nameError = 'Vui lòng nhập tên voucher';
      isValid = false;
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantityError = 'Vui lòng nhập số lượng là số dương lớn hơn 0';
      isValid = false;
    }

    if (formData.discount_value < 0) {
      errors.discount_valueError = 'Vui lòng nhập giá trị giảm giá là số dương lớn hơn 0';
      isValid = false;
    }

    if (!formData.voucher_code.trim()) {
      errors.voucher_codeError = 'Vui lòng nhập mã voucher';
      isValid = false;
    }

    const today = new Date();
    const selectedStartDate = new Date(formData.start_date);

    // Kiểm tra ngày bắt đầu
    if (!formData.start_date) {
      errors.startDateError = 'Vui lòng chọn thời gian bắt đầu';
      isValid = false;
    } else if (selectedStartDate < today.setHours(0, 0, 0, 0)) {
      errors.startDateError = 'Thời gian bắt đầu phải từ hôm nay trở đi';
      isValid = false;
    }

    if (!formData.expiry_date) {
      errors.endDateError = 'Vui lòng chọn thời gian kết thúc';
      isValid = false;
    }

    if (formData.min_order_value < 0) {
      errors.min_order_valueError = 'Vui lòng nhập giá trị đơn hàng nhỏ nhất là số dương';
      isValid = false;
    }

    if (formData.max_discount_value < 0) {
      errors.max_discount_valueError = 'Vui lòng nhập giá trị giảm lớn nhất là số dương';
      isValid = false;
    }

    if (!formData.usage_conditions.trim()) {
      errors.usage_conditionsError = 'Vui lòng nhập điều kiện sử dụng';
      isValid = false;
    }

    if (!formData.usage_scope.trim()) {
      errors.usage_scopeError = 'Vui lòng nhập phạm vi sử dụng';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleCloseDialog = () => {
    setError({
      voucher_nameError: '',
      quantityError: '',
      discount_valueError: '',
      voucher_codeError: '',
      startDateError: '',
      endDateError: '',
      min_order_valueError: '',
      max_discount_valueError: '',
      usage_conditionsError: '',
      usage_scopeError: ''
    });
    setSelectedPromotion(null);
    setOpenDialog(false);
  };

  const handleSavePromotion = async () => {
    if (selectedPromotion) {
      // Cập nhật
      if (!validateForm()) {
        return;
      }

      const response = await updateVoucher(selectedPromotion._id, formData);
      if (response.status) {
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) => (voucher._id === selectedPromotion._id ? { ...voucher, ...response.data } : voucher))
        );
        Swal.fire({
          title: 'Thông báo!',
          text: 'Cập nhật mã giảm giá thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        handleCloseDialog();
      } else {
        Swal.fire({
          title: 'Oops...',
          text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        handleCloseDialog();
      }
    } else {
      // Thêm
      if (!validateForm()) {
        return;
      }

      const response = await addVoucher(formData);
      if (response.status) {
        Swal.fire({
          title: 'Thông báo!',
          text: 'Thêm mã giảm giá thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        setVouchers([response.data, ...vouchers]);
        handleCloseDialog();
      } else {
        Swal.fire({
          title: 'Oops...',
          text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        handleCloseDialog();
      }
    }
  };

  console.log('selectedPromotion', selectedPromotion);

  return (
    <MainCard title="QUẢN LÝ KHUYẾN MÃI">
      {/* Thống kê khuyến mãi */}
      <FormControl fullWidth style={{ marginBottom: 10, marginTop: 10 }}>
        <Typography style={{ marginBottom: 20 }} variant="h1" align="center" gutterBottom>
          Thống Kê Khuyến Mãi
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Tổng số khuyến mãi
              </Typography>
              <Typography variant="h4" align="center">
                {lstVC?.activeVC?.length + lstVC?.inactiveVC?.length || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {lstVC?.activeVC?.length || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi không hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {lstVC?.inactiveVC?.length || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </FormControl>

      {/* LOC TRANG THAI */}

      <Grid item xs={24} alignItems={'center'} style={{ marginTop: 30 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(null)}
          style={{ marginBottom: '20px', marginRight: 20, paddingBlock: 12 }}
        >
          Thêm Khuyến Mãi
        </Button>

        <FormControl style={{ width: 200 }}>
          <InputLabel>Trạng Thái</InputLabel>
          <Select value={statusFilter} onChange={handleFilterChange}>
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hiệu lực</MenuItem>
            <MenuItem value="inactive">Hết hiệu lực</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Điều Kiện</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Bắt Đầu</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Kết Thúc</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Mã Code</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Giảm Tối Đa (VNĐ)</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Trạng Thái</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Số Lượng</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher._id}>
                    <TableCell>{voucher.voucher_name}</TableCell>
                    <TableCell>{voucher.usage_conditions || 'N/A'}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{formatDate(voucher.start_date) || 'N/A'}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{formatDate(voucher.expiry_date) || 'N/A'}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{voucher.voucher_code || 'N/A'}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {(voucher.max_discount_value && voucher.max_discount_value.toLocaleString('vi-VN')) || 'N/A'}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{voucher.status === 'active' ? 'Hiệu lực' : 'Hết hiệu lực'}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{voucher.quantity}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setSelectedPromotion(voucher);
                          handleOpenDialog(voucher);
                        }}
                      >
                        Sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              count={lstVC?.totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
          </TableContainer>
        )}
      </>

      {/* Dialog cho Thêm/Sửa Khuyến Mãi */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
          {selectedPromotion ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên Voucher"
                name="voucher_name"
                placeholder="Nhập tên voucher"
                fullWidth
                value={formData.voucher_name}
                onChange={handleInputChange}
                error={!!error.voucher_nameError}
                helperText={error.voucher_nameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Số Lượng"
                fullWidth
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Nhập số lượng"
                error={!!error.quantityError}
                helperText={error.quantityError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị Giảm Giá"
                fullWidth
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleInputChange}
                placeholder="Nhập giá trị giảm giá"
                error={!!error.discount_valueError}
                helperText={error.discount_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mã Voucher"
                fullWidth
                name="voucher_code"
                value={formData.voucher_code}
                onChange={handleInputChange}
                placeholder="Nhập mã voucher"
                error={!!error.voucher_codeError}
                helperText={error.voucher_codeError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Thời Gian Bắt Đầu"
                type="date"
                fullWidth
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!error.startDateError}
                helperText={error.startDateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Thời Gian Kết Thúc"
                type="date"
                fullWidth
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!error.endDateError}
                helperText={error.endDateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị đơn hàng nhỏ nhất"
                fullWidth
                type="number"
                name="min_order_value"
                value={formData.min_order_value}
                onChange={handleInputChange}
                error={!!error.min_order_valueError}
                helperText={error.min_order_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị giảm lớn nhất"
                fullWidth
                type="number"
                name="max_discount_value"
                value={formData.max_discount_value}
                onChange={handleInputChange}
                error={!!error.max_discount_valueError}
                helperText={error.max_discount_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Điều kiện sử dụng"
                fullWidth
                type="text"
                name="usage_conditions"
                value={formData.usage_conditions}
                onChange={handleInputChange}
                error={!!error.usage_conditionsError}
                helperText={error.usage_conditionsError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phạm vi sử dụng"
                fullWidth
                type="text"
                name="usage_scope"
                value={formData.usage_scope}
                onChange={handleInputChange}
                error={!!error.usage_scopeError}
                helperText={error.usage_scopeError}
              />
            </Grid>

            <Grid item xs={12}>
              <input onChange={handleInputChange} accept="image/*" type="file" style={{ width: '100%' }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSavePromotion}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default PromotionManagement;
