import { io } from 'socket.io-client';

//for production
export const socket = io('http://173.249.59.88');


//fof development
// export const socket = io('http://192.168.30.225:3000');
