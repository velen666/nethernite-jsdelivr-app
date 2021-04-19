import axios from 'axios';

let config = {
  baseURL: 'https://data.jsdelivr.com/v1/'
};

const http = axios.create(config);

const loggerInterceptor = config => {
  return config;
}

http.interceptors.request.use(loggerInterceptor);

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
