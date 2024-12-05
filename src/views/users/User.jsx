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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Modal,
  DialogContentText
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { ROLE } from 'constants/mockData';
import { getAllUsers } from 'api/getAllData';
import { updateRole } from 'api/updateData';
import { createNewUser } from 'api/createNew';
import AxiosInstance from 'helper/AxiosInstance';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRole, setOpenDialogRole] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getAllUsers();
      if (!response) {
        setSnackbarMessage('Lay danh sach người dùng failed!');
        setSnackbarOpen(true);
      }
      setUsers(response.data);
      setFilteredUsers(response.data);
    };

    fetchUserData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEmail('');
    setNewPass('');
    setNewName('');
    setNewPhone('');
    setNewRole('');
  };

  const checkEmailExists = (email) => {
    const user = users.find((user) => user.email === email);
    return !!user;
  };

  const checkPass = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const checkPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSaveUser = async () => {
    if (!newEmail || !newPass || !newRole) {
      setSnackbarMessage('Khong duoc de trong!');
      setSnackbarSeverity('error');
    }

    try {
      const response = await createNewUser(newEmail, newPass, newName, newPhone, newRole);
      if (response.status) {
        setSnackbarMessage('Thêm người dùng thành công!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Thêm người dùng failed!');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Xay ra loi, thu lai sau!');
      setSnackbarSeverity('success');
    } finally {
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleOpenDialogRole = (user) => {
    setRole(user.role);
    setUserId(user._id);
    setOpenDialogRole(true);
  };

  const handleSaveRole = async () => {
    try {
      const response = await updateRole(userId, role);
      if (response.status) {
        setSnackbarMessage('Cap nhat thanh cong');
      } else {
        setSnackbarMessage('Ban khong co quyen su dung chuc nang nay');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setSnackbarMessage('Xảy ra lỗi khi cập nhật vai trò');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setOpenDialogRole(false);
    }
  };

  // Xử lý tìm kiếm người dùng
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(e.target.value.toLowerCase()) || user.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Xử lý phân trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleLockAccount = async (user) => {
    try {
      const response = await AxiosInstance().put(`/users/lock-accound/${user._id}`);
      if (response.status) {
        setSnackbarMessage(`Tải khoản của ${user.name} đã bị khóa`);
        setSnackbarSeverity('success');
        const updatedUsers = users.map((u) => (u._id === user._id ? { ...u, isActive: false } : u));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        handleDialogClose();
      }
    } catch (error) {
      setSnackbarMessage('Xảy ra lỗi khi cập nhật vai trò');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setOpenDialogRole(false);
      handleDialogClose();
    }
  };

  return (
    <MainCard title="QUẢN LÝ NGƯỜI DÙNG">
      <TextField label="Tìm kiếm người dùng" fullWidth value={searchTerm} onChange={handleSearch} style={{ marginBottom: '20px' }} />

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Thêm Người Dùng
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Vai Trò</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <TableRow key={index + 1}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber || 'No phone number'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialogRole(user)}>Sửa</Button>
                  {user.isActive === true ? (
                    <>
                      <Button onClick={handleDialogOpen}>Khóa tài khoản</Button>
                      {/* Dialog xác nhận */}
                      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
                          Xác nhận khóa tài khoản
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>Bạn có chắc chắn muốn khóa tài khoản của {user.name}?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color="secondary">
                            Hủy
                          </Button>
                          <Button onClick={() => handleLockAccount(user)} color="primary" variant="contained">
                            Xác nhận
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>Đã khóa</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </TableContainer>

      {/* Dialog cho thêm/chỉnh sửa người dùng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thêm Người Dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            onBlur={() => {
              if (checkEmailExists(newEmail)) {
                setEmailError(true);
                setEmailHelperText('Email đã tồn tại trong hệ thống!');
              } else {
                setEmailError(false);
                setEmailHelperText('');
              }
            }}
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={emailError}
            helperText={emailHelperText}
          />
          <TextField
            label="Password"
            onBlur={() => {
              if (!checkPass(newPass)) {
                setPasswordError(true);
                setPasswordHelperText('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!');
              } else {
                setPasswordError(false);
                setPasswordHelperText('');
              }
            }}
            error={passwordError}
            helperText={passwordHelperText}
            fullWidth
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            style={{ marginTop: '10px' }}
          />
          <TextField label="Tên" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} style={{ marginTop: '10px' }} />
          <TextField
            label="Số Điện Thoại"
            fullWidth
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            style={{ marginTop: '10px' }}
            onBlur={() => {
              if (!checkPhoneNumber(newPhone)) {
                setPhoneError(true);
                setPhoneHelperText('Số điện thoại không hợp lệ!');
              } else {
                setPhoneError(false);
                setPhoneHelperText('');
              }
            }}
            error={phoneError}
            helperText={phoneHelperText}
          />
          <FormControl fullWidth style={{ marginTop: '10px' }}>
            <InputLabel>Vai Trò</InputLabel>
            <Select label="Vai Trò" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              {ROLE.map((item) => {
                return <MenuItem value={item}>{item}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button onClick={handleSaveUser} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chinh sua role */}
      <Dialog open={openDialogRole} onClose={() => setOpenDialogRole(false)}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Chỉnh Sửa Người Dùng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginTop: '10px' }}>
            <InputLabel>Vai Trò</InputLabel>
            <Select label="Vai Trò" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLE.map((item) => {
                return <MenuItem value={item}>{item}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogRole(false)}>Đóng</Button>
          <Button onClick={handleSaveRole} color="primary">
            Lưu
          </Button>
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

export default UserManagement;
