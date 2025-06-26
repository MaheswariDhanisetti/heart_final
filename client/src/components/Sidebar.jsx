import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Stethoscope,
  User,
  BellRing,
  LogOut
} from "lucide-react";
import "../styles/Sidebar.css";
import HeartLogo from "../assets/watch_pulse_heart.png";

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-wrapper">
      <aside className="sidebar-panel">
        <div className="sidebar-logo">
          <img src={HeartLogo} alt="H.E.A.R.T Logo" className="sidebar-logo-img"/>
          <span className="sidebar-logo-text">HEART</span>
        </div>

        <nav className="sidebar-nav-links">
          <button onClick={() => navigate("/main_page")}>
            <Home size={20} />
            <span className="sidebar-label">Dashboard</span>
          </button>

          <button onClick={() => navigate("/symptom-checker")}>
            <Stethoscope size={20} />
            <span className="sidebar-label">Symptom Checker</span>
          </button>

          <button onClick={() => navigate("/profile")}>
            <User size={20} />
            <span className="sidebar-label">Profile</span>
          </button>

          <button>
            <BellRing size={20} />
            <span className="sidebar-label">Alerts</span>
          </button>
        </nav>

        <button className="sidebar-logout-btn" onClick={() => navigate("/")}>
          <LogOut size={20} />
          <span className="sidebar-label" id="logout_sidebar">Logout</span>
        </button>
      </aside>

      <main className="sidebar-dashboard-content">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
