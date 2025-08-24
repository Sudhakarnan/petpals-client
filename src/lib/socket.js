import { io } from 'socket.io-client'
import { API_BASE_URL } from '../utils/constants'

export function createSocket(token) {
  // API_BASE_URL = http://localhost:5000/api -> socket base is origin
  const base = new URL(API_BASE_URL)
  const origin = `${base.protocol}//${base.host}`
  return io(origin, {
    auth: token ? { token } : undefined,
    transports: ['websocket'],
  })
}
