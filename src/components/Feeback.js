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
const FacultyFeedbackEngine = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const facultyData = useMemo(() => {
    return faculty_ids.map(fid => {
      let domainScores = {};
      domains.forEach(d => (domainScores[d] = rand(2.2, 4.8)));

      const avg =
        Object.values(domainScores).reduce((a, b) => a + b, 0) /
        domains.length;

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
    <>
      {/* ================= CSS INSIDE SAME FILE ================= */}
    

      <div className="ffe-container">
        <h1>📊 Faculty Feedback Intelligence Engine</h1>

        {/* PIE */}
        <div className="chart-card" style={{ height:1040 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={420}
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

          <p className="hint">
            👉 Click on any radius  to view AI-generated report on Faculty Feedback
          </p>
        </div>

        {/* DETAIL */}
        {selectedFaculty && (
          <div className="explain-panel">
            <h2>🧑‍🏫 Faculty Performance Report</h2>

            <p><b>ID:</b> {selectedFaculty.faculty_id}</p>
            <p><b>Subject:</b> {selectedFaculty.subject}</p>

            <div className="stats">
              😊 {selectedFaculty.positive}% &nbsp;
              😐 {selectedFaculty.neutral}% &nbsp;
              ☹ {selectedFaculty.negative}%
            </div>

            <h3>📌 Domain Performance</h3>
            <div style={{ width: "200%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart
                  data={Object.entries(selectedFaculty.domainScores).map(
                    ([k, v]) => ({ domain: k, score: v })
                  )}
                >
                  <XAxis dataKey="domain" hide />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#38bdf8" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h3>⚠ AI Suggestions</h3>
            <ul>
              {getSuggestions(selectedFaculty).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div className="score">
              🏆 Overall Score: {selectedFaculty.avgScore}
            </div>

            <button onClick={() => setSelectedFaculty(null)}>
              Close Report
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FacultyFeedbackEngine;


