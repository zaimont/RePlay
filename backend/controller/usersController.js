import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { db } from '../index.js';

export const registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const cleanedEmail = email.toLowerCase().trim();

    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [cleanedEmail]
    );

    if(existingUser.rows.length>0){
      return res.status(400).json({message: 'El email ya esta registrado'});
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (fullname, email, role, password) VALUES ($1,$2,$3,$4)',
      [fullName, cleanedEmail, role, hashedPassword]
    );



    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



export const login = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.status(200).json({ message: 'Login exitoso' });
}
