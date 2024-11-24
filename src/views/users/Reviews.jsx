import React, { useEffect, useState } from 'react';
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
  DialogActions
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AxiosInstance from 'helper/AxiosInstance';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [pendingreviews, setpendingreviews] = useState([]);
  const [violatereviews, setviolatereviews] = useState([]);
  const [successReviews, setsuccessReviews] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpenDialog = (order) => {
    setSelectedReview(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
    const filtered = value === 'all' ? reviews : reviews.filter((review) => review.status === value);
    setReviews(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await AxiosInstance().get('/reviews/get-all-reviews');
      if (response.status) {
        setReviews(response.data);
      }
      try {
      } catch (error) {
        console.log('Không lấy được đánh giá', error);
      }
    };
    fetchData();
  }, []);

  console.log('response=====>', reviews);

  return (
    <MainCard title="QUẢN LÝ ĐÁNH GIÁ">
      <div>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Chờ Duyệt</Typography>
              <Typography variant="h4">{pendingreviews.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Hợp Lệ</Typography>
              <Typography variant="h4">{successReviews.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Vi Phạm</Typography>
              <Typography variant="h4">{violatereviews.length}</Typography>
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
              {reviews.map((review, index) => (
                <TableRow key={review._id}>
                  <TableCell>{index}</TableCell>
                  <TableCell>
                    {
                      // Lọc lấy link ảnh từ danh sách assets
                      review?.product_id?.assets && review.product_id.assets.length > 0 ? (
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
                      )
                    }
                  </TableCell>

                  <TableCell>{review?.product_id?.name}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span>Tên: {review?.reviewer_id?.name}</span>
                      <span>Email: {review?.reviewer_id?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(review)}>Xem chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog cho Chi Tiết Đánh Giá */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi Tiết Đánh Giá</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Mã Đánh Giá" fullWidth value={selectedReview._id && selectedReview._id.toUpperCase()} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Tên Khách Hàng" fullWidth value={selectedReview?.reviewer_id?.name} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Rating" fullWidth value={selectedReview?.rating} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Trạng Thái" fullWidth value={selectedReview.status} disabled />
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
              </Grid>

              <Grid item xs={12}>
                {selectedReview.status === 'pending' && (
                  <div>
                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      Duyệt
                    </Button>
                    <Button variant="contained" color="secondary" sx={{ marginRight: 1 }}>
                      Ẩn đánh giá
                    </Button>
                    {!selectedReview?.response?.content && (
                      <Button variant="contained" color="secondary">
                        Phản hồi
                      </Button>
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Review;
