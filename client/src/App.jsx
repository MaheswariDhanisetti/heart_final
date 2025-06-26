import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignUp from "./components/login_signup";
import RegistrationForm from "./components/RegistrationForm";
import LandingPage from "./components/LandingPage";
import FitbitDashboard from "./components/FitbitDashboard";
import SymptomChecker from "./components/SymptomChecker";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login_signup" element={<LoginSignUp />} />
        <Route path="/register-health" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginSignUp />} />
         <Route path="/main_page" element={<Sidebar> <FitbitDashboard/> </Sidebar>} />
        <Route path="/symptom-checker" element={<Sidebar> <SymptomChecker/> </Sidebar>}/>
        <Route path="/profile" element={<Sidebar> <Profile/> </Sidebar>}/>
      </Routes>
    </Router>
  );
};

export default App;
