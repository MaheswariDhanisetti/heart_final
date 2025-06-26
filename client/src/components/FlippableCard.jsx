import React, { useState } from 'react';
import '../styles/About_us.css';

const FlippableCard = ({ title, image, description, backContent }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={image} alt={title} className="card-image" />
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
        <div className="flip-card-back">
          <p className="card-description">{backContent}</p>
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
