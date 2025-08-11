import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PdfGastoExtractor from './components/dataManagement/UploadData'
import YearlyComparation from './components/annualComparation/yearlyComparison'
import Login from './components/authenticationConfiguration/login'
import RegisterCompany from './components/authenticationConfiguration/register-company';
import UserProfile from './components/authenticationConfiguration/userProfile'
import Register from './components/authenticationConfiguration/register'
import Prediction from './components/dataManagement/PrediccionGastos'
import Home from './components/authenticationConfiguration/home'
import Reportes from './components/dataManagement/reportes'
import PrediccionGastos from './components/dataManagement/PrediccionGastos';
function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/prediccion-gastos" element={<PrediccionGastos />} />
        <Route path="/upload-pdf" element={<PdfGastoExtractor />} />
        <Route path="/prediccion" element={<Prediction />} />
        <Route path="/comparacion-anual" element={<YearlyComparation />} />
      </Routes>
    </Router>
  )
}

export default App
