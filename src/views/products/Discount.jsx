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
  const [deleteId, setDeleteId] = useState(null);
  const [history, setHistory] = useState([
    {
      action: 'Thêm khuyến mãi',
      promotion: { name: 'Khuyến mãi 10% cho đơn hàng trên 1 triệu đồng' },
      timestamp: '2024-10-01T10:30:00Z'
    },
    {
      action: 'Cập nhật khuyến mãi',
      promotion: { name: 'Khuyến mãi 15% cho đơn hàng trên 1 triệu đồng' },
      timestamp: '2024-10-02T11:45:00Z'
    },
    {
      action: 'Xóa khuyến mãi',
      promotion: { name: 'Khuyến mãi hết hiệu lực tháng trước' },
      timestamp: '2024-10-03T12:00:00Z'
    },
    {
      action: 'Từ chối yêu cầu hoàn',
      promotion: { name: 'Không đạt yêu cầu hoàn khuyến mãi' },
      timestamp: '2024-10-04T14:15:00Z'
    },
    {
      action: 'Xác nhận hoàn khuyến mãi',
      promotion: { name: 'Hoàn khuyến mãi cho khách hàng' },
      timestamp: '2024-10-05T15:20:00Z'
    }
  ]);

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
  console.log('vouchers ================>', vouchers);

  const handleOpenDialog = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPromotion(null);
  };

  const handleSavePromotion = async () => {
    if (selectedPromotion) {
      const {
        name: voucher_name,
        discount_value,
        quantity,
        voucher_code,
        startDate: start_date,
        endDate: expiry_date,
        condition: usage_conditions,
        usage_scope,
        isInMiniGame,
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
        isInMiniGame,
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
      }
    }

    handleCloseDialog();
  };

  const handleDeletePromotion = (id) => {
    setDeleteId(id);
    setShowDeleteWarning(true);
  };

  const confirmDelete = () => {
    const updatedPromotions = promotions.filter((promo) => promo.id !== deleteId);
    setPromotions(updatedPromotions);
    setShowDeleteWarning(false);
    setSnackbarMessage('Xóa khuyến mãi thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    // Ghi lại lịch sử
    const deletedPromotion = promotions.find((promo) => promo.id === deleteId);
    setHistory([...history, { action: 'Xóa', promotion: deletedPromotion }]);
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
                {vouchers.filter((p) => p.active).length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi không hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {vouchers.filter((p) => !p.active).length}
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
            <MenuItem value="inactive">Không hiệu lực</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Khuyến Mãi</TableCell>
              <TableCell>Điều kiện sử dụng</TableCell>
              <TableCell>Thời Gian Bắt Đầu</TableCell>
              <TableCell>Thời Gian Kết Thúc</TableCell>
              <TableCell>Mã khuyến mãi</TableCell>
              <TableCell>Giá Trị giam gia toi da</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>So luong</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell>{voucher.voucher_name}</TableCell>
                <TableCell>{voucher.usage_conditions || 'N/A'}</TableCell>
                <TableCell>{formatDate(voucher.start_date) || 'N/A'}</TableCell>
                <TableCell>{formatDate(voucher.expiry_date) || 'N/A'}</TableCell>
                <TableCell>{voucher.voucher_code || 'N/A'}</TableCell>
                <TableCell>{voucher.max_discount_value || 'N/A'}</TableCell>
                <TableCell>{voucher.status === 'active' ? 'Hiệu lực' : 'Không hiệu lực'}</TableCell>
                <TableCell>{voucher.quantity}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(voucher)}>Sửa</Button>
                  {/* <Button onClick={() => handleDeletePromotion(voucher._id)} color="error">
                    Xóa
                  </Button> */}
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
        <DialogTitle>{selectedPromotion ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi'}</DialogTitle>
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
                required
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
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phạm vi sử dụng</InputLabel>
                <Select
                  value={selectedPromotion ? selectedPromotion.usage_scope : true}
                  onChange={(e) => setSelectedPromotion({ ...selectedPromotion, usage_scope: e.target.value })}
                >
                  <MenuItem value="toan_quoc">Toàn quốc</MenuItem>
                  <MenuItem value="giay_cao_got">Giày cao gót</MenuItem>
                  <MenuItem value="giay_the_thao">Giày thể thao</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng Thái</InputLabel>
                <Select
                  value={selectedPromotion ? selectedPromotion.status : true}
                  onChange={(e) => setSelectedPromotion({ ...selectedPromotion, status: e.target.value })}
                >
                  <MenuItem value={true}>Hiệu lực</MenuItem>
                  <MenuItem value={false}>Không hiệu lực</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <input accept="image/*" type="file" style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Chơi Mini Game"
                fullWidth
                select
                name="isInMiniGame"
                value={selectedPromotion ? selectedPromotion.isInMiniGame : true}
                onChange={(e) => setSelectedPromotion({ ...selectedPromotion, isInMiniGame: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value={false}>Không</option>
                <option value={true}>Có</option>
              </TextField>
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
          <Button onClick={confirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Thông Báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Lịch sử thao tác */}
      <Typography variant="h1" style={{ marginTop: 50, textAlign: 'center', marginBottom: 10 }}>
        Lịch Sử Thao Tác
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thời Gian</TableCell>
              <TableCell>Hành Động</TableCell>
              <TableCell>Khuyến Mãi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{new Date().toLocaleString()}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>{entry.promotion.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default PromotionManagement;
