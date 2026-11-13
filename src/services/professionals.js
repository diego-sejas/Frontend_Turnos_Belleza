import api from './api';

export const professionalsApi = {
  list: (params = {}) => api.get('/professionals', { params }),
  get: (id) => api.get(`/professionals/${id}`),
  create: (data) => api.post('/professionals', data),
  update: (id, data) => api.put(`/professionals/${id}`, data),
  delete: (id) => api.delete(`/professionals/${id}`),
};