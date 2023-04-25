import { useState } from 'react';
import './App.css';

// Routing
import { Route, Routes } from "react-router-dom"
import { Login } from "./components/login/login"
import { Register } from "./components/register/register"
import { Dashboard } from "./components/dashboard/dashboard"
import { useAuth } from "./components/auth/userSession"
import { Words } from "./components/word_list/words"
import { Sources } from "./components/source_list/sources"
 
function App() {
  const {user, isLoading} = useAuth();

  return (
    <div className="App">
      <Routes>
				<Route path="/" element={<Login />}/>
				<Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard user = {user} isLoading = {isLoading}/>}/>
        <Route path="/dashboard/list" element={<Words user = {user} isLoading = {isLoading}/>}/>
        <Route path="/dashboard/list/sources" element={<Sources/>}/>
        <Route path="/dashboard/list/context" element={<Sources/>}/>
			</Routes>
    </div>
  )
}

export default App
