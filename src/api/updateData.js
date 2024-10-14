import AxiosInstance from 'helper/AxiosInstance';

export const updateLogoBrand = async (brandId, image) => {
  const response = await AxiosInstance().put(`/brands/update-brands/${brandId}`, { image });
  return response;
};
