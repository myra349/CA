import React, { useMemo, useState } from "react";


/* ---------------- CONFIG ---------------- */
const NUM_FACULTY = 200;
const departments = ["CSE", "ECE", "EEE", "IT", "AIML", "DS"];
const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* --------- AI SCORING MODEL --------- */
const computeMPI = (pos, neu, neg, penalty, confidence) => {
  const raw =
    pos * 1.2 +
    neu * 0.6 -
    neg * 1.3 -
    penalty;

  return Math.max(0, Math.round(raw * confidence));
};

const FacultyFeedbackUltraEngine = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  /* --------- DATA GENERATION --------- */
  const facultyData = useMemo(() => {
    let data = [];

    for (let i = 0; i < NUM_FACULTY; i++) {
      const positive = rand(30, 85);
      const neutral = rand(5, 40);
      const negative = Math.max(0, 100 - positive - neutral);
      const behaviourPenalty = rand(0, 12);
      const confidence = +(Math.random() * (0.98 - 0.75) + 0.75).toFixed(2);

      const score = computeMPI(
        positive,
        neutral,
        negative,
        behaviourPenalty,
        confidence
      );

      data.push({
        id: `F${2000 + i}`,
        name: `Faculty_${i + 1}`,
        dept: departments[rand(0, departments.length - 1)],
        positive,
        neutral,
        negative,
        behaviourPenalty,
        confidence,
        score,
        recommendation:
          score >= 75
            ? "Incentives"
            : score >= 50
            ? "Maintain"
            : score >= 35
            ? "Training"
            : "Reduce Load",
      });
    }
    return data.sort((a, b) => b.score - a.score);
  }, []);

  /* --------- DEPARTMENT ANALYTICS --------- */
  const deptAnalytics = useMemo(() => {
    const map = {};
    facultyData.forEach(f => {
      if (!map[f.dept]) map[f.dept] = [];
      map[f.dept].push(f.score);
    });

    return Object.entries(map).map(([dept, scores]) => {
      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance =
        scores.reduce((s, x) => s + (x - avg) ** 2, 0) / scores.length;

      return {
        dept,
        avg: Math.round(avg),
        variance: Math.round(variance),
        risk: avg < 45 ? "High" : avg < 60 ? "Medium" : "Low",
      };
    });
  }, [facultyData]);

  return (
    <div className="ultra-container">
      

      {/* --------- DEPT DASHBOARD --------- */}
      <div className="dept-board">
        {deptAnalytics.map(d => (
          <div key={d.dept} className={`dept-card ${d.risk}`}>
            <h3>{d.dept}</h3>
            <p>Avg Score: {d.avg}</p>
            <p>Variance: {d.variance}</p>
            <p>Risk Level: {d.risk}</p>
          </div>
        ))}
      </div>

      {/* --------- FACULTY GRID --------- */}
      <div className="faculty-grid">
        {facultyData.map(f => (
          <div
            key={f.id}
            className="faculty-card"
            onClick={() => setSelectedFaculty(f)}
          >
            <h3>{f.name}</h3>
            <p>{f.id} | {f.dept}</p>

            <div className="bar">
              <div
                className="fill"
                style={{ width: `${f.score}%` }}
              />
            </div>

            <p className="score">{f.score}</p>
            <span className="rec">{f.recommendation}</span>
          </div>
        ))}
      </div>

      {/* --------- EXPLAINABLE AI PANEL --------- */}
      {selectedFaculty && (
        <div className="explain-panel">
          <h2>🔍 Explainable AI – {selectedFaculty.name}</h2>
          <p>Positive Feedback: {selectedFaculty.positive}%</p>
          <p>Neutral Feedback: {selectedFaculty.neutral}%</p>
          <p>Negative Feedback: {selectedFaculty.negative}%</p>
          <p>Behaviour Penalty: −{selectedFaculty.behaviourPenalty}</p>
          <p>Confidence Factor: {selectedFaculty.confidence}</p>

          <strong>
            Final MPI Score: {selectedFaculty.score}
          </strong>

          <p className="decision">
            AI Recommendation: {selectedFaculty.recommendation}
          </p>

          <button onClick={() => setSelectedFaculty(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyFeedbackUltraEngine;

