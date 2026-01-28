import React, { useMemo, useState } from "react";

/* ===================== DATA GENERATION ===================== */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const names = [
  "Aarav Reddy","Vihaan Kumar","Aditya Sharma","Rahul Verma","Karthik Naidu",
  "Sneha Gupta","Ananya Iyer","Pooja Singh","Rohan Patel","Neeraj Rao"
];

const generateStudents = () =>
  Array.from({ length: 100 }, (_, i) => {
    const isJVD = Math.random() < 0.55;
    const semFee = 50000;
    const busFee = Math.random() < 0.5 ? 15000 : 0;
    const hostelFee = Math.random() < 0.4 ? 60000 : 0;

    const paid = isJVD
      ? (semFee * rand(70, 100)) / 100
      : rand(20000, semFee + busFee + hostelFee);

    const totalFee = semFee + busFee + hostelFee;
    const due = Math.max(0, totalFee - paid);
    const attendance = due > 0 ? rand(55, 70) : rand(75, 95);

    return {
      id: `S${1000 + i}`,
      name: names[rand(0, names.length - 1)],
      category: isJVD ? "JVD" : "NON-JVD",
      semFee,
      busFee,
      hostelFee,
      totalFee,
      paid,
      due,
      attendance,
      logs: [
        `Semester Fee: ₹${semFee}`,
        busFee ? `Bus Fee: ₹${busFee}` : "Bus Fee: Not opted",
        hostelFee ? `Hostel Fee: ₹${hostelFee}` : "Hostel Fee: Not opted",
        `Paid Amount: ₹${paid}`,
        due > 0 ? `Due Amount: ₹${due}` : "No Due",
        `Attendance impacted due to fee: ${due > 0 ? "YES" : "NO"}`
      ]
    };
  });

/* ===================== COMPONENT ===================== */
export default function StudentFeeAttendanceIntelligence() {
  const [students] = useState(generateStudents());
  const [selected, setSelected] = useState(null);

  const summary = useMemo(() => {
    let paid = 0, due = 0, jvd = 0, nonjvd = 0, totalCollection = 0;

    students.forEach(s => {
      totalCollection += s.paid;
      if (s.due === 0) paid++;
      else due++;
      if (s.category === "JVD") jvd++;
      else nonjvd++;
    });

    return { paid, due, jvd, nonjvd, totalCollection };
  }, [students]);

  return (
    <div className="fee-ai">
      <h1>💰 Student Fee–Attendance Intelligence</h1>

      <div className="summary">
        <div className="box green">Fully Paid<br />{summary.paid}</div>
        <div className="box red">Due Students<br />{summary.due}</div>
        <div className="box blue">JVD<br />{summary.jvd}</div>
        <div className="box yellow">Non-JVD<br />{summary.nonjvd}</div>
      </div>

      <div className="collection">
        💵 Total Collection: ₹{summary.totalCollection.toLocaleString()}
      </div>

      <div className="table">
        <div className="row head">
          <span>Name</span>
          <span>Type</span>
          <span>Attendance</span>
          <span>Status</span>
        </div>

        {students.map(s => (
          <div
            key={s.id}
            className={`row ${s.due > 0 ? "due" : "paid"}`}
            onClick={() => setSelected(s)}
          >
            <span>{s.name}</span>
            <span>{s.category}</span>
            <span>{s.attendance}%</span>
            <span>{s.due > 0 ? "DUE" : "PAID"}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-box">
            <h2>{selected.name}</h2>
            <p><b>Category:</b> {selected.category}</p>
            <p><b>Attendance:</b> {selected.attendance}%</p>

            <h3>📄 Financial Log</h3>
            <ul>
              {selected.logs.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>

            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

