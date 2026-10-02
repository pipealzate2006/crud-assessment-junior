import axios, { AxiosError, type AxiosAdapter } from 'axios'
import { fakeServer } from './fakeServer'

const fakeAdapter: AxiosAdapter = async (config) => {
  const response = await fakeServer({
    method: (config.method ?? 'get').toUpperCase(),
    url: config.url ?? '',
    authorization: config.headers.get('Authorization')?.toString(),
    body: typeof config.data === 'string' ? JSON.parse(config.data) : config.data,
  })

  const axiosResponse = {
    data: response.data,
    status: response.status,
    statusText: '',
    headers: {},
    config,
  }

  if (response.status >= 400) {
    const message = (response.data as { message?: string })?.message ?? 'Error en el servidor'
    throw new AxiosError(message, String(response.status), config, null, axiosResponse)
  }

  return axiosResponse
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  adapter: fakeAdapter,
})
