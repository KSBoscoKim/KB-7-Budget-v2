import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

export function fetchCategories() {
  return client.get('/categories').then((res) => res.data)
}
