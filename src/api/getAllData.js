import AxiosInstance from 'helper/AxiosInstance';

export const getAllBrands = async () => {
  const response = await AxiosInstance().get('/products/list-brands');
  return response;
};

export const getAllCategories = async () => {
  const response = await AxiosInstance().get('/products/list-categories');
  return response;
};

export const getAllSizes = async () => {
  const response = await AxiosInstance().get('/products/list-sizes');
  return response;
};

export const getProductOfBrand = async (brandId) => {
  const response = await AxiosInstance().get(`/brands/get-product-of-brand/${brandId}`);
  return response;
};
