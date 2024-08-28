import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API, JWT_PREFIX } from '~/config/environment';
// import store from '~redux-store/store';
// import { forceLogOut, refreshToken } from '~redux-store/actions/authActions';
import { isExpired } from '../middlewares/jwt';

const apiClient = axios.create({
  baseURL: `${HOST_API}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// add Authorization
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = String(localStorage.getItem('token'));

    // eslint-disable-next-line
    //@ts-ignore
    config.headers.Authorization = JWT_PREFIX + ' ' + token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
// add Tenant
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const tenant_id = String(localStorage.getItem('tenant_id'));

    // eslint-disable-next-line
    //@ts-ignore
    config.headers['X-Tenant-ID'] = tenant_id;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// interceptors
apiClient.interceptors.response.use(
  (response: any) => {
    // refresh token
    if (isExpired()) {
      // store.dispatch(refreshToken())
      // eslint-disable-next-line no-console
      console.log('expire');
    }
    return response;
  },
  (error: any) => {
    const { response } = error;
    if (response?.status === 401 || response?.status === 412) {
      // token expired
      return; // Promise.reject(error);
    }

    if (response?.status === 403) {
      return; // Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

//generar interceptors

export default {
  get(url: any) {
    return apiClient.get(url);
  },
  post(url: any, params: any) {
    return apiClient.post(url, params);
  },
  put(url: any, params: any) {
    return apiClient.put(url, params);
  },
  delete(url: any) {
    return apiClient.delete(url);
  },
  patch(url: any, params: any) {
    return apiClient.patch(url, params);
  }
};
