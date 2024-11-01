import axios from 'axios';

const AxiosInstance = (contentType = 'application/json') => {
  const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.7:3000/'
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token');
      console.log(token);
      // const token = '';
      config.headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': contentType
      };

      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res.data,
    (err) => {
      return Promise.reject(err);
    }
  );
  return axiosInstance;
};

export default AxiosInstance;
