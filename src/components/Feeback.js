import React, { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

/* ================= CONFIG ================= */
const faculty_ids = Array.from({ length: 20 }, (_, i) => `F${100 + i}`);

const subjects = [
  "Python","AI","ML","Cloud","DSA","DBMS","Networks","Cybersecurity",
  "OS","Maths","Data Science","Big Data","IOT","Robotics",
  "Deep Learning","NLP","Compiler Design","Web Dev","Java","C Programming"
];

const facultySubjectMap = {};
faculty_ids.forEach((f, i) => (facultySubjectMap[f] = subjects[i]));

const domains = [
  "concept_explanation","real_life_examples","pace","doubt_handling",
  "clarity","language_clarity","interaction","communication",
  "knowledge_depth","industry_relevance","updated_content",
  "time_management","discipline_control","ppt_quality","assignment_quality"
];

const rand = (min, max) =>
  +(Math.random() * (max - min) + min).toFixed(2);

/* ================= COMPONENT ================= */
export default function FacultyFeedbackEngine() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const facultyData = useMemo(() => {
    return faculty_ids.map(fid => {
      let domainScores = {};
      domains.forEach(d => (domainScores[d] = rand(2.2, 4.8)));

      const avg =
        Object.values(domainScores).reduce((a, b) => a + b, 0) / domains.length;

      return {
        faculty_id: fid,
        subject: facultySubjectMap[fid],
        positive: Math.round(rand(55, 85)),
        neutral: Math.round(rand(10, 30)),
        negative: Math.round(rand(5, 20)),
        domainScores,
        avgScore: +avg.toFixed(2),
      };
    });
  }, []);

  const pieData = facultyData.map(f => ({
    name: f.faculty_id,
    value: f.avgScore,
  }));

  const getSuggestions = faculty => {
    const weak = Object.entries(faculty.domainScores)
      .filter(([_, v]) => v < 3.0)
      .map(([k]) => k.replace(/_/g, " "));

    return weak.length === 0
      ? ["✔ Outstanding performance. Keep it up!"]
      : weak.map(w => `⚠ Improve ${w}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617, #000)",
        color: "#e5e7eb",
        padding: 30,
        fontFamily: "Poppins, Segoe UI, sans-serif",
      }}
    >
  <h1 style={{
  textAlign: "center",
  color: "#f7fbfd",
  marginBottom: 30,
  fontSize: "72px",   // ONLY THIS CHANGED
  textShadow: "0 0 20px rgba(56,189,248,.6)"
}}>
  📊 Faculty Feedback Intelligence Dashboard
</h1>


      {/* ================= MAIN GRID ================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: 30,
          color: "yellow",
       fontSize: "62px", 
        alignItems: "stretch"
      }}>

        {/* ================= LEFT: PIE ================= */}
        <div style={{
          background: "#020617",
          borderRadius: 20,
          padding: 50,
          fontsize:  "70px",
          border: "1px solid #1e293b",
          boxShadow: "0 20px 60px rgba(0,0,0,.6)"
        }}>
        <h2
  style={{
    color: "#7dd3fc",
    fontSize: "70px",
    marginBottom: 10,
    fontWeight: "700",
    letterSpacing: "0.5px",
    textShadow: "0 0 15px rgba(56,189,248,.6)",
  }}
>
  🥧 Overall Faculty Rating Distribution
</h2>



          <div style={{ height: 800 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={400}
                  onClick={(_, index) =>
                    setSelectedFaculty(facultyData[index])
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${i * 18},70%,55%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p style={{ textAlign: "center", opacity: 0.7 }}>
            👉 Click on any slice to view faculty report
          </p>
        </div>

        {/* ================= RIGHT: DETAILS ================= */}
        <div style={{
          background: "#020617",
          borderRadius: 20,
          padding: 40,
          border: "1px solid #1e293b",
          boxShadow: "0 20px 60px rgba(0,0,0,.6)"
        }}>
          {!selectedFaculty ? (
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              fontSize: 52
            }}>
              👈 Select a faculty from the chart to view detailed AI report
            </div>
          ) : (
            <>
            
              <h2 style={{ color: "#7dd3fc",
    fontSize: "70px",
    marginBottom: 10,
    fontWeight: "700",
    letterSpacing: "0.5px",
    textShadow: "0 0 15px rgba(56,189,248,.6)", }}>🧑‍🏫 Faculty Performance Report</h2>

              <p><b>ID:</b> {selectedFaculty.faculty_id}</p>
              <p><b>Subject:</b> {selectedFaculty.subject}</p>

              <div style={{
                display: "flex",
                gap: 20,
                margin: "10px 0",
                fontSize: 50
              }}>
                <span>😊 {selectedFaculty.positive}%</span>
                <span>😐 {selectedFaculty.neutral}%</span>
                <span>☹ {selectedFaculty.negative}%</span>
              </div>

              <h3 style={{ marginTop: 15 }}>📊 Domain-wise Performance</h3>

              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={Object.entries(selectedFaculty.domainScores).map(
                      ([k, v]) => ({ domain: k, score: v })
                    )}
                  >
                    <XAxis dataKey="domain" hide />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#38bdf8" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h3
            style={{
            marginTop: "20px",
          fontSize: "56px",
          fontWeight: "800",
         color: "#7be511",
         textShadow: "0 0 12px rgba(250,204,21,.6)",
         letterSpacing: "0.5px",
         }}
>
         ⚠ AI Suggestions
        </h3>

              <ul>
                {getSuggestions(selectedFaculty).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <div style={{
                marginTop: 10,
                fontSize: 52,
                fontWeight: 700,
                color: "#22c55e"
              }}>
                🏆 Overall Score: {selectedFaculty.avgScore}
              </div>

              <button
                style={{
                  marginTop: 15,
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(90deg,#2563eb,#38bdf8)",
                  color: "white",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedFaculty(null)}
              >
                Close Report
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



