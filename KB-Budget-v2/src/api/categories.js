import client from './utils'

export function fetchCategories() {
  return client.get('/categories').then((res) => res.data)
}
