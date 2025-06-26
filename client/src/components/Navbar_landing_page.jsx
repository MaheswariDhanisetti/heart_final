import React from 'react'
import "../styles/Navbar_landing_page.css"
import { NavLink } from "react-router-dom";
// import logo from "../assets/main_logo.png";
import logo from "../assets/watch_pulse_heart.png";


const Navbar_landing_page = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="HealthMonitor Logo" className="logo-img" />
        <h2 className="logo-text">HEART</h2>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>

      <NavLink to="/login_signup" className="get-started" onClick={() => console.log("Redirecting to Signup/Login")}>
  Get Started
</NavLink>
    </nav>
  )

}

export default Navbar_landing_page
