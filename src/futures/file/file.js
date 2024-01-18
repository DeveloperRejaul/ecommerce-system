import { Router } from 'express';
import path from 'path';
import setting from '../../setting';

const router = Router();
export default () => {
  router.get('/upload/:fileName', (req, res) => {
    const fileName = req.params?.fileName;

    // checking params exists
    if (!fileName) return res.status(202).send('Please pass file uri with url params');

    // send file
    res.status(200).sendFile(path.join(path.resolve(), setting.media.dir, fileName));
  });
  return router;
};
