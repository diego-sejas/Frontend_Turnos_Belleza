import api from './api';

export const worksApi = {
  list: (params = {}) => api.get('/works', { params }),
  get: (id) => api.get(`/works/${id}`),
  create: (data) => api.post('/works', data),
  update: (id, data) => api.put(`/works/${id}`, data),
  delete: (id) => api.delete(`/works/${id}`),
};
