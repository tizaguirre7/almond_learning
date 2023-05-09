import { useState } from 'react';
import './App.css';

// Routing
import { Route, Routes } from "react-router-dom"
import { Login } from "./components/login/login"
import { Register } from "./components/register/register"
import { Dashboard } from "./components/dashboard/dashboard"
import { useAuth } from "./components/auth/userSession"
import { Words } from "./components/word_list/words"
import { Loader } from './components/loader/loader';

import { Sources } from "./components/source_list/sources"
import { Context } from "./components/context_list/contexts"
import { Filter } from "./components/Games/word_game";
import { Details } from "./components/word_list/word_details"
 
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
        <Route path="/dashboard/list/context" element={<Context/>}/>
        <Route path="/dashboard/list/games" element={<Filter/>}/>
        <Route path="/dashboard/list/word" element={<Details/>}/>
        <Route path="/loading" element={<Loader />}/>
			</Routes>
    </div>
  )
}

export default App
