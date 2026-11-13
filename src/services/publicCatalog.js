import api from './api';

export const publicCatalogApi = {
  services: (params = {}) => api.get('/public/services', { params }),
  professionals: (params = {}) => api.get('/public/professionals', { params }),
  works: (params = {}) => api.get('/public/works', { params }),
};
