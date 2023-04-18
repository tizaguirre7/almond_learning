import { useState } from 'react';

// Routing
import {Route, Routes} from "react-router-dom"
import { Login } from "./components/login/login"
import { Register } from "./components/register/register"
import { Dashboard, } from "./components/dashboard/dashboard"
import {useAuth} from "./components/auth/userSession"
// import { userObj } from './components/login/login';



function App() {

  const {user, isLoading} = useAuth();

  return (
    <div className="App">
      <Routes>
				<Route path="/" element={<Login />}/>
				<Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard user = {user} isLoading={isLoading}/>}/>
			</Routes>
    </div>
  )
}

export default App
