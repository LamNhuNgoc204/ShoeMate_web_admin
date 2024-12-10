import AxiosInstance from 'helper/AxiosInstance';

export const createNewUser = async (email, password, name, phoneNumber, role) => {
  try {
    const body = {
      email,
      password,
      name,
      phoneNumber,
      role
    };
    const response = await AxiosInstance().post('/users/add-new-user', body);
    return response;
  } catch (error) {
    console.log('Add new user error: ', error);
  }
};

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

export const createNewBrand = async (body) => {
  try {
    const response = await AxiosInstance().post('/brands/add-new-brand', body);
    if (!response) {
      console.log('lOI: KHONG TAO DUOC Brands');
    }
    return response;
  } catch (error) {
    console.error('error category: ', error);
  }
};

export const addShipping = async (body) => {
  try {
    const response = await AxiosInstance().post('/ship/shipping-companies', body);
    if (!response) {
      console.log('Lỗi không tạo được đvvc mới');
    }
    return response;
  } catch (error) {
    console.error('error add new ship: ', error);
  }
};
