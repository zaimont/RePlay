import User from "../models/user.js";

export const login = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.status(200).json({ message: 'Login exitoso' });
}
