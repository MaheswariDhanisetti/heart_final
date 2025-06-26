import React, { useState, useEffect } from 'react';
import "../styles/registration_form.css";
import { useNavigate, useLocation } from "react-router-dom";
import remove_logo from "../assets/remove_icon.png";

const RegistrationForm = () => {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: prefilledEmail,
    bloodGroup: "",
    age: 18,
    dob: "",
    gender: "",
    height: "",
    weight: "",
    healthHistory: "",
    allergies: "",
    emergencyContacts: [""]
  });

  useEffect(() => {
    const saved = localStorage.getItem("healthFormData");
    const isFitbitRedirect = window.location.pathname.includes("register-health") && window.location.search.includes("user=");
    if (saved && isFitbitRedirect) {
      setFormData(JSON.parse(saved));
    }
    return () => localStorage.removeItem("healthFormData");
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "emergencyContacts") {
      const updated = [...formData.emergencyContacts];
      updated[index] = value;
      setFormData({ ...formData, emergencyContacts: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, ""]
    });
  };

  const removeEmergencyContact = (index) => {
    const updated = [...formData.emergencyContacts];
    updated.splice(index, 1);
    setFormData({ ...formData, emergencyContacts: updated });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/register-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      if (data.message === "Health registration successful") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleConnectSmartwatch = () => {
    localStorage.setItem("healthFormData", JSON.stringify(formData));
    window.location.href = `http://localhost:3001/api/fitbit/auth?email=${encodeURIComponent(formData.email)}`;
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="new-health-container">
      <div className="new-health-header">
        <div className="new-health-text">Health Registration</div>
        <div className="new-health-underline"></div>
      </div>

      <div className="new-health-inputs">
        <div className="new-health-input"><input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} /></div>
        <div className="new-health-input"><input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} /></div>
        <div className="new-health-input">
          <input type="number" name="phone" placeholder="Phone" value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            onInput={(e) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
          />
        </div>
        <div className="new-health-input"><input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /></div>
        <div className="new-health-input" id="new-bgp">
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
        </div>
        <div className="new-health-input"><input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} /></div>
        <div className="new-health-input" id="new-gender_title">
          <label>Gender:</label>
          <div className="new-gender-group">
            <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female</label>
          </div>
        </div>
        <div className="new-health-input" id="new-dob_title">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </div>
        <div className="new-health-input"><input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} /></div>
        <div className="new-health-input"><input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} /></div>
        <div className="new-health-input"><textarea name="healthHistory" placeholder="Health History" value={formData.healthHistory} onChange={handleChange} rows="3" /></div>
        <div className="new-health-input"><textarea name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleChange} rows="3" /></div>
      </div>

      <div className="new-side-by-side-section">
        <div className="new-emergency-section">
          <label className="new-emergency-label">Emergency Contacts:</label>
          {formData.emergencyContacts.map((contact, i) => (
            <div className="new-emergency-input" key={i}>
              <input
                type="number"
                name="emergencyContacts"
                placeholder={`Contact ${i + 1}`}
                value={contact}
                onChange={(e) => handleChange(e, i)}
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
                onWheel={(e) => e.target.blur()}
              />
              <button className="new-remove-contact-btn" onClick={() => removeEmergencyContact(i)} title="Remove">
                <img src={remove_logo} alt="Remove" />
              </button>
            </div>
          ))}
          <button className="new-add-contact-btn" onClick={addEmergencyContact}>+ Add Contact</button>
        </div>

        <div className="new-smartwatch-section">
          <button className="new-health-submit" onClick={handleConnectSmartwatch}>
            Connect to Smartwatch
          </button>
        </div>
      </div>

      <div className="new-health-submit-container">
        <button className="new-health-submit" id ="final_submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default RegistrationForm;
