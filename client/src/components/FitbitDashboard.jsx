// FitbitDashboard.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  HeartPulse,
  Flame,
  Droplets,
  Utensils,
  Moon,
  Footprints,
  Thermometer,
  MapPin,
  Wind,
  Droplet,
} from "lucide-react";
import "../styles/FitbitDashboard.css";

const FitbitDashboard = () => {
  const { state } = useLocation();
  const email = state?.email || localStorage.getItem("userEmail");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:3001/api/dashboard?email=${email}`)
        .then((res) => {
          const result = res.data;
          const parsedNutrition = typeof result.nutrition === "string"
            ? JSON.parse(result.nutrition)
            : result.nutrition;

          setData({
            ...result,
            nutrition: parsedNutrition,
          });
        })
        .catch((err) => console.error("Error fetching dashboard data", err));
    }
  }, [email]);

  if (!data) return <div className="loading">Loading...</div>;

  const displayValue = (val) =>
    val !== undefined && val !== null && val !== "" ? val : "N/A";

  return (
    <>
     <header className="dashboard-header">
      <h1>Health Tracker</h1>
      <button className="manual-alert-button">Send Manual Alert</button>
    </header>


      <div className="cards-grid">
        {/* Cards */}
        {[
          { label: "Heart Rate", value: data.heartRate, unit: "bpm", Icon: HeartPulse },
          { label: "Calories", value: data.nutrition?.calories, unit: "kcal", Icon: Flame },
          { label: "Water", value: data.nutrition?.water, unit: "ml", Icon: Droplets },
          { label: "Protein", value: data.nutrition?.protein, unit: "g", Icon: Utensils },
          { label: "Sleep", value: data.sleep, unit: "", Icon: Moon },
          { label: "Steps", value: data.steps, unit: "", Icon: Footprints },
          { label: "Temperature", value: data.temperature, unit: "°C", Icon: Thermometer },
          { label: "Respiratory Rate", value: data.respiratoryRate, unit: "brpm", Icon: Wind },
          { label: "Oxygen Saturation", value: data.oxygenSaturation, unit: "%", Icon: Droplet },
          { label: "Location", value: data.location, unit: "", Icon: MapPin },
        ].map(({ label, value, unit, Icon }, idx) => (
          <div key={idx} className="card">
            <div className="card-structure">
              <div className="text-area">
                <h4>{label}</h4>
                <div className="value-line">
                  <span className="big-val">{displayValue(value)}</span>
                  {unit && <span className="unit-val">{unit}</span>}
                </div>
              </div>
              <Icon className="card-icon" />
            </div>
          </div>
        ))}

        {/* Manual Alert */}
        {/* <div className="manual-alert-container">
          <button className="manual-alert-button">Manual Alert</button>
        </div> */}
      </div>
    </>
  );
};

export default FitbitDashboard;
