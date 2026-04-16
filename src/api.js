import axios from 'axios';

const BACKEND = 'https://manpower-simulator-backend.onrender.com/api';

const api = axios.create({ baseURL: BACKEND });


export const runSimulation  = (data)     => api.post('/simulate', data);
export const saveScenario   = (data)     => api.post('/scenarios', data);
export const getScenarios   = ()         => api.get('/scenarios');
export const deleteScenario = (id)       => api.delete(`/scenarios/${id}`);

export default api;
