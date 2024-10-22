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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Giảm giá 20%',
      description: 'Giảm giá 20% cho tất cả sản phẩm',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      type: 'Giảm Giá',
      value: '20%',
      active: true,
      notes: 'Khuyến mãi này chỉ áp dụng cho đơn hàng trên 500.000 VNĐ'
    },
    {
      id: 2,
      name: 'Mua 1 Tặng 1',
      description: 'Mua 1 sản phẩm bất kỳ, tặng 1 sản phẩm cùng loại',
      startDate: '2024-10-15',
      endDate: '2024-11-15',
      type: 'Tặng Sản Phẩm',
      value: '1',
      active: true,
      notes: 'Áp dụng cho sản phẩm A và B'
    },
    {
      id: 3,
      name: 'Miễn phí vận chuyển',
      description: 'Miễn phí vận chuyển cho đơn hàng từ 300.000 VNĐ',
      startDate: '2024-09-20',
      endDate: '2024-10-20',
      type: 'Miễn Phí Vận Chuyển',
      value: '300.000 VNĐ',
      active: false,
      notes: 'Khuyến mãi đã hết hạn'
    }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
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

  const handleOpenDialog = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPromotion(null);
  };

  const handleSavePromotion = () => {
    if (selectedPromotion) {
      // Cập nhật khuyến mãi
      const updatedPromotions = promotions.map((promo) => (promo.id === selectedPromotion.id ? selectedPromotion : promo));
      setPromotions(updatedPromotions);
    } else {
      // Thêm khuyến mãi mới
      const newPromotion = {
        id: Date.now(),
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        type: '',
        value: '',
        active: true,
        notes: ''
      };
      setPromotions([...promotions, newPromotion]);
    }
    handleCloseDialog();
    setSnackbarMessage('Lưu khuyến mãi thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
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
      <Button variant="contained" onClick={() => handleOpenDialog(null)} color="primary" style={{ marginBottom: '20px' }}>
        Thêm Khuyến Mãi
      </Button>

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
                {promotions.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {promotions.filter((p) => p.active).length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" align="center">
                Khuyến mãi không hiệu lực
              </Typography>
              <Typography variant="h4" align="center">
                {promotions.filter((p) => !p.active).length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </FormControl>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Khuyến Mãi</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Thời Gian Bắt Đầu</TableCell>
              <TableCell>Thời Gian Kết Thúc</TableCell>
              <TableCell>Loại Khuyến Mãi</TableCell>
              <TableCell>Giá Trị</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ghi Chú</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell>{promotion.type}</TableCell>
                <TableCell>{promotion.value}</TableCell>
                <TableCell>{promotion.active ? 'Hiệu lực' : 'Không hiệu lực'}</TableCell>
                <TableCell>{promotion.notes}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(promotion)}>Sửa</Button>
                  <Button onClick={() => handleDeletePromotion(promotion.id)} color="error">
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog cho Thêm/Sửa Khuyến Mãi */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedPromotion ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Khuyến Mãi"
            fullWidth
            value={selectedPromotion ? selectedPromotion.name : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, name: e.target.value })}
          />
          <TextField
            label="Mô Tả"
            fullWidth
            value={selectedPromotion ? selectedPromotion.description : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, description: e.target.value })}
          />
          <TextField
            label="Thời Gian Bắt Đầu"
            type="date"
            fullWidth
            value={selectedPromotion ? selectedPromotion.startDate : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Thời Gian Kết Thúc"
            type="date"
            fullWidth
            value={selectedPromotion ? selectedPromotion.endDate : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Loại Khuyến Mãi</InputLabel>
            <Select
              value={selectedPromotion ? selectedPromotion.type : ''}
              onChange={(e) => setSelectedPromotion({ ...selectedPromotion, type: e.target.value })}
            >
              <MenuItem value="Giảm Giá">Giảm Giá</MenuItem>
              <MenuItem value="Tặng Sản Phẩm">Tặng Sản Phẩm</MenuItem>
              <MenuItem value="Miễn Phí Vận Chuyển">Miễn Phí Vận Chuyển</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Giá Trị"
            fullWidth
            value={selectedPromotion ? selectedPromotion.value : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, value: e.target.value })}
          />
          <TextField
            label="Ghi Chú"
            fullWidth
            value={selectedPromotion ? selectedPromotion.notes : ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, notes: e.target.value })}
          />
          <FormControl fullWidth style={{ marginTop: '16px' }}>
            <InputLabel>Trạng Thái</InputLabel>
            <Select
              value={selectedPromotion ? selectedPromotion.active : true}
              onChange={(e) => setSelectedPromotion({ ...selectedPromotion, active: e.target.value })}
            >
              <MenuItem value={true}>Hiệu lực</MenuItem>
              <MenuItem value={false}>Không hiệu lực</MenuItem>
            </Select>
          </FormControl>
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
