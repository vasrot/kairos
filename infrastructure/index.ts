import dotenv from 'dotenv';
import app from './app';
import './db';

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});