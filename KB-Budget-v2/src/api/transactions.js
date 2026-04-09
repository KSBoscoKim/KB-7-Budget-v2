import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
});

// export function fetchTransactions() {
//   return client.get('/transactions').then((res) => res.data)
// }

//사용자별 거래내역 분류
export function fetchTransactions(userId) {
  return client
    .get('/transactions', { params: { userId } })
    .then((res) => res.data);
}

export function createTransaction(payload) {
  return client.post('/transactions', payload).then((res) => res.data);
}

export function updateTransaction(id, payload) {
  return client.put(`/transactions/${id}`, payload).then((res) => res.data);
}

export function deleteTransaction(id) {
  return client.delete(`/transactions/${id}`);
}
