import api from './api';

const ABSOLUTE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

export const imageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ABSOLUTE_BASE}${path}`;
};

export const imagesApi = {
  upload: (file) => {
    const contentType = file.type || 'application/octet-stream';
    return api.post('/images', file, {
      headers: { 'Content-Type': contentType },
    });
  },
  remove: (id) => api.delete(`/images/${id}`),
};
