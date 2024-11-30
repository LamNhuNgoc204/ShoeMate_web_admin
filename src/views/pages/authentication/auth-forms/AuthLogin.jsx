import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from 'redux/thunks/userThunk';
import { Snackbar } from '@mui/material';

// ============================||  LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);

  console.log('User after login:', user);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'lamlamnhungoc@gmail.com',
          password: 'Ngoc@08012004',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Email không hợp lệ').max(255).required('Email là bắt buộc'),
          password: Yup.string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự in hoa')
            .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự thường')
            .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
            .max(30)
            .required('Mật khẩu là bắt buộc')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const result = await dispatch(logIn({ email: values.email, password: values.password })).unwrap();
            // Điều hướng tới trang home khi đăng nhập thành công
            console.log('data login', result);

            if (result.user.role === 'admin' || result.user.role === 'employee') {
              console.log('Admin login successful:', result.user.role);
              setSnackbarMessage('Đăng nhập thành công!');
              setSnackbarOpen(true);
              navigate('/dashboard');
            } else {
              console.log('Admin login successful:', result.user.role);
              console.log('Access denied. Not an admin.');
              setSnackbarMessage('Lỗi đăng nhập. Thử lại sau!');
              setSnackbarOpen(true);
              setErrors({ submit: 'Bạn không có quyền truy cập vào trang này.' });
            }
          } catch (error) {
            setErrors({ submit: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Mật khẩu</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Ghi nhớ tài khoản"
              />
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  style={{ backgroundColor: '#2196f3' }}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSubmit()}
                >
                  Đăng nhập
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </>
  );
};

export default AuthLogin;
