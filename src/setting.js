require('dotenv').config();

export default {
  origin: process.env.ORIGIN.split(','),
  media: { dir: 'src/uploads', extensions: ['jpg', 'png', 'jpeg', 'mp3', 'mp4', 'mkv'] },
};
