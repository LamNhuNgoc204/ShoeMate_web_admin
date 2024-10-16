import AxiosInstance from 'helper/AxiosInstance';

export const updateLogoBrand = async (brandId, image) => {
  const response = await AxiosInstance().put(`/brands/update-brands/${brandId}`, { image });
  return response;
};

export const updateCate = async (categoryId, name, image, description) => {
  const response = await AxiosInstance().put(`/categories/update-category/${categoryId}`, { name, image, description });
  return response;
};

export const updateRole = async (role) => {
  const response = await AxiosInstance().put(`/users/update-role`, { role });
  return response;
};
