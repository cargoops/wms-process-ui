import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod',
  headers: {
    'x-api-key': 'admin-key-4f64a285-f790-490c-882e-f836d730ba5e',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    // OPTIONS 요청에 대한 처리
    if (config.method === 'options') {
      config.headers['Access-Control-Request-Method'] = 'GET,POST,PUT,DELETE,OPTIONS';
      config.headers['Access-Control-Request-Headers'] = 'x-api-key,content-type,accept';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('응답 에러:', error.response);
    } else if (error.request) {
      console.error('요청 에러:', error.request);
    } else {
      console.error('에러 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 