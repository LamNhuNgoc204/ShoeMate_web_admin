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
import { addVoucher, getListVoucher } from 'api/voucher';
import { formatDate } from 'utils/date';

const PromotionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

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
      console.log('response==>', response);

      if (response.status) {
        setVouchers(response.data);
        console.log('vouchers:', response.data);
      }
    };
    fetchData();
  }, []);
  // console.log('vouchers ================>', vouchers);

  const handleOpenDialog = (promotion) => {
    setSelectedPromotion(promotion);
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
    const errors = {
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
    };

    if (!selectedPromotion || !selectedPromotion.voucher_name?.trim()) {
      errors.voucher_nameError = 'Vui lòng nhập tên voucher';
      isValid = false;
    }

    if (!selectedPromotion.quantity || selectedPromotion.quantity <= 0) {
      errors.quantityError = 'Vui lòng nhập số lượng hợp lệ';
      isValid = false;
    }

    if (!selectedPromotion.discount_value || selectedPromotion.discount_value <= 0) {
      errors.discount_valueError = 'Vui lòng nhập giá trị giảm giá hợp lệ';
      isValid = false;
    }

    if (!selectedPromotion.voucher_code.trim()) {
      errors.voucher_codeError = 'Vui lòng nhập mã voucher';
      isValid = false;
    }

    const today = new Date();
    const selectedStartDate = new Date(selectedPromotion.startDate);

    // Kiểm tra ngày bắt đầu
    if (!selectedPromotion.startDate) {
      errors.startDateError = 'Vui lòng chọn thời gian bắt đầu';
      isValid = false;
    } else if (selectedStartDate < today.setHours(0, 0, 0, 0)) {
      errors.startDateError = 'Thời gian bắt đầu phải từ hôm nay trở đi';
      isValid = false;
    }

    if (!selectedPromotion.endDate) {
      errors.endDateError = 'Vui lòng chọn thời gian kết thúc';
      isValid = false;
    }

    if (!selectedPromotion.min_order_value || selectedPromotion.min_order_value <= 0) {
      errors.min_order_valueError = 'Vui lòng nhập giá trị đơn hàng nhỏ nhất hợp lệ';
      isValid = false;
    }

    if (!selectedPromotion.max_discount_value || selectedPromotion.max_discount_value <= 0) {
      errors.max_discount_valueError = 'Vui lòng nhập giá trị giảm lớn nhất hợp lệ';
      isValid = false;
    }

    if (!selectedPromotion.usage_conditions.trim()) {
      errors.usage_conditionsError = 'Vui lòng nhập điều kiện sử dụng';
      isValid = false;
    }

    if (!selectedPromotion.usage_scope.trim()) {
      errors.usage_scopeError = 'Vui lòng nhập phạm vi sử dụng';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
  };

  const handleSavePromotion = async () => {
    if (!selectedPromotion) {
      // Thêm
      if (validateForm()) {
        const {
          name: voucher_name,
          discount_value,
          quantity,
          voucher_code,
          startDate: start_date,
          endDate: expiry_date,
          condition: usage_conditions,
          usage_scope,
          min_order_value,
          max_discount_value
        } = selectedPromotion;

        const formData = {
          voucher_name,
          discount_value,
          quantity,
          voucher_code,
          start_date,
          expiry_date,
          usage_conditions,
          usage_scope,
          min_order_value,
          max_discount_value
        };

        try {
          const response = await addVoucher(formData);

          if (response.status) {
            setSnackbarMessage('Voucher created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setPromotions([...promotions, response.data]);
          } else {
            setSnackbarMessage(response.message || 'Failed to create voucher');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        } catch (error) {
          setSnackbarMessage('Error creating voucher');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } finally {
          handleCloseDialog();
        }
      }
    } else {
      //Cập nhật
    }
  };

  const handleCloseWarning = () => {
    setShowDeleteWarning(false);
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
                  <Button onClick={() => handleOpenDialog(voucher)}>Sửa</Button>
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
                required
                label="Tên Voucher"
                name="voucher_name"
                placeholder="Nhập tên voucher"
                fullWidth
                value={selectedPromotion ? selectedPromotion.voucher_name : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, voucher_name: e.target.value })}
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
                value={selectedPromotion ? selectedPromotion.quantity : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, quantity: e.target.value })}
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
                value={selectedPromotion ? selectedPromotion.discount_value : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, discount_value: e.target.value })}
                placeholder="Nhập giá trị giảm giá"
                required
                error={!!error.discount_valueError}
                helperText={error.discount_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mã Voucher"
                fullWidth
                name="voucher_code"
                value={selectedPromotion ? selectedPromotion.voucher_code : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, voucher_code: e.target.value })}
                placeholder="Nhập mã voucher"
                required
                error={!!error.voucher_codeError}
                helperText={error.voucher_codeError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Thời Gian Bắt Đầu"
                type="date"
                fullWidth
                name="startDate"
                value={selectedPromotion ? selectedPromotion.startDate : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, startDate: e.target.value })}
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
                name="endDate"
                value={selectedPromotion ? selectedPromotion.endDate : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                error={!!error.endDateError}
                helperText={error.endDateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị đơn hàng nhỏ nhất"
                fullWidth
                required
                type="number"
                name="min_order_value"
                value={selectedPromotion ? selectedPromotion.min_order_value : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, min_order_value: e.target.value })}
                error={!!error.min_order_valueError}
                helperText={error.min_order_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị giảm lớn nhất"
                fullWidth
                required
                type="number"
                name="max_discount_value"
                value={selectedPromotion ? selectedPromotion.max_discount_value : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, max_discount_value: e.target.value })}
                error={!!error.max_discount_valueError}
                helperText={error.max_discount_valueError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Điều kiện sử dụng"
                fullWidth
                required
                type="text"
                name="usage_conditions"
                value={selectedPromotion ? selectedPromotion.usage_conditions : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, usage_conditions: e.target.value })}
                error={!!error.usage_conditionsError}
                helperText={error.usage_conditionsError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phạm vi sử dụng"
                fullWidth
                required
                type="text"
                name="usage_scope"
                value={selectedPromotion ? selectedPromotion.usage_scope : ''}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, usage_scope: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <input accept="image/*" type="file" style={{ width: '100%' }} />
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

      {/* Cảnh Báo Xóa Khuyến Mãi */}
      <Dialog open={showDeleteWarning} onClose={handleCloseWarning}>
        <DialogTitle>Cảnh Báo</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa khuyến mãi này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning}>Hủy</Button>
          <Button color="error">Xóa</Button>
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
