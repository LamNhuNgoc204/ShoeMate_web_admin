import AxiosInstance from 'helper/AxiosInstance';

export const updateLogoBrand = async (brandId, image) => {
  const response = await AxiosInstance().put(`/brands/update-brands/${brandId}`, { image });
  return response;
};

export const updateCate = async (categoryId, name, image, description) => {
  const response = await AxiosInstance().put(`/categories/update-category/${categoryId}`, { name, image, description });
  return response;
};

export const updateRole = async (userId, role) => {
  const response = await AxiosInstance().put(`/users/update-role/${userId}`, { role });
  return response;
};

export const deleteCate = async (categoryId) => {
  try {
    const response = await AxiosInstance().delete(`/categories/delete-category/${categoryId}`);
    if (response.status) {
      return response;
    }
  } catch (error) {
    console.log('Loi xoa danh muc', error);
  }
};

export const deleteBrand = async (brandId) => {
  try {
    const response = await AxiosInstance().delete(`/brands/delete-brand-by-id/${brandId}`);
    if (response.status) {
      return response;
    }
  } catch (error) {
    console.log('Loi xoa danh muc', error);
  }
};
