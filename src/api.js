import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const runSimulation  = (data)     => api.post('/simulate', data);
export const saveScenario   = (data)     => api.post('/scenarios', data);
export const getScenarios   = ()         => api.get('/scenarios');
export const deleteScenario = (id)       => api.delete(`/scenarios/${id}`);

export default api;
