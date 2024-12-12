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
  DialogContentText,
  CircularProgress,
  Pagination
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { ROLE } from 'constants/mockData';
import { getAllUsers } from 'api/getAllData';
import { updateRole } from 'api/updateData';
import { createNewUser } from 'api/createNew';
import AxiosInstance from 'helper/AxiosInstance';
import Swal from 'sweetalert2';

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
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setloading] = useState(false);

  const fetchUserData = async () => {
    try {
      setloading(true);
      const response = await getAllUsers();
      if (!response) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Xảy ta lỗi khi lấy danh sách người dùng!');
        setSnackbarOpen(true);
      }
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.log('Lỗi: ', error);
    }
    setloading(false);
  };

  useEffect(() => {
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
    setPasswordHelperText('');
    setEmailHelperText('');
    setPhoneHelperText('');
    setNameHelperText('');
  };

  const checkEmailExists = (email) => {
    const user = users.find((user) => user.email === email);
    return !!user;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const checkEmailRegex = (email) => {
    return emailRegex.test(email);
  };

  const checkPass = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const checkPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    if (!name) {
      return 'Tên không được để trống!';
    } else if (name.length < 3) {
      return 'Tên phải có ít nhất 3 ký tự!';
    } else if (/[^a-zA-Z\s]/.test(name)) {
      return 'Tên không được chứa số hoặc ký tự đặc biệt!';
    }
    return '';
  };

  const handleBlur = () => {
    const error = validateName(newName);
    if (error) {
      setNameError(true);
      setNameHelperText(error);
    } else {
      setNameError(false);
      setNameHelperText('');
    }
  };

  const handleSaveUser = async () => {
    if (!newEmail || !newPass || !newName) {
      setSnackbarMessage('Vui lòng không để trống email, tên, mật khẩu và vai trò!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (!newRole) {
      setSnackbarMessage('Vui lòng chọn vai trò!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await createNewUser(newEmail, newPass, newName, newPhone, newRole);
      if (response.status) {
        Swal.fire({
          title: 'Thông báo!',
          text: 'Thêm người dùng thành công!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        fetchUserData();
      } else {
        Swal.fire({
          title: 'Oops...',
          text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
          icon: 'error',
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
    } finally {
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
        setSnackbarMessage();
        Swal.fire({
          title: 'Thông báo!',
          text: 'Cập nhật vai trò thành công',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        setSnackbarMessage();
        Swal.fire({
          title: 'Oops...',
          text: 'Bạn không có quyền hạn sử dụng chức năng này!',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Swal.fire({
        title: 'Oops...',
        text: `Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
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
    setPage(1);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDialogOpen = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  // console.log('selectedUser', selectedUser);

  const handleDialogClose = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  const handleLockAccount = async (user) => {
    try {
      const response = await AxiosInstance().put(`/users/lock-accound/${user._id}`);
      if (response.status) {
        Swal.fire({
          title: 'Thông báo!',
          text: `Tài khoản của ${user.name} đã bị khóa`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        const updatedUsers = users.map((u) => (u._id === user._id ? { ...u, isActive: false } : u));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        handleDialogClose();
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
      setOpenDialogRole(false);
      handleDialogClose();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <MainCard title="QUẢN LÝ NGƯỜI DÙNG">
      <TextField label="Tìm kiếm người dùng" fullWidth value={searchTerm} onChange={handleSearch} style={{ marginBottom: '20px' }} />

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Thêm Người Dùng
      </Button>

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
                  <TableCell>Email</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Số Điện Thoại</TableCell>
                  <TableCell>Vai Trò</TableCell>
                  <TableCell>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((user, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phoneNumber || 'Chưa có số điện thoại'}</TableCell>
                    <TableCell>{user.role === 'user' ? 'Khách hàng' : user.role === 'employee' ? 'Nhân viên' : 'Quản lý'}</TableCell>
                    <TableCell>
                      {user.isActive === true && (
                        <Button variant="outlined" color="primary" onClick={() => handleOpenDialogRole(user)}>
                          Sửa
                        </Button>
                      )}

                      {user.isActive === true ? (
                        <>
                          <Button variant="outlined" color="error" style={{ marginLeft: 10 }} onClick={() => handleDialogOpen(user)}>
                            Khóa tài khoản
                          </Button>
                        </>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold', marginLeft: 10, textAlign: 'center' }}>Tài khoản đã bị khóa</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              count={Math.ceil(filteredUsers.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
            {/* <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang"
            /> */}
          </TableContainer>
        )}
      </>

      {/* Dialog cho thêm/chỉnh sửa người dùng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Thêm Người Dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            onBlur={() => {
              if (checkEmailExists(newEmail)) {
                setEmailError(true);
                setEmailHelperText('Email đã tồn tại trong hệ thống!');
              } else if (!checkEmailRegex(newEmail)) {
                setEmailError(true);
                setEmailHelperText('Email không đúng định dạng!');
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
          <TextField
            label="Tên"
            onBlur={handleBlur}
            error={nameError}
            helperText={nameHelperText}
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginTop: '10px' }}
          />
          <TextField
            label="Số Điện Thoại"
            fullWidth
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            style={{ marginTop: '10px' }}
            onBlur={() => {
              if (newPhone) {
                if (!checkPhoneNumber(newPhone)) {
                  setPhoneError(true);
                  setPhoneHelperText('Số điện thoại không hợp lệ!');
                }
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
                return <MenuItem value={item}>{item === 'user' ? 'Người dùng' : item === 'employee' ? 'Nhân viên' : 'Quản lý'}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Đóng
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveUser}>
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
              {/* 'admin', 'user', 'employee' */}
              {ROLE.map((item) => {
                return <MenuItem value={item}>{item === 'user' ? 'Người dùng' : item === 'employee' ? 'Nhân viên' : 'Quản lý'}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogRole(false)} variant="contained" color="primary">
            Đóng
          </Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Xác nhận khóa tài khoản</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn khóa tài khoản của {selectedUser?.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="primary">
            Hủy
          </Button>
          <Button onClick={() => handleLockAccount(selectedUser)} color="primary" variant="contained">
            Xác nhận
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
