
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export type ProgressStatus = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

export interface ProgressUpdate {
  progress: string;
  status: ProgressStatus;
  message: string;
}

// Replace with your actual WebSocket server URL
const SOCKET_URL = 'https://lms-backend-l6o9.onrender.com';

export function useSocketProgress() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressUpdate>({
    progress: '0% completed',
    status: 'idle',
    message: 'Ready to start processing',
  });
  const [isConnected, setIsConnected] = useState(false);

  // Connect to the socket server
  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketConnection.on('connect', () => {
      setIsConnected(true);
      setSocketId(socketConnection.id);
      console.log('Socket connected with ID:', socketConnection.id);
    });

    socketConnection.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketConnection.on('progress', (data: ProgressUpdate) => {
      console.log('Progress update:', data);
      setProgressData(data);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Get numeric progress for progress bar
  const getNumericProgress = useCallback((): number => {
    const progressString = progressData.progress;
    const match = progressString.match(/(\d+)%/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  }, [progressData.progress]);

  return {
    socket,
    socketId,
    isConnected,
    progressData,
    progressPercent: getNumericProgress(),
    progressStatus: progressData.status,
    progressMessage: progressData.message,
  };
}
