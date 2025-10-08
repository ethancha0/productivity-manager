import Timer from './Timer/Timer'
import Tabs from './Tabs/Tabs'
import Stopwatch from './Stopwatch/Stopwatch'
import WeeklyGoals from './WeeklyGoals/WeeklyGoals'

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
      
    </>
  )
}

export default App
