import bcrypt from 'bcrypt';
import { db } from '../index.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role, company_id } = req.body;
  try {
    const cleanedEmail = email.toLowerCase().trim();

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [cleanedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, email, password, role, company_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, NOW(), true)`,
      [name, cleanedEmail, hashedPassword, role, company_id]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanedEmail = email.toLowerCase().trim();

    const result = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [cleanedEmail]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
