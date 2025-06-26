import React, { useState } from "react";
import "../styles/About_us.css";
import watch from "../assets/icons8-wearable-technology-50.png"
import stesthoscope from "../assets/icons8-stethoscope-64.png"
import vault from "../assets/icons8-health-insurance-50.png"
import pulse from "../assets/icons8-pulse-50.png"

const cardData = [
  {
    title: "Smart Integration",
    description: " Connect Your Fitbit One-click integration for seamless sync",
    image: watch,
    backContent:" Our platform enables secure Fitbit integration using OAuth, allowing real-time health data sync such as heart rate, steps, and sleep — all stored safely in your profile. ",
    backtitle:"Seamless Smartwatch Integration"
  },
  {
    title: " Continuous Monitoring",
    description: "ive Health Insights Track vitals every second.",
    image: pulse,
    backContent: "Vitals like heart rate and sleep patterns are continuously fetched and visualized through dashboards — enabling users and doctors to understand trends and overall wellness.",
    backtitle:"continuous Health Monitoring"
  },
  {
    title: "Health History Vault",
    description: "Get Alerted Fast Immediate health alerts in emergencies.",
    image: vault,
    backContent: "All your health data is stored securely. Access alerts, reports, and previous vitals during emergencies for faster diagnosis..",
    backtitle:"Smart Emergency Alerts"
  },
  {
    title: " AI Symptom Checker",
    description: "Your AI Health Buddy Describe your symptoms, get suggestions.",
    image: stesthoscope,
    backContent: "Describe your symptoms and get instant suggestions on possible causes, precautions, medication, and diet—powered by Gemini AI.",
    backtitle:"Gemini-Powered Symptom Checker"
  }
];

const About_us = () => {
  const [flippedCards, setFlippedCards] = useState(Array(cardData.length).fill(false));

  const handleFlip = (index) => {
    const updated = [...flippedCards];
    updated[index] = !updated[index];
    setFlippedCards(updated);
  };

  return (
    <div className="about-us" id="about">
      <h1 className="main-heading">Our Vision</h1>
      <h2 className="sub-heading"> Making healthcare simple, smart, and accessible for everyone.</h2>

      <div className="cards-container">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`flip-card ${flippedCards[index] ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={card.image} alt={card.title} className="card-image" />
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="flip-card-back">
                <h3 className="card-title">{card.backtitle}</h3>
                <p className="card-description">{card.backContent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About_us;
