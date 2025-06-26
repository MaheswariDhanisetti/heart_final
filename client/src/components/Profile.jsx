import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import defaultAvatar from "../assets/person_icon.png";
import "../styles/Profile.css"; // updated import path

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`http://localhost:3001/api/profile?email=${userEmail}`)
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error("❌ Failed to fetch profile:", err));
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFieldEdit = (field) => {
    setEditField(field);
  };

  const handleBlur = (field) => {
    setEditField(null);
    autoSave(formData);
  };

  const handleEmergencyChange = (index, value) => {
    const updated = [...formData.emergencyContacts];
    updated[index] = value.replace(/\D/g, "").slice(0, 10);
    const updatedForm = { ...formData, emergencyContacts: updated };
    setFormData(updatedForm);
    autoSave(updatedForm);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValid = ["image/png", "image/jpeg"].includes(file.type);
    if (!isValid) {
      alert("Only PNG or JPG files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedForm = { ...formData, profileImage: reader.result };
      setFormData(updatedForm);
      autoSave(updatedForm);
    };
    reader.readAsDataURL(file);
  };

  const autoSave = (data) => {
    axios
      .put("http://localhost:3001/api/profile", data)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("❌ Failed to update profile:", err));
  };

  if (!userEmail) return <p>Please login to view your profile.</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="nprofile-container">
      <div className="nprofile-card">
        <div className="nprofile-upper">
          <div className="nprofile-left">
            <div className="nprofile-pic-box">
              <label htmlFor="profile-pic-input">
                <img
                  src={formData.profileImage || defaultAvatar}
                  alt="Profile"
                  className="nprofile-pic"
                />
                <FaEdit className="nedit-icon" />
              </label>
              <input
                type="file"
                id="profile-pic-input"
                accept="image/png, image/jpeg"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="nprofile-right">
            <h2>Basic Details</h2>
            <div className="ngrid">
              {["firstName", "lastName", "age", "phone", "gender"].map((key) => (
                <div className="nfield-row" key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <div className="neditable-field">
                    {editField === key ? (
                      <input
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        onBlur={() => handleBlur(key)}
                        autoFocus
                      />
                    ) : (
                      <span>
                        {formData[key] || "-"}
                        <FaEdit
                          className="nedit-icon"
                          onClick={() => handleFieldEdit(key)}
                        />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="nfield-row">
                <label>Email:</label>
                <span>{formData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="nprofile-lower">
          <h3>Health Info:</h3>
          <div className="ngrid">
            {["bloodGroup", "height", "weight", "healthHistory", "allergies"].map(
              (field) => (
                <div className="nfield-row" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <div className="neditable-field">
                    {editField === field ? (
                      <input
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        onBlur={() => handleBlur(field)}
                        autoFocus
                      />
                    ) : (
                      <span>
                        {formData[field] || "-"}
                        <FaEdit
                          className="nedit-icon"
                          onClick={() => handleFieldEdit(field)}
                        />
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="nemergency-section">
            <h3>Emergency Contacts</h3>
            <div className="ngrid">
              {formData.emergencyContacts?.map((num, i) => (
                <div key={i} className="nfield-row">
                  <label>Contact {i + 1}:</label>
                  <input
                    type="text"
                    value={num}
                    onChange={(e) => handleEmergencyChange(i, e.target.value)}
                    maxLength={10}
                  />
                  <button
                    onClick={() => {
                      const updated = formData.emergencyContacts.filter(
                        (_, j) => j !== i
                      );
                      const updatedForm = {
                        ...formData,
                        emergencyContacts: updated,
                      };
                      setFormData(updatedForm);
                      autoSave(updatedForm);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = [...(formData.emergencyContacts || []), ""];
                  const updatedForm = {
                    ...formData,
                    emergencyContacts: updated,
                  };
                  setFormData(updatedForm);
                  autoSave(updatedForm);
                }}
              >
                + Add Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
