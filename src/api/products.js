import AxiosInstance from 'helper/AxiosInstance';

export const getProducts = async () => {
  const response = await AxiosInstance().get('/products/list-products');
  return response;
};
