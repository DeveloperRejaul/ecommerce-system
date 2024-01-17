import { Server } from 'socket.io';
import settings from '../setting';
import { decodeAuthToken } from '../utils/decodeAuthToken';

export const socketStart = (server) => {
  const io = new Server(server, { cors: settings.origin, pingInterval: 6000 });
  io.use(async (socket, next) => {
    const token = socket.handshake?.headers?.token?.split(' ')[1];
    if (token) {
      const user = await decodeAuthToken(token);
      if (!user) next(Error('Unauthorized user'));
      socket.join(user?.id);
      next();
    }
  });
  return io;
};
