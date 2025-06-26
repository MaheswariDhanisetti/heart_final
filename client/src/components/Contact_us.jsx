import React, { useState } from 'react';
import '../styles/Contact_us.css';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

function Contact_us() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mailtoLink = `mailto:maheswarimahi2005@gmail.com?subject=User Feedback&body=From: ${email}%0D%0A%0D%0A${message}`;

  return (
    <div className="contact-us" id="contact">
      <div className="contact-left">
        <h2 className="contact-heading">Let's Stay Connected</h2>
        <p className="contact-subtext">
          Reach out for suggestions, queries, or collaborations. We’d love to hear from you!
        </p>

        <div className="contact-info">
          <p><strong>Email:</strong> <a href="mailto:maheswarimahi2005@gmail.com">maheswarimahi2005@gmail.com</a></p>
          <p><strong>Phone:</strong> +91-9390041407</p>
          <p><strong>Location:</strong> India</p>
        </div>

        <div className="social-icons">
          <a href="https://www.linkedin.com/in/maheswari-dhanisetti/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://github.com/MaheswariDhanisetti" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      <div className="contact-right">
        <h3>Send us your thoughts</h3>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <a
          href={mailtoLink}
          className="send-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          SEND
        </a>
      </div>
    </div>
  );
}

export default Contact_us;
