// controller/companyController.js
import { db } from '../index.js';

export const getAllCompanies = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM companies');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener compañías:', error);
    res.status(500).json({ message: 'Error al obtener compañías' });
  }
};
