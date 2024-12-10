import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Avatar, Typography, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
import { TabContext, TabPanel } from '@mui/lab';
import { updateInfor } from 'api/updateData';
import { uploadToCloundinary } from 'functions/processingFunction';

const AccountSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.users);
  const user = state.users.user;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState('success');

  // Local state for form fields
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
    if (!phoneRegex.test(phone)) {
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
          setSeveritySnackbar('success');
          setSnackbarMessage('Cập nhật thông tin thành công!');
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.log('Lỗi cập nhật: ', error);
        setSeveritySnackbar('error');
        setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!');
        setOpenSnackbar(true);
      }
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newavatar = await uploadToCloundinary(file);
      setAvatar(newavatar);
      // const reader = new FileReader();
      // reader.onload = () => setAvatar(reader.result);
      // reader.readAsDataURL(file);
    }
  };

  console.log('avatar==>', avatar);

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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

        <TabPanel value="1">
          <Typography variant="h6" align="center">
            Nội dung Tab 2
          </Typography>
        </TabPanel>

        <TabPanel value="2">
          <Typography variant="h6" align="center">
            Nội dung Tab 3
          </Typography>
        </TabPanel>
      </TabContext>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={severitySnackbar} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default AccountSettings;
