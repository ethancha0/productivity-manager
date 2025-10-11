import Timer from './Timer/Timer'
import Tabs from './Tabs/Tabs'
import Stopwatch from './Stopwatch/Stopwatch'
import WeeklyGoals from './WeeklyGoals/WeeklyGoals'
import Calendar from './Dashboard/Calendar'
import Dashboard from './Dashboard/Dashboard'

import CreateAccount from './CreateAccount/CreateAccount'
import Login from './Login/Login'

function App() {

  return (
    <>

      

      <Timer/>
      {/*  <Tabs/> */}
      <Stopwatch/>

      <CreateAccount/>

      <Login/>

      <WeeklyGoals/>

      <Dashboard/>
      
    </>
  )
}

export default App
