import { io } from 'socket.io-client';



const SOCKET_URL =  process.env.SOCKET_URL 
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;