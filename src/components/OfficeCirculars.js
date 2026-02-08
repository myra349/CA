import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MOCK DATA ================= */

const departments = ["All","Exam","Academics","Admin","Faculty","Finance","Library","Infra"];

const initialCirculars = [
  {
    id:"CIR-001",
    title:"Mid Semester Examination Schedule",
    dept:"Exam",
    issuedBy:"Controller of Examinations",
    date:"2026-02-01",
    status:"Published",
    content:"Mid semester examinations will commence from 10th February. All departments must strictly follow the published schedule."
  },
  {
    id:"CIR-002",
    title:"Faculty Meeting – Academic Planning",
    dept:"Academics",
    issuedBy:"Dean Academics",
    date:"2026-02-03",
    status:"Draft",
    content:"All faculty members are requested to attend the academic planning meeting scheduled next week."
  },
  {
    id:"CIR-003",
    title:"Holiday Declaration – Maha Shivaratri",
    dept:"Admin",
    issuedBy:"Registrar",
    date:"2026-02-05",
    status:"Published",
    content:"The institution will remain closed on account of Maha Shivaratri."
  },
  {
    id:"CIR-004",
    title:"Internal Assessment – I Schedule",
    dept:"Exam",
    issuedBy:"Controller of Examinations",
    date:"2026-02-06",
    status:"Published",
    content:"The schedule for Internal Assessment – I has been finalized and departments are instructed to follow the same strictly."
  },
  {
    id:"CIR-005",
    title:"Submission of Course Files – Even Semester",
    dept:"Academics",
    issuedBy:"Dean Academics",
    date:"2026-02-07",
    status:"Published",
    content:"All faculty members must submit course files for the even semester on or before the prescribed deadline."
  },
  {
    id:"CIR-006",
    title:"Library Digital Resources Orientation Program",
    dept:"Library",
    issuedBy:"Chief Librarian",
    date:"2026-02-08",
    status:"Draft",
    content:"An orientation program on digital resources and e-journals will be conducted for students and faculty members."
  },
  {
    id:"CIR-007",
    title:"Campus Network Maintenance Notice",
    dept:"Infra",
    issuedBy:"IT Infrastructure Head",
    date:"2026-02-09",
    status:"Published",
    content:"The campus network will undergo scheduled maintenance. Temporary service interruptions may occur."
  },
  {
    id:"CIR-008",
    title:"Faculty Workload Submission Guidelines",
    dept:"Faculty",
    issuedBy:"Dean Faculty Affairs",
    date:"2026-02-10",
    status:"Published",
    content:"All departments must submit updated faculty workload details as per the prescribed format."
  },
  {
    id:"CIR-009",
    title:"Student Feedback Survey – Even Semester",
    dept:"Academics",
    issuedBy:"IQAC Coordinator",
    date:"2026-02-11",
    status:"Draft",
    content:"Students are requested to submit feedback for the even semester through the online feedback portal."
  },
  {
    id:"CIR-010",
    title:"Annual Budget Proposal Submission",
    dept:"Finance",
    issuedBy:"Finance Officer",
    date:"2026-02-12",
    status:"Published",
    content:"All departments must submit their annual budget proposals for the next financial year."
  },
  {
    id:"CIR-011",
    title:"NAAC Documentation Review Meeting",
    dept:"Admin",
    issuedBy:"NAAC Coordinator",
    date:"2026-02-13",
    status:"Published",
    content:"A review meeting will be conducted to assess the preparedness of NAAC documentation."
  },
  {
    id:"CIR-012",
    title:"Workshop on Outcome Based Education (OBE)",
    dept:"Academics",
    issuedBy:"Dean Academics",
    date:"2026-02-14",
    status:"Published",
    content:"A workshop on Outcome Based Education will be organized for all teaching staff."
  },
  {
    id:"CIR-013",
    title:"Laboratory Safety Audit Schedule",
    dept:"Infra",
    issuedBy:"Safety Officer",
    date:"2026-02-15",
    status:"Draft",
    content:"Safety audits will be conducted in all laboratories to ensure compliance with safety standards."
  },
  {
    id:"CIR-014",
    title:"Recruitment Drive – Guest Faculty",
    dept:"Faculty",
    issuedBy:"HR Manager",
    date:"2026-02-16",
    status:"Published",
    content:"Departments are invited to submit requirements for guest faculty recruitment."
  },
  {
    id:"CIR-015",
    title:"Library Book Stock Verification",
    dept:"Library",
    issuedBy:"Chief Librarian",
    date:"2026-02-17",
    status:"Published",
    content:"Annual physical verification of library book stock will be conducted as per schedule."
  },
  {
    id:"CIR-016",
    title:"Revised Academic Calendar – Even Semester",
    dept:"Academics",
    issuedBy:"Dean Academics",
    date:"2026-02-18",
    status:"Published",
    content:"The revised academic calendar for the even semester is hereby notified."
  },
  {
    id:"CIR-017",
    title:"Energy Conservation Awareness Program",
    dept:"Admin",
    issuedBy:"Green Campus Committee",
    date:"2026-02-19",
    status:"Draft",
    content:"An awareness program on energy conservation will be conducted for students and staff."
  },
  {
    id:"CIR-018",
    title:"Data Security & Cyber Awareness Session",
    dept:"Infra",
    issuedBy:"IT Security Officer",
    date:"2026-02-20",
    status:"Published",
    content:"A cyber security awareness session will be conducted for faculty and administrative staff."
  }
];

