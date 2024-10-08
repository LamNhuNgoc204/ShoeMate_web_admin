import React, { useState, useEffect } from 'react';
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
  InputLabel
} from '@mui/material';
import axios from 'axios';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [voucherData, setVoucherData] = useState({
    discount_value: '',
    voucher_name: '',
    quantity: 1,
    voucher_image: '',
    voucher_code: '',
    expiry_date: '',
    min_order_value: '',
    max_discount_value: '',
    usage_scope: '',
    status: 'active',
    isInMiniGame: false
  });

  const sampleVouchers = [
    // ... (your sample data)
  ];

  useEffect(() => {
    setVouchers(sampleVouchers);
  }, []);

  const handleOpenDialog = (voucher = null) => {
    setIsEditing(!!voucher);
    setVoucherData(
      voucher || {
        discount_value: '',
        voucher_name: '',
        quantity: 1,
        voucher_image: '',
        voucher_code: '',
        expiry_date: '',
        min_order_value: '',
        max_discount_value: '',
        usage_scope: '',
        status: 'active',
        isInMiniGame: false
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVoucherData({ ...voucherData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVoucherData({ ...voucherData, voucher_image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in voucherData) {
      formData.append(key, voucherData[key]);
    }

    if (isEditing) {
      await axios.put(`/api/vouchers/${voucherData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      await axios.post('/api/vouchers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    setOpenDialog(false);
    setVoucherData({});
    const response = await axios.get('/api/vouchers');
    setVouchers(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/vouchers/${id}`);
    const response = await axios.get('/api/vouchers');
    setVouchers(response.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản Lý Khuyến Mãi và Voucher</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '20px' }}>
        Thêm Voucher Mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Voucher</TableCell>
              <TableCell>Giá Trị Giảm Giá</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Mã Voucher</TableCell>
              <TableCell>Ngày Hết Hạn</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell>{voucher.voucher_name}</TableCell>
                <TableCell>{voucher.discount_value}</TableCell>
                <TableCell>{voucher.quantity}</TableCell>
                <TableCell>{voucher.voucher_code}</TableCell>
                <TableCell>{new Date(voucher.expiry_date).toLocaleDateString()}</TableCell>
                <TableCell>{voucher.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(voucher)}>Sửa</Button>
                  <Button onClick={() => handleDelete(voucher._id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog cho Thêm/Sửa Voucher */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Sửa Voucher' : 'Thêm Voucher'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên Voucher"
                fullWidth
                name="voucher_name"
                value={voucherData.voucher_name}
                onChange={handleInputChange}
                placeholder="Nhập tên voucher"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị Giảm Giá"
                fullWidth
                type="number"
                name="discount_value"
                value={voucherData.discount_value}
                onChange={handleInputChange}
                placeholder="Nhập giá trị giảm giá"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Số Lượng"
                fullWidth
                type="number"
                name="quantity"
                value={voucherData.quantity}
                onChange={handleInputChange}
                placeholder="Nhập số lượng"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mã Voucher"
                fullWidth
                name="voucher_code"
                value={voucherData.voucher_code}
                onChange={handleInputChange}
                placeholder="Nhập mã voucher"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Ngày Hết Hạn</InputLabel>
              <TextField
                fullWidth
                type="date"
                name="expiry_date"
                value={voucherData.expiry_date.split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị Đơn Hàng Tối Thiểu"
                fullWidth
                type="number"
                name="min_order_value"
                value={voucherData.min_order_value}
                onChange={handleInputChange}
                placeholder="Nhập giá trị đơn hàng tối thiểu"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá Trị Giảm Giá Tối Đa"
                fullWidth
                type="number"
                name="max_discount_value"
                value={voucherData.max_discount_value}
                onChange={handleInputChange}
                placeholder="Nhập giá trị giảm giá tối đa"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phạm Vi Sử Dụng"
                fullWidth
                name="usage_scope"
                value={voucherData.usage_scope}
                onChange={handleInputChange}
                placeholder="Nhập phạm vi sử dụng"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Trạng Thái"
                fullWidth
                select
                name="status"
                value={voucherData.status}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
              >
                <option value="active">Kích hoạt</option>
                <option value="inactive">Không kích hoạt</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" type="file" onChange={handleFileChange} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Chơi Mini Game"
                fullWidth
                select
                name="isInMiniGame"
                value={voucherData.isInMiniGame}
                onChange={(e) => setVoucherData({ ...voucherData, isInMiniGame: e.target.value === 'true' })}
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
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoucherManagement;
