import api from './api';

export const clientsApi = {
  list: (params = {}) => api.get('/clients', { params }),
  get: (id) => api.get(`/clients/${id}`),
};
