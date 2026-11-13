import api from './api';

export const schedulesApi = {
  list: (params = {}) => api.get('/schedules', { params }),
  getByProfessional: (professionalId, params = {}) => api.get(`/schedules/professional/${professionalId}`, { params }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};
