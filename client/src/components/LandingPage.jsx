import React, { useRef } from "react";
import Navbar from "./Navbar_landing_page";
import HomeSection from "./Home_landing_page";
import AboutUsSection from "./About_us";
import ContactUsSection from "./Contact_us";

const LandingPage = () => {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar
        scrollToAbout={() => scrollToSection(aboutRef)}
        scrollToContact={() => scrollToSection(contactRef)}
      />
      <HomeSection
        scrollToAbout={() => scrollToSection(aboutRef)}
        scrollToContact={() => scrollToSection(contactRef)}
      />
      <div ref={aboutRef}><AboutUsSection /></div>
      <div ref={contactRef}><ContactUsSection /></div>
    </>
  );
};

export default LandingPage;
