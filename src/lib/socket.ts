import io from 'socket.io-client';

const SOCKET_URL = 'https://api.fit-date.co.kr';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  path: '/socket.io/',
  transports: ['websocket'],
  withCredentials: true,
});
