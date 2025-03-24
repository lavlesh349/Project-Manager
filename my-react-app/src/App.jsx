// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/dashboard";
import ProjectDetails from "./Components/ProjectDetails";
import CurrentProject from "./Components/CurrentProject";
import CommonHeader from "./Components/Header";

function App() {
    return (
        <Router>
            <CommonHeader /> {/* Include the CommonHeader component at the top of the application */}
            <div className="min-h-screen bg-gray-100"> {/* Set a minimum height and background color */}
                <Routes>

                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<CurrentProject />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
