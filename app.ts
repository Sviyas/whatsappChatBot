import express from 'express';
import { config } from 'dotenv';
import configureBot from './src/client';

config();

const { PORT } = process.env;

const app = express();

app.use(express.json());

app.listen(PORT || 5000, async () => {
  configureBot();
  console.log(`Server listening on ${PORT}`);
});
