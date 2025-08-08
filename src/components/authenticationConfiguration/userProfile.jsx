import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditedUser(parsedUser);
    } else {
      navigate('/login');
    }

    // Cargar listado de empresas
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) setEditedUser(user);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setEditedUser({ ...editedUser, profileImage: file.name });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/update-user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setUser(editedUser);
        localStorage.setItem('user', JSON.stringify(editedUser));
        setEditing(false);
      } else {
        alert('Error al actualizar perfil: ' + data.message);
      }
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    }
  };

  if (!user) return null;

  const userCompany = companies.find(c => c.id === user.company_id);

  return (
    <section className="min-h-screen bg-[#E8FAFF] flex flex-col items-center p-6">
        <div className="flex justify-start items-start p-4">
        <h1 className="font-bold text-black italic text-3xl">RePlay</h1>
      </div>
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>

        <div className="flex flex-col items-center mb-4">
          <img
            src={previewImage || '/default-profile.png'}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 font-semibold">Nombre completo:</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name || ''}
                onChange={handleChange}
                className="w-full border px-3 py-1 rounded-md"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Email:</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={editedUser.email || ''}
                onChange={handleChange}
                className="w-full border px-3 py-1 rounded-md"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Rol:</label>
            {editing ? (
              <input
                type="text"
                name="role"
                value={editedUser.role || ''}
                onChange={handleChange}
                className="w-full border px-3 py-1 rounded-md"
              />
            ) : (
              <p className="text-gray-900">{user.role || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Empresa:</label>
            {editing ? (
              <select
                name="company_id"
                value={editedUser.company_id || ''}
                onChange={handleChange}
                className="w-full border px-3 py-1 rounded-md"
              >
                <option value="">Seleccione empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{userCompany ? userCompany.name : 'No especificado'}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Guardar
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded-lg"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditToggle}
                className="bg-orange-300 hover:bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Editar perfil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
