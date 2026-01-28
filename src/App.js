import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./r.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Surveillance from "./components/Surveillance";
import IrregularSpaceDetection from "./components/SpaceManagement";
import Notifications from "./components/Notifications";
import NoticeForm from "./components/NoticeForm";
import ModernChatbot from "./components/ModernCircular";
import CircularGenerator from "./components/CircularGenerator";
import DigiNotice from "./components/DigiNotice form";
import SampleUsers from "./components/CircuLibrary";
import ParentConnect from "./components/parentconnect";
import FacultyFeedbackEngine from "./components/Feeback";
import  SmartInvigilatorEngine from "./components/invi";
import SubjectsCurriculum from "./components/SubjectsCurriculum";
import SmartTimetablePro from "./components/TimetableFrontend";
/* ===== NEW COMPONENT ===== */
import StudentFeeAttendanceIntelligence from "./components/Course";
import StudentAttendanceAnalyticsEngine 
from "./components/StudentAttendanceAnalyticsEngine";
import AdminDashboard from "./AdminDashboard "
import HallTicketGenerator from "./components/HallTicketGenerator";
import SalaryManagement from "./components/SalaryManagement";
import BudgetAuditManagement from "./components/BudgetAuditManagement";
import FacultyWorkloadManager from "./components/FacultyWorkLoadManager";
import AdvancedLeaveManagementSystem from "./components/AdvancedLeaveManagementSystem";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/surveillance" element={<Surveillance />} />
        <Route path="/space" element={<IrregularSpaceDetection />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/circular-generator" element={<CircularGenerator />} />
        <Route path="/ModernChatbot" element={<ModernChatbot />} />
        <Route path="/AIApp" element={<NoticeForm />} />
        <Route path="/settings" element={<DigiNotice />} />
      <Route path="/exam/hallticket" element={<HallTicketGenerator />} />
       <Route path="/finance/salary" element={<SalaryManagement />} />
       <Route path="/finance/budget" element={<BudgetAuditManagement />} />
      <Route path="/leave-system" element={<AdvancedLeaveManagementSystem />} />
       <Route path="/admin/faculty-workload" element={<FacultyWorkloadManager />} />
        <Route path="/CircuAIApp" element={<SampleUsers />} />
        <Route path="/ParentConnect" element={<ParentConnect />} />
   <Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/admin-subjects" element={<SubjectsCurriculum />} />
   <Route path="/timetable" element={<SmartTimetablePro />} />
   
<Route path="/admin/faculty-workload" element={<FacultyWorkloadManager />} />





        
<Route
          path="/student-fee-attendance"
          element={<StudentFeeAttendanceIntelligence />}
        />
<Route
          path="/student-attendance-analytics"
          element={<StudentAttendanceAnalyticsEngine />}
        />
        <Route
  path="/smart-invigilator"
  element={<SmartInvigilatorEngine />}
/>
        {/* ✅ FACULTY FEEDBACK ENGINE */}
        <Route
          path="/faculty-feedback"
          element={<FacultyFeedbackEngine />}
        />
      </Routes>
    </Router>
  );
}

export default App;