/* ================= COMPONENT ================= */

function OfficeCirculars(){

  const navigate = useNavigate();

  const [circulars, setCirculars] = useState(initialCirculars);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    return circulars.filter(c => {

      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.content.toLowerCase().includes(search.toLowerCase());

      const matchDept =
        filterDept === "All" || c.dept === filterDept;

      return matchSearch && matchDept;
    });
  }, [circulars, search, filterDept]);

  /* ================= ACTIONS ================= */

  const createNew = () => {
    setEditing({
      id: "CIR-" + String(circulars.length + 1).padStart(3,"0"),
      title:"",
      dept:"All",
      issuedBy:"",
      date:new Date().toISOString().slice(0,10),
      status:"Draft",
      content:""
    });
  };

  const saveCircular = () => {

    if(!editing.title || !editing.issuedBy){
      alert("Title and Issued By are required");
      return;
    }

    setCirculars(prev => {

      const exists = prev.find(c => c.id === editing.id);

      if(exists){
        return prev.map(c => c.id === editing.id ? editing : c);
      }else{
        return [editing, ...prev];
      }

    });

    setEditing(null);
  };

  const deleteCircular = (id) => {

    if(!window.confirm("Delete this circular?")) return;

    setCirculars(prev => prev.filter(c => c.id !== id));
  };

  const publishCircular = (c) => {

    setCirculars(prev =>
      prev.map(x =>
        x.id === c.id
          ? { ...x, status:"Published" }
          : x
      )
    );
  };

  return (
    <div className="oc-root">

      {/* TOP BAR */}
      <div className="oc-top">

        <button
          className="oc-back"
          onClick={() =>
            navigate("/dashboard",{ state:{ openDept:"admin" }})
          }
        >
          ⬅ Back
        </button>

        <div className="oc-title">
          Office Circulars & Notifications
        </div>

        <button className="oc-new" onClick={createNew}>
          ➕ New Circular
        </button>

      </div>

      {/* FILTER BAR */}
      <div className="oc-filters">

        <input
          placeholder="Search circulars..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />

        <select
          value={filterDept}
          onChange={e=>setFilterDept(e.target.value)}
        >
          {departments.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>

      </div>

      {/* LIST */}
      <div className="oc-list">

        {filtered.map(c => (
          <div key={c.id} className="oc-card">

            <div className="oc-head">
              <h3>{c.title}</h3>
              <span className={c.status === "Published" ? "pub" : "draft"}>
                {c.status}
              </span>
            </div>

            <div className="oc-meta">
              <span>{c.dept}</span>
              <span>Issued by {c.issuedBy}</span>
              <span>{c.date}</span>
            </div>

            <p className="oc-preview">
              {c.content.slice(0,160)}...
            </p>

            <div className="oc-actions">

              <button onClick={() => setViewing(c)}>View</button>

              <button onClick={() => setEditing(c)}>Edit</button>

              {c.status === "Draft" && (
                <button onClick={() => publishCircular(c)}>
                  Publish
                </button>
              )}

              <button className="danger" onClick={() => deleteCircular(c.id)}>
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* VIEW MODAL */}
      {viewing && (
        <div className="oc-modal">

          <div className="oc-modal-box">

            <h2>{viewing.title}</h2>

            <div className="oc-meta big">
              <span>{viewing.dept}</span>
              <span>Issued by {viewing.issuedBy}</span>
              <span>{viewing.date}</span>
            </div>

            <div className="oc-content">
              {viewing.content}
            </div>

            <div className="oc-modal-actions">
              <button onClick={() => setViewing(null)}>Close</button>
            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="oc-modal">

          <div className="oc-modal-box">

            <h2>{editing.id ? "Edit Circular" : "New Circular"}</h2>

            <div className="oc-form">

              <input
                placeholder="Circular Title"
                value={editing.title}
                onChange={e=>setEditing({...editing,title:e.target.value})}
              />

              <select
                value={editing.dept}
                onChange={e=>setEditing({...editing,dept:e.target.value})}
              >
                {departments.map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <input
                placeholder="Issued By"
                value={editing.issuedBy}
                onChange={e=>setEditing({...editing,issuedBy:e.target.value})}
              />

              <textarea
                rows={6}
                placeholder="Circular content..."
                value={editing.content}
                onChange={e=>setEditing({...editing,content:e.target.value})}
              />

            </div>

            <div className="oc-modal-actions">
              <button onClick={saveCircular}>Save</button>
              <button className="ghost" onClick={()=>setEditing(null)}>Cancel</button>
            </div>

          </div>

        </div>
      )}

      {/* CSS */}
      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css = `
.oc-root{
  min-height:400vh;
  background:#020617;
  color:#e5e7eb;
  font-size:50px;
  padding:30px 40px 70px;
  font-family:'Inter','Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif;
}

/* TOP */
.oc-top{
  display:flex;
  align-items:center;
  font-size:60px;
  justify-content:space-between;
  margin-bottom:20px;
}

.oc-title{
  font-size:70px;
  font-weight:900;
  color:#38bdf8;
}

.oc-back{
  background:#020617;
  border:1px solid #1e293b;
  color:#cbd5f5;
  padding:8px 14px;
  border-radius:10px;
  cursor:pointer;
}

.oc-new{
  background:linear-gradient(135deg,#38bdf8,#22d3ee);
  border:none;
  color:#020617;
  font-weight:800;
  padding:8px 14px;
  border-radius:10px;
  cursor:pointer;
}

/* FILTERS */
.oc-filters{
  display:flex;
  gap:10px;
  margin-bottom:20px;
}

.oc-filters input,
.oc-filters select{
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #1e293b;
  background:#0b1020;
  color:white;
}

/* LIST */
.oc-list{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(1820px,10fr));
  gap:15px;
}

.oc-card{
  background:#020617;
  border:1px solid #1e293b;
  border-radius:16px;
  padding:16px;
  box-shadow:0 0 25px rgba(0,0,0,.4);
}

.oc-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:46px;
  margin-bottom:6px;
}

.oc-head h3{
  font-size:46px;
}

.pub{
  color:#22c55e;
  font-weight:700;
}
.draft{
  color:#facc15;
  font-weight:700;
}

.oc-meta{
  display:flex;
  gap:10px;
  font-size:52px;
  color:#94a3b8;
  margin-bottom:8px;
}
.oc-meta.big
  margin:12px 0;
}

.oc-preview{
  font-size:53px;
  color:#cbd5f5;
  line-height:1.5;
  margin-bottom:12px;
}

/* ACTIONS */
.oc-actions{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.oc-actions button{
  padding:6px 10px;
  border-radius:8px;
  border:none;
  cursor:pointer;
  background:#2563eb;
  color:white;
  gap:80px,
  margin:14px 50;
  font-size:55px;
}

.oc-actions .danger{
  background:#7f1d1d;
}

/* MODAL */
.oc-modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.7);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
}

.oc-modal-box{
  background:#020617;
  width:1600px;
  max-height:1780vh;
  overflow-y:auto;
  border-radius:16px;
  padding:20px;
  box-shadow:0 0 30px rgba(56,189,248,.35);
}

.oc-form{
  display:flex;
  flex-direction:column;
  gap:10px;
  font-size:50px;
  margin:14px 0;
}

.oc-form input,
.oc-form select,
.oc-form textarea{
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #1e293b;
  background:#0b1020;
  font-size:70px;
  color:white;
}

/* MODAL ACTIONS */
.oc-modal-actions{
  display:flex;
  gap:10px;
  justify-content:flex-end;
}

.oc-modal-actions button{
  padding:8px 12px;
  border-radius:8px;
  border:none;
  cursor:pointer;
}

.oc-modal-actions .ghost{
  background:#475569;
  color:white;
}
`;

export default OfficeCirculars;
export { OfficeCirculars }


