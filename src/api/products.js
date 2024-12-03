import AxiosInstance from 'helper/AxiosInstance';

export const getProducts = async () => {
  const response = await AxiosInstance().get('/products/list-products');
  return response;
};

export const updateProduct = async (productId, body) => {
  try {
    const response = await AxiosInstance().put(`/products/update/${productId}`, body);
    return response;
  } catch (error) {
    console.error('Lỗi cập nhật: ', error);
  }
};

export const addProduct = async (body) => {
  try {
    const response = await AxiosInstance().post(`/products/add`, body);
    return response;
  } catch (error) {
    console.error('Lỗi cập nhật: ', error);
  }
};

export const stopSellingPd = async (id, status) => {
  try {
    const response = await AxiosInstance().put(`/products/stop-selling/${id}`, { status });
    return response;
  } catch (error) {
    console.error('Lỗi cập nhật: ', error);
  }
};
