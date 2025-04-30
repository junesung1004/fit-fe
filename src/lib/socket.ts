import io from 'socket.io-client';

const SOCKET_URL = 'https://fit-date.co.kr';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
