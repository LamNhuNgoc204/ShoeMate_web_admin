import AxiosInstance from 'helper/AxiosInstance';

export const addVoucher = async (body) => {
  try {
    const response = await AxiosInstance().post('/vouchers/add', body);
    return response;
  } catch (error) {
    console.log('add vourcher error: ', error);
  }
};

export const getListVoucher = async () => {
  try {
    const response = await AxiosInstance().get('/vouchers/list');
    return response;
  } catch (error) {
    console.log('get vourcher error: ', error);
  }
};

export const updateVoucher = async (id, body) => {
  try {
    const response = await AxiosInstance().put(`/vouchers/update/${id}`, body);
    return response;
  } catch (error) {
    console.log('add vourcher error: ', error);
  }
};
