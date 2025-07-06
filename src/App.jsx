import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import YearlyComparation from './components/annualComparation/yearlyComparison'
import Login from './components/authenticationConfiguration/login'
import RegisterCompany from './components/authenticationConfiguration/register-company'
import UserProfile from './components/authenticationConfiguration/userProfile'
import Register from './components/authenticationConfiguration/register'
import ForecastSummary from './components/generalDashboard/forecastSummary'
import MainDashboard from './components/generalDashboard/mainDashboard'
function App() {
  

  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/comparacion-anual" element={<YearlyComparation />} />
        <Route path="/forecastSummary" element={<ForecastSummary />} />
         <Route path="/mainDashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
