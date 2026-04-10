import axios from 'axios';

const client = axios.create({
  baseURL: 'https://kb-7-budget-backend.onrender.com',
});

export default client;
