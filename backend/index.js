import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { login, registerUser } from './controller/usersController.js';

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

export const db = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

db.connect()
  .then(() => console.log('POSTGRESQL Conectado'))
  .catch((err) => console.error('Error de conexion', err));

app.post('/login', login);
app.post('/register', registerUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
