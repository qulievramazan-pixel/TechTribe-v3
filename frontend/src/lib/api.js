import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('techtribe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Catalogue
export const catalogueAPI = {
  getAll: (params) => api.get('/catalogue', { params }),
  getOne: (id) => api.get(`/catalogue/${id}`),
  create: (data) => api.post('/catalogue', data),
  update: (id, data) => api.put(`/catalogue/${id}`, data),
  delete: (id) => api.delete(`/catalogue/${id}`),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Messages (admin)
export const messagesAPI = {
  getAll: () => api.get('/messages'),
  markRead: (id) => api.put(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Chat
export const chatAPI = {
  send: (data) => api.post('/chat/send', data),
  history: (sessionId) => api.get(`/chat/history/${sessionId}`),
  conversations: () => api.get('/chat/conversations'),
  messages: (convoId) => api.get(`/chat/conversations/${convoId}/messages`),
  reply: (convoId, data) => api.post(`/chat/conversations/${convoId}/reply`, data),
};

// Dashboard
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};

// Seed
export const seedAPI = {
  seed: () => api.post('/seed'),
};

export default api;
