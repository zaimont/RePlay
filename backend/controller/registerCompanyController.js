import { db } from '../index.js';

export const registerCompany = async (req, res) => {
  console.log('Datos recibidos:', req.body);

  const {
    company,
    sector_industry,
    company_size,
    fiscal_period,
    tax_id,        // cambió aquí, usa tax_id
    country,
    city,
    years_operation
  } = req.body;

  if (
    !company ||
    !sector_industry ||
    !company_size ||
    !fiscal_period ||
    !tax_id ||     // cambió aquí también
    !country ||
    !city ||
    !years_operation
  ) {
    console.log('Faltan campos:', req.body);
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const yearsOpInt = parseInt(years_operation);
    if (isNaN(yearsOpInt)) {
      console.log('years_operation no es un número válido:', years_operation);
      return res.status(400).json({ message: 'Años en operación debe ser un número válido' });
    }

    const result = await db.query(
      `INSERT INTO companies (
        name, sector_industry, company_size,
        fiscal_period, tax_id, country,
        city, years_operation
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        company,
        sector_industry,
        company_size,
        fiscal_period,
        tax_id,
        country,
        city,
        yearsOpInt
      ]
    );

    res.status(200).json({
      message: 'Empresa registrada con éxito',
      user: result.rows[0],
    });

  } catch (err) {
    console.error('Error al registrar empresa:', err);
    res.status(500).json({ message: 'Error al registrar la empresa' });
  }
};
