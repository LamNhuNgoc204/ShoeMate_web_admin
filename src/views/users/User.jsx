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
  MenuItem
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { ROLE } from 'constants/mockData';
import { getAllUsers } from 'api/getAllData';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRole, setOpenDialogRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [role, setRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getAllUsers();
      if (!response) {
        setSnackbarMessage('Lay danh sach người dùng failed!');
        setSnackbarOpen(true);
      }
      setUsers(response.data);
    };

    fetchUserData();
  }, []);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    // Thêm người dùng mới
    const newUser = {
      _id: (users.length + 1).toString(),
      email: '',
      phoneNumber: '',
      name: '',
      role: 'user'
    };
    setUsers([...users, { ...newUser }]);
    setSnackbarMessage('Thêm người dùng thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleOpenDialogRole = (user) => {
    setRole(user.role);
    setOpenDialogRole(true);
  };

  const handleSaveRole = async () => {};
  console.log('role', role);

  return (
    <MainCard title="QUẢN LÝ NGƯỜI DÙNG">
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
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
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber || 'No phone number'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialogRole(user)}>Chỉnh Sửa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog cho thêm/chỉnh sửa người dùng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            value={selectedUser ? selectedUser.email : ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <TextField
            label="Tên"
            fullWidth
            value={selectedUser ? selectedUser.name : ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            style={{ marginTop: '10px' }}
          />
          <TextField
            label="Số Điện Thoại"
            fullWidth
            value={selectedUser ? selectedUser.phoneNumber : ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
            style={{ marginTop: '10px' }}
          />
          <FormControl fullWidth style={{ marginTop: '10px' }}>
            <InputLabel>Vai Trò</InputLabel>
            <Select
              label="Vai Trò"
              value={selectedUser ? selectedUser.role : ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            >
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
        <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
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
