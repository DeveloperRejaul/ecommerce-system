import express, { json, urlencoded } from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import { parse } from 'express-form-data';
import settings from './setting';
import routes from './futures/index';
import { socketStart } from './config/socket';

require('dotenv').config();

const port = process.env.PORT || 4000;

export default function App() {
  const app = express();
  const server = http.createServer(app);
  const io = socketStart(server);

  io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`user disconnect: ${socket.id}`);
    });
  });

  app.use(morgan('tiny'));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(parse());

  const corsOptions = { origin: settings.origin, credentials: true, optionSuccessStatus: 200 };
  app.use(cors(corsOptions));

  routes.forEach((fn) => app.use('/api/v-1', fn(io)));
  app.get('/', (_req, res) => res.send({ message: 'server is ok' }));
  // app.use((req, res, next) => res.send({ message: "bad url" }));
  // app.use((err, req, res, next) => res.send({ message: "other error" }));
  server.listen(port, () => console.log(`app listening on port ${port}!`));
}
