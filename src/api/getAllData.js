import AxiosInstance from 'helper/AxiosInstance';

export const getAllUsers = async () => {
  const response = await AxiosInstance().get('/users/get-all-user');
  return response;
};

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

export const getProductOfCate = async (categoryId) => {
  const response = await AxiosInstance().get(`/categories/get-product-of-cate/${categoryId}`);
  return response;
};

export const getSizeDetail = async (sizeId) => {
  const response = await AxiosInstance().get(`/sizes/get-products-by-sizeid/${sizeId}`);
  return response;
};

export const getShips = async () => {
  const response = await AxiosInstance().get(`/ship/get-shipping`);
  return response;
};

export const getPayments = async () => {
  const response = await AxiosInstance().get(`/payment-method/getall-payment`);
  return response;
};
