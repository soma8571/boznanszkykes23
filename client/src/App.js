//import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Login from "./pages/Login";
import Main from "./pages/Main";
import Megrendelesek from './pages/Megrendelesek';
import Keszlet from './pages/Keszlet';
import Vasarlok from './pages/Vasarlok';
import Hirlevel from './pages/Hirlevel';
import Felhivas from './pages/Felhivas';
import Galeria from './pages/Galeria';
import Layout from './components/Layout';

function App() {
  
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);  

  useEffect(() => {
    if (cookies.accessToken === "" || !cookies.accessToken)
      navigate("/login");
  }, [cookies]);


  const handleLogin = (isLoggedIn) => {
    setLoggedIn(isLoggedIn);
  }

  function logout() {
    removeCookie("accessToken", {path: "/"});
  }

  return (
    <div className="App">
     
     <Routes>
        <Route 
          path="/login/" 
          element={<Login handleLogin={handleLogin} />} 
        >
        </Route>

        <Route path="/" 
          element={<Layout content={<Main/>} />}>
        </Route>

        <Route path="/termekek/" 
          element={<Layout content={<Main />} />}>
        </Route>

        <Route path="/megrendelesek/" 
          element={<Layout content={<Megrendelesek />} />}>  
        </Route>

        <Route path="/keszlet/" 
          element={<Layout content={<Keszlet />} />}>
        </Route>
        
        <Route path="/vasarlok/" 
          element={<Layout content={<Vasarlok />} />}>
        </Route>

        <Route path="/hirlevel/" 
          element={<Layout content={<Hirlevel/>} />}>
        </Route>

        <Route path="/felhivas/" 
          element={<Layout content={<Felhivas />} />}>
        </Route>

        <Route path="/galeria/" 
          element={<Layout content={<Galeria />} />}>
        </Route>

      </Routes>

    </div>
  );
}

export default App;
