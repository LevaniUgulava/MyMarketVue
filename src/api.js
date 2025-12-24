import axios from 'axios';


const api = axios.create({
  baseURL: '/api',         
  timeout: 5000,
  withCredentials: true,     
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (config._isLoginCall || config._isRefreshCall) return config;

  if (typeof config.headers?.set === 'function') {
    config.headers.set('Accept', 'application/json');
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers = {
      ...(config.headers || {}),
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  return config;
}, (error) => Promise.reject(error));

// RESPONSE interceptor (401 -> refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};

    if (original._isLoginCall || original._isRefreshCall) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // refresh ქუქით (HttpOnly) — ამიტომ withCredentials: true
        const { data } = await api.post(
          '/refresh',
          {},
          { withCredentials: true, _isRefreshCall: true }
        );

        const newAccess = data?.access_token;
        if (!newAccess) throw new Error('No access_token');

        localStorage.setItem('token', newAccess);

        // Retry request-ზე Authorization აუცილებლად set()-ით
        if (typeof original.headers?.set === 'function') {
          original.headers.set('Authorization', `Bearer ${newAccess}`);
          original.headers.set('Accept', 'application/json');
        } else {
          original.headers = {
            ...(original.headers || {}),
            Authorization: `Bearer ${newAccess}`,
            Accept: 'application/json',
          };
        }

        return api.request(original);
      } catch (e) {
        localStorage.removeItem('token');
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
