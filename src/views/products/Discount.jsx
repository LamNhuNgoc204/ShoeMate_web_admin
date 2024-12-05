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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  TablePagination
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { addVoucher, getListVoucher, updateVoucher } from 'api/voucher';
import { formatDate } from 'utils/date';

const PromotionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'active' ? voucher.status === 'active' : voucher.status !== 'active';
  });

  const paginatedVouchers = filteredVouchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getListVoucher();
      // console.log('response==>', response);

      if (response.status) {
        const data = response.data;
        setVouchers(data.reverse());
        // console.log('vouchers:', response.data);
      }
    };
    fetchData();
  }, []);
  // console.log('vouchers ================>', vouchers);

  const handleOpenDialog = (promotion = null) => {
    console.log('mã giảm giá cần sửa: ', promotion);
    if (promotion) {
      setSelectedPromotion(promotion);
    }
    if (selectedPromotion) {
      setFormData({
        discount_value: promotion.discount_value || 0,
        voucher_name: promotion.voucher_name || '',
        quantity: promotion.quantity || 1,
        voucher_image: promotion.voucher_image || '',
        voucher_code: promotion.voucher_code || '',
        expiry_date: promotion.expiry_date || '',
        start_date: promotion.start_date || '',
        usage_conditions: promotion.usage_conditions || '',
        usage_scope: promotion.usage_scope || '',
        min_order_value: promotion.min_order_value || 0,
        max_discount_value: promotion.max_discount_value || 0
      });
    } else {
      setFormData({
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
    }
    // console.log('form data================>', formData);
    console.log('selectedPromotion===============>', selectedPromotion);
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
        // setVouchers((prevVouchers) => prevVouchers.map((voucher) => (voucher._id === selectedPromotion._id ? response.data : voucher)));
        setSnackbarMessage('Cập nhật mã giảm giá thành công!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseDialog();
      } else {
        setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        handleCloseDialog();
      }
    } else {
      // Thêm
      if (!validateForm()) {
        return;
      }

      const response = await addVoucher(formData);
      if (response.status) {
        setSnackbarMessage('Thêm mã giảm giá thành công!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setVouchers([response.data, ...vouchers]);
        handleCloseDialog();
      } else {
        setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        handleCloseDialog();
      }
    }
  };

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
                {vouchers.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {vouchers.filter((p) => p.status === 'active').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi không hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {vouchers.filter((p) => p.status !== 'active').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </FormControl>

      {/* LOC TRANG THAI */}
      <Grid item xs={24} alignItems={'center'} style={{ marginTop: 30 }}>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog(null)}
          color="primary"
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
            {paginatedVouchers.map((voucher) => (
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

        <TablePagination
          component="div"
          count={filteredVouchers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          color="primary"
          labelRowsPerPage="Số hàng mỗi trang"
        />
      </TableContainer>

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
              <input value={formData.voucher_image} onChange={handleInputChange} accept="image/*" type="file" style={{ width: '100%' }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSavePromotion} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Thông Báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default PromotionManagement;
