import api from './api';

export const paymentsApi = {
  list: (params = {}) => api.get('/payments', { params }),
  get: (id) => api.get(`/payments/${id}`),
  summary: () => api.get('/payments/summary'),
};
