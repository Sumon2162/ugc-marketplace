import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const socketInstance = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001', {
        auth: { token }
      });
      
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });
      
      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });
      
      setSocket(socketInstance);
      
      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
      };
    } else if (socket) {
      // Disconnect when user logs out
      socket.disconnect();
      setSocket(null);
      setConnected(false);
    }
  }, [isAuthenticated]);
  
  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};