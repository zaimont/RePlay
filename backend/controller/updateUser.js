import bcrypt from 'bcrypt';
import { db } from '../index.js';

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;  // El id viene de la URL
    const { name, email, password, role, company_id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID de usuario es requerido' });
    }

    // Verificar que el usuario exista
    const userExist = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userExist.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Preparar datos para actualizar (usar los nuevos o los existentes)
    const updatedName = name || userExist.rows[0].name;
    const updatedEmail = email ? email.toLowerCase().trim() : userExist.rows[0].email;
    const updatedRole = role || userExist.rows[0].role;
    const updatedCompanyId = company_id || userExist.rows[0].company_id;

    // Hashear contraseña si cambia
    let updatedPassword = userExist.rows[0].password;
    if (password && password.trim() !== '') {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Ejecutar actualización
    await db.query(
      `UPDATE users SET name=$1, email=$2, password=$3, role=$4, company_id=$5 WHERE id=$6`,
      [updatedName, updatedEmail, updatedPassword, updatedRole, updatedCompanyId, id]
    );

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
