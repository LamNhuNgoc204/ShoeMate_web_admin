import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const Review = () => {
  const pendingReviews = [
    { id: 1, content: 'Sản phẩm rất tốt!', user: 'Người dùng A' },
    { id: 2, content: 'Không như mong đợi.', user: 'Người dùng B' }
  ];

  const violationReviews = [
    { id: 1, content: 'Sản phẩm này là hàng giả!', user: 'Người dùng C' },
    { id: 2, content: 'Tôi bị lừa!', user: 'Người dùng D' }
  ];

  const productReviews = [
    { productId: 'SP001', reviews: ['Sản phẩm rất tốt!', 'Rất hài lòng!'] },
    { productId: 'SP002', reviews: ['Không như mong đợi.', 'Có thể tốt hơn.'] }
  ];

  const validReviews = [
    { id: 1, content: 'Sản phẩm chất lượng!', user: 'Người dùng E' },
    { id: 2, content: 'Tôi sẽ mua lại!', user: 'Người dùng F' }
  ];

  return (
    <MainCard title="QUẢN LÝ ĐÁNH GIÁ">
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4">Duyệt Đánh Giá</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nội Dung</TableCell>
                <TableCell>Người Dùng</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.content}</TableCell>
                  <TableCell>{review.user}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      Duyệt
                    </Button>
                    <Button variant="contained" color="secondary">
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4">Đánh Giá Vi Phạm</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nội Dung</TableCell>
                <TableCell>Người Dùng</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {violationReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.content}</TableCell>
                  <TableCell>{review.user}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary">
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4">Đánh Giá Sản Phẩm</Typography>
        {productReviews.map((product) => (
          <Box key={product.productId} sx={{ marginBottom: 2 }}>
            <Typography variant="h5">ID Sản Phẩm: {product.productId}</Typography>
            <ul>
              {product.reviews.map((review, index) => (
                <li key={index}>{review}</li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>

      <Box>
        <Typography variant="h4">Đánh Giá Hợp Lệ</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nội Dung</TableCell>
                <TableCell>Người Dùng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.content}</TableCell>
                  <TableCell>{review.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainCard>
  );
};

export default Review;
