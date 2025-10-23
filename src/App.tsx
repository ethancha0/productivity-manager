import {BrowserRouter, Routes, Route, Navigate, Link} from "react-router-dom";

import WeeklyGoals from './WeeklyGoals/WeeklyGoals'
import Dashboard from './Dashboard/Dashboard'

import CreateAccount from './CreateAccount/CreateAccount'
import Login from './Login/Login'
import Welcome from './Welcome/Welcome'




function App() {

  return (
    <>
    {/* for testing */}
    {/*
    <BrowserRouter>
      <nav className="p-2 gap-4 flex">
        <Link to="/signup"> <CreateAccount/> </Link>
        <Link to="/login"> <Login/></Link>
        <Link to="/dashboard"> <Dashboard/> </Link>
      </nav>

    */}
    
    <BrowserRouter>
    
      <Routes>
        {/* Default landing */}


        {/* Public pages */}
        <Route path = "/signup" element= {<CreateAccount/>} />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/weeklygoals" element = {<WeeklyGoals/>} />

        {/* Protected pages */}
        <Route path = "/dashboard" element = {<Dashboard/>} />

        {/* Catch all - route to signup for now  */}
        <Route path = "/*" element= {<CreateAccount/>} />

      </Routes>

    </BrowserRouter>

     

      
    </>
  )
}

export default App
