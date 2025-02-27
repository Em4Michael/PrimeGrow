// websocketService.tsx
import { useState, useEffect } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://primegrow-server.onrender.com';

interface WebSocketMessage {
  type?: string;
  pinName?: string;
  state?: string;
  TP?: number;
  HM?: number;
  HI?: number;
  MO?: number;
  UV?: number;
  RN?: number;
  timestamp?: number;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: ((data: WebSocketMessage) => void)[] = [];

  connect(): void {
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Optional: Heartbeat to keep connection alive
      setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // Ping every 30 seconds
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
      setTimeout(() => this.connect(), 5000); // Reconnect after 5s
    };

    this.socket.onerror = (err: Event) => {
      console.error('WebSocket error:', err);
    };
  }

  send(data: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  addListener(listener: (data: WebSocketMessage) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (data: WebSocketMessage) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN || false;
  }
}

export const webSocketService = new WebSocketService();

// Custom hook for WebSocket
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(webSocketService.isConnected());
  const [data, setData] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const handleMessage = (message: WebSocketMessage) => setData(message);
    webSocketService.addListener(handleMessage);

    const interval = setInterval(() => {
      setIsConnected(webSocketService.isConnected());
    }, 1000);

    if (!webSocketService.isConnected()) {
      webSocketService.connect();
    }

    return () => {
      webSocketService.removeListener(handleMessage);
      clearInterval(interval);
    };
  }, []);

  return {
    isConnected,
    data,
    send: webSocketService.send.bind(webSocketService),
  };
};