import AxiosInstance from 'helper/AxiosInstance';

export const getStats = async (params) => {
  try {
    const response = await AxiosInstance().get('/stats', { params });
    return response;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

export const getBestSellingProducts = async (params) => {
  try {
    const response = await AxiosInstance().get('/stats/best-selling-products', { params });
    return response;
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    throw error;
  }
};

export const getRevenueByProduct = async (params) => {
  try {
    const response = await AxiosInstance().get('/stats', { params });
    return response;
  } catch (error) {
    console.error('Error fetching revenue by product:', error);
    throw error;
  }
};
