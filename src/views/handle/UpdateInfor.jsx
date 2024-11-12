import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Avatar, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';

const AccountSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.users);
  const user = state.users.user;

  // Local state for form fields
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: { name, phone, avatar }
    });
    navigate(-1); // Navigate back to profile section
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
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
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Stack>
    </Box>
  );
};

export default AccountSettings;
