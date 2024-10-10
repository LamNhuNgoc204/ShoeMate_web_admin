import AxiosInstance from 'helper/AxiosInstance';

export const getAllBrands = async () => {
  const response = await AxiosInstance().get('/products/list-brands');
  return response;
};

export const getAllCategories = async () => {
  const response = await AxiosInstance().get('/products/list-categories');
  return response;
};
