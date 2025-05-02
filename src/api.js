import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.107:8001/api',
  timeout: 5000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (config.tokenRequired) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (config.tokenOptional && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  const isLoginRequest = error.config?.headers?.['X-Login-Request'];

  if (error.response && error.response.status === 401 &&  !isLoginRequest) {
    
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userid');
  }

  return Promise.reject(error);
});

export default api;
