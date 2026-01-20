import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    show: false,
    title: "",
    description: "",
    route: ""
  });

  const handleNavClick = (title, description, route) => {
    setInfo({ show: true, title, description, route });

    setTimeout(() => {
      setInfo({ show: false, title: "", description: "", route: "" });
      navigate(route);
    }, 1200);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="xp-navbar">

        {/* LOGO */}
        <div
          className="xp-logo"
          onClick={() =>
            handleNavClick(
              "Vistar Netra",
              "AI-powered Smart Campus Management Platform integrating academics, administration, safety, and analytics into one unified system.",
              "/"
            )
          }
        >
          Vistar Netra
        </div>

        {/* MENU */}
        <ul className="xp-links">

          <li onClick={() => handleNavClick("Home","Centralized dashboard overview","/")}>Home</li>

          <li onClick={() => handleNavClick("Campus Vistara","Smart campus infrastructure","/space")}>
            Campus Vistara
          </li>

          
          <li onClick={() => handleNavClick("Student Mitra","Student mentoring system","/CircuAIApp")}>
            Student Mitra
          </li>

          <li onClick={() => handleNavClick("Smart Timetable","Automatic timetable generation","/TimetableFrontend")}>
            Smart Timetable
          </li>

          <li onClick={() => handleNavClick("Academic Health","Attendance analytics","/student-attendance-analytics")}>
            Academic Health
          </li>

          <li onClick={() => handleNavClick("Fee Intelligence","Fee + attendance analytics","/student-fee-attendance")}>
            Fee Intelligence
          </li>

          <li onClick={() => handleNavClick("Invigilator Engine","Exam invigilation system","/smart-invigilator")}>
            Invigilator Engine
          </li>

          <li onClick={() => handleNavClick("Feedback AI","Faculty feedback analytics","/faculty-feedback")}>
            Feedback AI
          </li>

          {/* ================= ADMIN LINKS ================= */}

          <li onClick={() => handleNavClick("Admin Dashboard","Central admin control panel","/admin-dashboard")}>
             Admin Dashboard
          </li>

          <li onClick={() => handleNavClick("Subjects & Curriculum","Manage curriculum","/admin-subjects")}>
             Subjects & Curriculum
          </li>

          <li onClick={() => window.open("https://lbrce.ac.in/academic_pages/aycalender.php", "_blank")}>
             Academic Calendar
          </li>

          <li onClick={() => window.open("https://lbrce.ac.in/administration_pages/academiccouncil.php", "_blank")}>
             Academic Council
          </li>

          <li onClick={() => window.open("https://lbrce.ac.in/examsection_pages/studentverification.php", "_blank")}>
             Student Verification
          </li>

        </ul>
      </nav>

      {/* ================= INFO OVERLAY ================= */}
      {info.show && (
        <div className="info-overlay">
          <div className="info-card">
            <h2>{info.title}</h2>
            <p>{info.description}</p>
            <div className="info-loader"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

