import React from "react";
import "../styles/Home_landing_page.css";
import land_image from "../assets/landing_page_bg.png";

const HomePage = ({ scrollToAbout, scrollToContact }) => {
  return (
    <div className="homepage" id="home">
      <div className="left-section">
        <h1 className="project-title"><span className="highlight">HE</span>alth <span className="highlight">A</span>lert and <span className="highlight">R</span>eal Time <span className="highlight">T</span>racker
</h1>
        <h2 className="tagline">
          Every Beat Counts. Every Alert Saves.
        </h2>
        <p className="description">
          Smartwatch-integrated health system that tracks your vitals in real time, detects danger, and notifies loved ones instantly — because every second counts.
        </p>
        <div className="buttons">
          <button className="learn-more" onClick={scrollToAbout}>Learn More</button>
          {/* <button className="learn-more" onClick={scrollToContact}>Contact</button> */}
        </div>
      </div>
      <div className="right-section">
        <img src={land_image} alt="HealthMonitor Overview" className="home-image" />
      </div>
    </div>
  );
};

export default HomePage;
