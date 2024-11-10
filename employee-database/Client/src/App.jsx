import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Navbar from "./Components/Navbar";
import EmployeeList from "./Components/EmployeeList";
import NewEmployee from "./Components/newEmployee";
import EditEmployee from "./Components/EditEmployee";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state

  // Load initial state from localStorage and check user session from server
  useEffect(() => {
    // Get login status and user data from localStorage
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    console.log("Initial load from localStorage:", { storedLoginStatus, storedUser });

    // If user is logged in, update state
    if (storedLoginStatus === 'true' && storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Check session status from the server
    axios.get('http://localhost:3001/user', { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setIsLoggedIn(true);
          setUser(response.data.user);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
        }
        console.log("Server response for user data:", response.data.user);
      })
      .catch(error => {
        console.error("Error fetching user session:", error);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      })
      .finally(() => {
        setLoading(false);  
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <BrowserRouter>
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/employeeList/CreateEmployee" element={<NewEmployee />} />
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/employeeList/edit/:id" element={<EditEmployee />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUp setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
