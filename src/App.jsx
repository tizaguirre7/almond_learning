import { useState } from 'react';

// Routing
import {Route, Routes} from "react-router-dom"
import { Login } from "./components/login/login"
import { Register } from "./components/register/register"
import { Dashboard, } from "./components/dashboard/dashboard"



function App() {

  return (
    <div className="App">
      <Routes>
				<Route path="/" element={<Login />}/>
				<Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
			</Routes>
    </div>
  )
}

export default App
