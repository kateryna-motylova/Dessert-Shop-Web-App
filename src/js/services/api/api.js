import axios from 'axios';

const BASE_URL = 'https://deserts-store.b.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function getDesserts({
  page = 1,
  limit = 8,
  category = '',
  type = '',
} = {}) {
  const params = { page, limit };

  if (type) params.type = type;
  if (category) params.category = category;

  const { data } = await api.get('/desserts', { params });
  return data;
}

