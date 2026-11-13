import api from './api';

export const reservationsApi = {
  list: (params = {}) => api.get('/reservations', { params }),
  get: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
};
