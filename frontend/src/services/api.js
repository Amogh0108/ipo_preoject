import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

export const ipoAPI = {
  getAll: (params) => api.get('/ipos', { params }),
  getById: (id) => api.get(`/ipos/${id}`),
  getActive: () => api.get('/ipos/active'),
  getUpcoming: () => api.get('/ipos/upcoming'),
  create: (data) => api.post('/ipos', data),
  update: (id, data) => api.put(`/ipos/${id}`, data),
  delete: (id) => api.delete(`/ipos/${id}`)
};

export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data)
};

export const transactionAPI = {
  getMyTransactions: (params) => api.get('/transactions/my-transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  getAll: (params) => api.get('/transactions', { params })
};

export const marketDataAPI = {
  getStockQuote: (symbol) => api.get(`/market-data/quote/${symbol}`),
  getCompanyProfile: (symbol) => api.get(`/market-data/profile/${symbol}`),
  getMarketStatus: () => api.get('/market-data/market-status'),
  getIPOCalendar: (params) => api.get('/market-data/ipo-calendar', { params }),
  getAggregatedData: (symbol) => api.get(`/market-data/aggregated/${symbol}`)
};

export default api;
