export interface Environment {
  API_URL: string;
}

export const environment = {
  // apiUrl: 'http://165.232.144.187:8081'
  API_URL: '${API_URL}'
}
