import { useEffect, useRef, useState } from 'react'

interface UseWebSocketOptions {
  onMessage?: (msg: any) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
  reconnect?: boolean
  reconnectInterval?: number
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnect = true,
    reconnectInterval = 3000
  } = options

  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)

  const connect = () => {
    if (!url || !shouldReconnectRef.current) {
      return
    }

    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        setIsConnected(true)
        if (onOpen) onOpen()
      }

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)

          if (onMessage) onMessage(data)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        if (onError) onError(error)
      }

      ws.current.onclose = (event) => {
        setIsConnected(false)
        if (onClose) onClose()
        
        // Don't reconnect on authentication errors (4xxx codes)
        if (event.code >= 4000 && event.code < 5000) {
          shouldReconnectRef.current = false
          console.error('WebSocket authentication error:', event.code, event.reason)
          return
        }
        
        // Attempt to reconnect
        if (reconnect && shouldReconnectRef.current && ws.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  useEffect(() => {
    shouldReconnectRef.current = true
    connect()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  return { ws: ws.current, isConnected, sendMessage }
}