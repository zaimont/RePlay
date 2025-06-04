import MainDashboard from './components/generalDashboard/mainDashboard'
import ForecastSummary from './components/generalDashboard/forecastSummary'
import OverviewCard from './components/generalDashboard/overviewCard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <MainDashboard />
      <ForecastSummary />
      <OverviewCard />
      </div>
    </>
  )
}

export default App
