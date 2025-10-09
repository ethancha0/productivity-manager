import Timer from './Timer/Timer'
import Tabs from './Tabs/Tabs'
import Stopwatch from './Stopwatch/Stopwatch'
import WeeklyGoals from './WeeklyGoals/WeeklyGoals'
import Calendar from './Calendar/Dashboard'

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

      <Calendar/>
      
    </>
  )
}

export default App
