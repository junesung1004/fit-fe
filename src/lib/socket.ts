import io from 'socket.io-client';

const SOCKET_URL = 'https://api.fit-date.co.kr';

// 채팅용 소켓
export const chatSocket = io(SOCKET_URL, {
  autoConnect: false,
  path: '/socket.io/chat/',
  transports: ['websocket'],
  withCredentials: true,
});

// 접속 상태용 소켓
export const userStatusSocket = io(SOCKET_URL, {
  autoConnect: false,
  path: '/socket.io/status/',
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// 토큰을 동적으로 할당하는 함수
export function setUserStatusSocketToken(token: string) {
  userStatusSocket.auth = { token };
}
