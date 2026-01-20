import React, { useState } from "react";


const data = [
  {
    sem: "Semester 1",
    cr: "Akhil Kumar",
    subjects: [
      { name: "Engineering Mathematics-I", faculty: "Dr. S. Rao" },
      { name: "Engineering Physics", faculty: "Dr. Sharma" },
      { name: "Programming in C", faculty: "Ms. Priya" },
      { name: "Basic Electrical Engg", faculty: "Mr. Ramesh" },
      { name: "English Communication", faculty: "Ms. Anjali" },
      { name: "C Programming Lab", faculty: "Ms. Priya" }
    ]
  },
  {
    sem: "Semester 2",
    cr: "Sneha Reddy",
    subjects: [
      { name: "Engineering Mathematics-II", faculty: "Dr. S. Rao" },
      { name: "Data Structures", faculty: "Mr. Naveen" },
      { name: "Python Programming", faculty: "Ms. Kavya" },
      { name: "Digital Logic Design", faculty: "Mr. Suresh" },
      { name: "Environmental Science", faculty: "Ms. Anjali" },
      { name: "Python Lab", faculty: "Ms. Kavya" }
    ]
  },
  {
    sem: "Semester 3",
    cr: "Rahul Verma",
    subjects: [
      { name: "Discrete Mathematics", faculty: "Dr. S. Rao" },
      { name: "OOP Java", faculty: "Mr. Naveen" },
      { name: "Operating Systems", faculty: "Mr. Ramesh" },
      { name: "DBMS", faculty: "Ms. Swathi" },
      { name: "Software Engineering", faculty: "Mr. Kiran" },
      { name: "Java & DBMS Lab", faculty: "Ms. Swathi" }
    ]
  },
  {
    sem: "Semester 4",
    cr: "Pooja Singh",
    subjects: [
      { name: "Computer Networks", faculty: "Mr. Suresh" },
      { name: "DAA", faculty: "Dr. Sharma" },
      { name: "Computer Organization", faculty: "Mr. Ramesh" },
      { name: "TOC", faculty: "Dr. Sharma" },
      { name: "Web Technologies", faculty: "Ms. Kavya" },
      { name: "Web & CN Lab", faculty: "Ms. Kavya" }
    ]
  },
  {
    sem: "Semester 5",
    cr: "Arjun Patel",
    subjects: [
      { name: "Artificial Intelligence", faculty: "Dr. Priya" },
      { name: "Machine Learning", faculty: "Dr. Priya" },
      { name: "Cloud Computing", faculty: "Mr. Naveen" },
      { name: "IoT", faculty: "Mr. Suresh" },
      { name: "Cryptography", faculty: "Dr. Sharma" },
      { name: "AI & ML Lab", faculty: "Dr. Priya" }
    ]
  },
  {
    sem: "Semester 6",
    cr: "Neha Gupta",
    subjects: [
      { name: "Deep Learning", faculty: "Dr. Priya" },
      { name: "Big Data Analytics", faculty: "Mr. Naveen" },
      { name: "Data Science", faculty: "Dr. S. Rao" },
      { name: "Compiler Design", faculty: "Mr. Kiran" },
      { name: "Robotics", faculty: "Mr. Ramesh" },
      { name: "Data Science Lab", faculty: "Dr. Priya" }
    ]
  },
  {
    sem: "Semester 7",
    cr: "Karthik Reddy",
    subjects: [
      { name: "NLP", faculty: "Dr. Priya" },
      { name: "Blockchain", faculty: "Dr. Sharma" },
      { name: "AR & VR", faculty: "Mr. Suresh" },
      { name: "Elective – Cyber Security", faculty: "Mr. Kiran" },
      { name: "Seminar", faculty: "Dept. Coordinator" },
      { name: "Project Phase – I", faculty: "Project Guides" }
    ]
  },
  {
    sem: "Semester 8",
    cr: "Anusha (Coordinator)",
    subjects: [
      { name: "Project Phase – II", faculty: "Project Guides" },
      { name: "Internship", faculty: "Training Cell" },
      { name: "Comprehensive Viva", faculty: "Dept. Panel" },
      { name: "Technical Seminar", faculty: "Dept. Panel" },
      { name: "Elective – Advanced AI", faculty: "Dr. Priya" }
    ]
  }
];

export default function SubjectsCurriculum() {
  const [open, setOpen] = useState(null);

  return (
    <div className="curriculum-container">
      <h1>📚 Subjects & Curriculum (1st – 8th Semester)</h1>
      <p className="subtitle">Faculty & Class Representative Details</p>

      {data.map((sem, idx) => (
        <div key={idx} className="sem-card">
          <div
            className="sem-header"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <h2>{sem.sem}</h2>
            <span>Class Rep: {sem.cr}</span>
          </div>

          {open === idx && (
            <div className="sem-body">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((s, i) => (
                    <tr key={i}>
                      <td>{s.name}</td>
                      <td>{s.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
