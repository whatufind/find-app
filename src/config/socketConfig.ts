import { io } from 'socket.io-client';

//for production
//export const socket = io('https://find-backend-5g7z.onrender.com');


//fof development
export const socket = io('http://192.168.30.225:3000');
