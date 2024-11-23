import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getBestSellingProducts } from 'api/dashboard';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getBestSellingProducts();
        if (response.status) {
          setProducts(response.data); // Set the fetched data
        }
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {isLoading || products.length === 0 ? ( // Check if loading or products are empty
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Sản phẩm bán chạy nhất</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard data={products} />
              </Grid>
              {products.map((product) => (
                <Grid item xs={12} key={product._id}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" color="inherit" style={{ width: 150 }}>
                            {product.productName}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {`Số lượng: ${product.totalSold}`} {/* Example price calculation */}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '5px',
                                  bgcolor: product.totalSold > 0 ? 'success.light' : 'orange.light',
                                  color: product.totalSold > 0 ? 'success.dark' : 'orange.dark',
                                  ml: 2
                                }}
                              >
                                {product.totalSold > 0 ? (
                                  <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                ) : (
                                  <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                )}
                              </Avatar>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <Grid item>
                      <Typography variant="subtitle2" sx={{ color: product.totalSold > 0 ? 'success.dark' : 'orange.dark' }}>
                        {product.totalSold > 0 ? 'Profit' : 'Loss'}
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Divider sx={{ my: 1.5 }} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              Xem tất cả
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
