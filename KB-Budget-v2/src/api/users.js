import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
});

export function fetchUser(id) {
  return client.get(`/users/${id}`).then((res) => res.data);
}

export function fetchUserByLoginId(loginId) {
  return client
    .get(`/users?loginId=${loginId}`)
    .then((res) => res.data[0] ?? null);
}

export function createUser(payload) {
  return client.post('/users', payload).then((res) => res.data);
}

export function updateUser(id, payload) {
  return client.patch(`/users/${id}`, payload).then((res) => res.data);
}
