import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import YearlyComparation from './components/annualComparation/yearlyComparison'
import Login from './components/authenticationConfiguration/login'
import Register from './components/authenticationConfiguration/register-company'
import UserProfile from './components/authenticationConfiguration/userProfile'

function App() {
  

  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/comparacion-anual" element={<YearlyComparation />} />
      </Routes>
    </Router>
  )
}

export default App
