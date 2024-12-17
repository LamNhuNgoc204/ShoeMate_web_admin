import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AxiosInstance from 'helper/AxiosInstance';
import Swal from 'sweetalert2';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [content, setContent] = useState(
    'Cảm ơn quý khách đã tin tưởng và sử dụng sản phẩm/dịch vụ của ShoeMate.\n' +
      'ShoeMate rất trân trọng ý kiến đóng góp của quý khách và sẽ nỗ lực cải thiện dịch vụ để mang lại trải nghiệm tốt nhất. Nếu có bất kỳ vấn đề nào, xin vui lòng liên hệ với chúng tôi qua 0123456789 hoặc shoemate@gmail.com để được hỗ trợ kịp thời.'
  );
  const [loading, setloading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenDialog = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const response = await AxiosInstance().get('/reviews/get-all-reviews');
        if (response.status) {
          setReviews(response?.data?.reverse());
          setFilteredReviews(response?.data?.reverse());
        }
      } catch (error) {
        console.log('Không lấy được đánh giá', error);
      }
      setloading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updatedReviews = filterStatus === 'all' ? reviews : reviews.filter((review) => review.status === filterStatus);
    setFilteredReviews(updatedReviews);
  }, [filterStatus, reviews]);

  const paginatedReviews = filteredReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleUpdateStatus = async (status) => {
    try {
      const response = await AxiosInstance().put(`/reviews/update-review-status/${selectedReview._id}`, { status: status });
      if (response.status) {
        setReviews((prevReviews) =>
          prevReviews.map((review) => (review._id === selectedReview._id ? { ...review, status: status } : review))
        );

        setFilteredReviews((prevFilteredReviews) =>
          prevFilteredReviews.map((review) => (review._id === selectedReview._id ? { ...review, status: status } : review))
        );
      }
      if (status === 'approved') {
        Swal.fire({
          title: 'Thông báo!',
          text: 'Đánh giá đã được duyệt!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      }
      if (status === 'rejected') {
        Swal.fire({
          title: 'Thông báo!',
          text: 'Đánh giá đã bị ẩn!',
          icon: 'success',
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

  const handleResponseReview = async () => {
    try {
      const response = await AxiosInstance().put(`/reviews/respondtoreview/${selectedReview._id}`, {
        content: content
      });

      if (response.status) {
        const updatedReview = {
          ...selectedReview,
          response: {
            ...selectedReview.response,
            content: content
          }
        };

        setSelectedReview(updatedReview);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === selectedReview._id ? { ...review, response: { ...review.response, content: content } } : review
          )
        );
        setSnackbarMessage('Phản hồi thành công!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <MainCard title="QUẢN LÝ ĐÁNH GIÁ">
      <div>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Chờ Duyệt</Typography>
              <Typography variant="h4">{reviews.filter((r) => r.status === 'pending').length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Hợp Lệ</Typography>
              <Typography variant="h4">{reviews.filter((r) => r.status === 'approved').length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Vi Phạm</Typography>
              <Typography variant="h4">{reviews.filter((r) => r.status === 'rejected').length}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <Grid item xs={24} md={4} style={{ marginBlock: 20 }}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Trạng Thái</InputLabel>
              <Select labelId="filter-label" value={filterStatus} onChange={handleFilterChange}>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="rejected">Vi phạm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </FormControl>
      </div>

      <>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h4">Duyệt Đánh Giá</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Người Dùng</TableCell>
                    <TableCell>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.map((review, index) => (
                    <TableRow key={review._id}>
                      <TableCell>{index + 1 + (currentPage - 1) * pageSize}</TableCell>
                      <TableCell>
                        {review?.product_id?.assets && review.product_id.assets.length > 0 ? (
                          (() => {
                            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
                            const images = review.product_id.assets.filter((asset) => {
                              const extension = asset.split('.').pop().toLowerCase();
                              return imageExtensions.includes(extension);
                            });

                            const imageSrc =
                              images.length > 0 ? images[0] : 'https://i.pinimg.com/736x/b4/0a/b2/b40ab2c7bb076494734828022251bce8.jpg';

                            return <img style={{ width: '70px', height: '70px', borderRadius: '5px' }} src={imageSrc} alt="product" />;
                          })()
                        ) : (
                          <img
                            style={{ width: '70px', height: '70px', borderRadius: '5px' }}
                            src="https://i.pinimg.com/736x/b4/0a/b2/b40ab2c7bb076494734828022251bce8.jpg"
                            alt="default"
                          />
                        )}
                      </TableCell>

                      <TableCell>{review?.product_id?.name}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span>Tên: {review?.reviewer_id?.name}</span>
                          <span>Email: {review?.reviewer_id?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(review)}>
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                count={Math.ceil(filteredReviews.length / pageSize)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
              />
            </TableContainer>
          </Box>
        )}
      </>

      {/* Dialog cho Chi Tiết Đánh Giá */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle variant="contained" color="primary">
          Chi Tiết Đánh Giá
        </DialogTitle>
        <DialogContent style={{ marginBottom: 10 }}>
          {selectedReview && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedReview?.reviewer_id?.name} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={4}
                  maxRows={8}
                  label="Nội dung"
                  fullWidth
                  value={selectedReview?.comment || 'Không có nội dung'}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Rating" fullWidth value={selectedReview?.rating} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Trạng Thái"
                  fullWidth
                  value={
                    selectedReview.status === 'pending'
                      ? 'Đang chờ duyệt'
                      : selectedReview.status === 'rejected'
                        ? 'Bị ẩn'
                        : 'Đã được duyệt'
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Ngày Đánh Giá" fullWidth value={new Date(selectedReview.createdAt).toLocaleDateString()} disabled />
              </Grid>
              <Grid item xs={12}>
                <div>Hình ảnh</div>
                <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {selectedReview?.images &&
                    selectedReview?.images.map((asset, index) => {
                      const extension = asset.split('.').pop().toLowerCase();
                      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
                        return (
                          <img
                            key={index}
                            src={asset}
                            alt={`asset-${index}`}
                            style={{ width: '100px', height: '100px', borderRadius: '5px', objectFit: 'cover' }}
                          />
                        );
                      } else if (['mp4', 'webm', 'ogg', 'avi'].includes(extension)) {
                        return (
                          <video
                            key={index}
                            src={asset}
                            controls
                            style={{ width: '100px', height: '100px', borderRadius: '5px', objectFit: 'cover' }}
                          />
                        );
                      }
                      return null;
                    })}
                </div>
                <Grid item xs={12}>
                  {selectedReview?.response?.content ? (
                    <TextField
                      label="Đã phản hồi"
                      fullWidth
                      value={selectedReview.response.content}
                      sx={{ marginTop: 3 }}
                      multiline
                      disabled
                    />
                  ) : (
                    <div style={{ marginTop: '10px' }}>
                      <TextField
                        label="Phản hồi"
                        fullWidth
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ marginBottom: 2, marginTop: 3 }}
                        multiline
                      />
                      <Button onClick={() => handleResponseReview()} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                        Gửi phản hồi
                      </Button>
                    </div>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {selectedReview.status === 'pending' && (
                  <div>
                    <Button onClick={() => handleUpdateStatus('approved')} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      Duyệt
                    </Button>
                    <Button onClick={() => handleUpdateStatus('rejected')} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      Ẩn đánh giá
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default Review;
