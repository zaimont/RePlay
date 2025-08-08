import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

import { login, registerUser } from './controller/usersController.js';
import { registerCompany } from './controller/registerCompanyController.js';
import { updateUser } from './controller/updateUser.js';
import { getAllCompanies } from './controller/companyController.js';

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

export const db = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

db.connect()
  .then(() => console.log('✅ POSTGRESQL Conectado'))
  .catch((err) => console.error('❌ Error de conexión', err));

// Rutas
app.post('/login', login);
app.post('/register', registerUser);
app.post('/registercompany', registerCompany);
app.put('/update-user/:id', updateUser);
app.get('/api/companies', getAllCompanies);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
