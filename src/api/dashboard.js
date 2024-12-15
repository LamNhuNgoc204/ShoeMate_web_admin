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


export const getLowStock = async (params) => {
  try {
    const response = await AxiosInstance().get('/stats/low-stock');
    return response;
  } catch (error) {
    console.error('Error fetching revenue by product:', error);
    throw error;
  }
};

export const getRegistrationStats = async (period) => {
  try {
    const response = await AxiosInstance().get(`/stats/get-registration?type=${period}`);
    return response;
  } catch (error) {
    console.error('Error fetching revenue by product:', error);
    throw error;
  }
};