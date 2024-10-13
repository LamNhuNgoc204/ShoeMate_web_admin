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

export const createCate = async (body) => {
  try {
    const response = await AxiosInstance().post('/categories/create-category', body);
    if (!response) {
      console.log('lOI: KHONG TAO DUOC Category');
    }
    return response;
  } catch (error) {
    console.error('error category: ', error);
  }
};
