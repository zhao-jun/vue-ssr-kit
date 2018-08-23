
export const Config = {
  baseURL: process.env.VUE_ENV === 'server' ? 'http://localhost:3030/api' : '/api'
}
