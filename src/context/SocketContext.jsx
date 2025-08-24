import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createSocket } from '../lib/socket'
import { useAuth } from './AuthContext'

const SocketCtx = createContext(null)
export const useSocket = () => useContext(SocketCtx)

export function SocketProvider({ children }) {
  const { token } = useAuth()
  const [socket, setSocket] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!token) { ref.current?.disconnect?.(); setSocket(null); return }
    const s = createSocket(token)
    ref.current = s
    setSocket(s)
    return () => s.disconnect()
  }, [token])

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>
}
