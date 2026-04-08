import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

export function fetchUser(id) {
  return client.get(`/users/${id}`).then((res) => res.data)
}
