import AxiosInstance from 'helper/AxiosInstance';

export const createSize = async (name) => {
  try {
    if (!name) {
      console.log('name required');
    }
    const response = await AxiosInstance().post('/sizes/add-new-size', { name });
    if (!response) {
      console.log('lOI: KHONG TAO DUOC SIZE');
    }
    return response;
  } catch (error) {
    console.error('error size: ', error);
  }
};
