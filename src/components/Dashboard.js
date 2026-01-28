import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


/* ===================== MODULE CONFIG ===================== */
const MODULES = [
  {
    key:"exam",
    title:"Controller of Examinations",
    desc:"Manage examinations, hall tickets, room allocation and invigilation duties.",
    user:"exam",
    pass:"1234",
    img:"https://i.pinimg.com/736x/7f/8a/60/7f8a6099a523cc79342eaee0a29e92f8.jpg"
  },
  {
    key:"academics",
    title:"Academic Affairs Division",
    desc:"Handle curriculum planning, timetable scheduling and academic regulations.",
    user:"academics",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200"
  },
  {
    key:"admin",
    title:"Central Administration Office",
    desc:"Oversee institutional administration, governance and official records.",
    user:"admin",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200"
  },
  {
    key:"infra",
    title:"Campus Infrastructure & Facilities",
    desc:"Manage buildings, classrooms, laboratories and physical infrastructure.",
    user:"infra",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200"
  },
  {
    key:"faculty",
    title:"Faculty Affairs & HR Division",
    desc:"Manage faculty recruitment, workload distribution and HR operations.",
    user:"faculty",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200"
  },
  {
    key:"finance",
    title:"Finance & Accounts Department",
    desc:"Handle budgets, salaries, audits and financial planning.",
    user:"finance",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200"
  },
  {
    key:"analytics",
    title:"Institutional Planning & Analytics",
    desc:"Provide reports, insights and data-driven decision support.",
    user:"analytics",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"
  },
  {
    key:"library",
    title:"Central Library & Digital Resources",
    desc:"Manage physical and digital library resources and subscriptions.",
    user:"library",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
  },
  {
    key:"quality",
    title:"Quality Assurance & Accreditation Cell",
    desc:"Handle NAAC, NBA and institutional quality assurance processes.",
    user:"quality",
    pass:"1234",
    img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200"
  },
];
const DEPT_MODULES = {

  exam: [
    { key:"invigilator", title:"Invigilator Engine", desc:"Assign invigilators & exam duties",route:"/smart-invigilator" },
    { key:"rooms", title:"Exam Room Allocation", desc:"Automatic hall allocation system",route:"/hallticket" },
    { key:"hallticket", title:"Hall Ticket Generator", desc:"Generate hall tickets",  route:"/exam/hallticket" },
    { key:"results", title:"Results Processing", desc:"Result computation & publishing" },
  ],

  academics: [
    { key:"timetable", title:"Smart Timetable", desc:"Auto timetable generator" },
    { key:"subjects", title:"Subjects & Curriculum", desc:"Syllabus & curriculum control" },
    { key:"health", title:"Academic Health", desc:"Performance analytics" },
    { key:"student", title:"Student Mitra", desc:"Mentoring & guidance system" },
  ],

  admin: [
    { key:"admindash", title:"Admin Dashboard", desc:"System overview & monitoring" },
    { key:"users", title:"User Management", desc:"Create & manage users" },
    { key:"roles", title:"Roles & Permissions", desc:"Access control system" },
    { key:"circulars", title:"Office Circulars", desc:"Official notices & circulars" },
  ],

  infra: [
    { key:"campus", title:"Campus Vistara", desc:"Campus rooms, blocks & labs" },
    { key:"rooms", title:"Room & Lab Manager", desc:"Room availability & mapping" },
    { key:"maintenance", title:"Maintenance Requests", desc:"Repair & maintenance system" },
  ],

  faculty: [
    { key:"feedback", title:"Faculty Feedback AI", desc:"Feedback analytics" },
{ 
  key: "workload", 
  title: "Faculty Workload Manager", 
  desc: "Workload distribution", 
  route: "/admin/faculty-workload"
}
,
 { 
  key: "leave", 
  title: "Leave Management", 
  desc: "Leave approvals", 
  route: "/leave-system" 
},



  ],

  finance: [
    { 
  key:"fee", 
  title:"Fee Intelligence", 
  desc:"Fee tracking & pending reports",
  route:"/finance/student-fee-attendance"
},

    { key:"salary", title:"Salary Management", desc:"Staff payroll & payslips", route:"/finance/salary" },
    { key:"budget", title:"Budget & Audit", desc:"Budget planning & audit reports", route:"/finance/budget" }

  ],

  analytics: [
    { key:"dash", title:"Analytics Dashboard", desc:"Institution level analytics" },
    { key:"compare", title:"Department Comparison", desc:"Compare performance" },
    { key:"predict", title:"AI Predictions", desc:"Predict trends" },
  ],

  library: [
    { key:"books", title:"Book Inventory", desc:"Manage books" },
    { key:"issue", title:"Issue / Return", desc:"Track issue & returns" },
    { key:"digital", title:"Digital Resources", desc:"E-books & journals" },
  ],

  quality: [
    { key:"naac", title:"NAAC / NBA Dashboard", desc:"Accreditation monitoring" },
    { key:"docs", title:"Document Repository", desc:"Criteria-wise document storage" },
    { key:"reports", title:"Self Study Reports", desc:"SSR & compliance reports" },
  ],

};

/* ===================== MAIN COMPONENT ===================== */
export default function Dashboard(){
  const navigate = useNavigate();  
  const [stage, setStage] = useState("home"); // home | login | inside
  const [active, setActive] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  /* Auto move from preview to login */
  useEffect(() => {
    if(preview){
      const t = setTimeout(() => {
        setActive(preview);
        setPreview(null);
        setStage("login");
        setError("");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [preview]);

  /* ===================== HOME ===================== */
  if(stage === "home"){
    return (
      <div className="root">
        <style>{css}</style>

        <div className="topbar">
         
          
        </div>

        <div className="hero">
          <h2>VISTAR NETRA</h2>
          <h2>Smart Campus Command System</h2>
        </div>

        <div className="gridWrapper">
          <div className="grid3x3">
            {MODULES.map(m => (
              <div
                key={m.key}
                className="tile"
                style={{ backgroundImage:`url(${m.img})` }}
                onClick={()=> setPreview(m)}
              >
                <div className="tileOverlay">
                  <h2>{m.title}</h2>
                  <p>Click to Enter</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PREVIEW OVERLAY */}
        {preview && (
          <div className="previewOverlay">
            <div className="previewCard">
              <h2>{preview.title}</h2>
              <p>{preview.desc}</p>
              <div className="previewLoading">Entering secure module...</div>
            </div>
          </div>
        )}

      </div>
    );
  }

  /* ===================== LOGIN ===================== */
  if(stage === "login"){
    return (
      <LoginPage
        module={active}
        onBack={() => setStage("home")}
        onSuccess={() => setStage("inside")}
        error={error}
        setError={setError}
      />
    );
  }

  /* ===================== INSIDE ===================== */
  if(stage === "inside"){
    return (
      
      <div className="root">
        <style>{css}</style>

        <div className="topbar">
          <div className="brand">VISTAR NETRA</div>
          <button className="backBtn" onClick={() => setStage("home")}>
            Logout
          </button>
        </div>

        <div className="inside">
  <h1>{active.title}</h1>
  <p style={{ fontSize:74, color:"#94a3b8" }}>
    Select a module to continue
  </p>

  <div className="moduleGrid">
    {DEPT_MODULES[active.key].map((m) => (
      <div
        key={m.key}
        className="moduleCard"
       onClick={() => navigate(m.route)}

      >
        <h2>{m.title}</h2>
        <p>{m.desc}</p>
      </div>
    ))}
  </div>
</div>

      </div>
    );
  }

  return null;
}

/* ===================== LOGIN COMPONENT ===================== */
function LoginPage({ module, onBack, onSuccess, error, setError }){
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const handleLogin = () => {
    if(u === module.user && p === module.pass){
      onSuccess();
    } else {
      setError("❌ Invalid credentials. Unauthorized access denied.");
    }
  };

  return (
    <div className="secureOverlay">
      <style>{css}</style>

      <div className="secureTop">
        <div className="brand">VISTAR NETRA</div>
        <div className="secureTag">🔒 Secured System Access</div>
      </div>

      <div className="secureCenter">
        <div className="secureLoginBox">
          <div className="lockIcon">🔐</div>
          <h2>{module.title}</h2>
          <p className="secureNote">
            This module is protected. Only authorized personnel are allowed.
          </p>

          <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} />
          <input type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />

          <button onClick={handleLogin}>Secure Login</button>

          {error && <p className="errorText">{error}</p>}

          <p className="demoText">Demo: {module.user} / {module.pass}</p>

          <button className="backGhost" onClick={onBack}>⬅ Back</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== CSS ===================== */
const css = `
*{ box-sizing:border-box; font-family: Inter, Segoe UI, Arial; }
.root{ min-height:100vh; background:#020617; color:#e5e7eb; }

/* TOP BAR */
.topbar{
  height:80px; border-bottom:1px solid #1e293b;
  display:flex; align-items:center; justify-content:space-between; padding:0 40px;
}
.brand{ font-size:56px; font-weight:900; color:#38bdf8; letter-spacing:2px; }
.subtitle{
  font-size:58px; font-weight:700;
  background: linear-gradient(90deg, #38bdf8, #22d3ee, #a5f3fc);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}

/* HERO */
.hero{
  max-width:1200px;
  margin:90px auto 60px auto;
  text-align:center;
}
.hero h2:first-child{
  font-size:84px;
  font-weight:900;
  letter-spacing:2px;
}
.hero h2:nth-child(2){
  font-size:68px;
  color:#38bdf8;
  letter-spacing:1.5px;
}

/* GRID */
.gridWrapper{ padding:40px 80px 100px; }
.grid3x3{
  max-width:4600px;
  height:4100px;
  margin:0 auto;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:48px;
}

/* TILE */
.tile{
  position:relative;
  min-height:300px;
  border-radius:28px;
  overflow:hidden;
  background-size:cover;
  background-position:center;
  border:2px solid #1e293b;
  cursor:pointer;
  transition:.25s ease;
}
.tileOverlay{
  position:absolute;
  inset:0;
  background: linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.3));
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  padding:40px;
}
.tileOverlay h2{ font-size:58px; margin-bottom:10px; }
.tileOverlay p{ font-size:50px; color:#38bdf8; }

.tile:hover{
  border-color:#38bdf8;
  transform:translateY(-8px) scale(1.02);
  box-shadow:0 25px 70px rgba(202, 222, 21, 0.25);
}

/* PREVIEW */
.previewOverlay{
  position:fixed;
  inset:0;
  background: rgba(2,6,23,0.85);
  backdrop-filter: blur(6px);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
}
.previewCard{
  background:#020617;
  border:2px solid #38bdf8;
  border-radius:24px;
  padding:60px;
  width:700px;
  font-size:60px;
  height:800px;
  text-align:center;
}
.previewCard h2{ font-size:60px; margin-bottom:20px; }
.previewCard p{ font-size:52px; color:#cbd5f5; }
.previewLoading{ margin-top:30px; font-size:48px; color:#38bdf8; }

/* INSIDE */
.inside{ padding:100px; }
.infoBox{ margin-top:40px; border:2px solid #1e293b; border-radius:20px; padding:30px; }

/* BUTTON */
.backBtn{
  padding:14px 28px;
  border-radius:14px;
  border:1px solid rgba(239,68,68,0.6);
  background: linear-gradient(135deg, #020617, #020617, #450a0a);
  color:#fecaca;
  font-size:50px;
  font-weight:600;
  letter-spacing:.5px;
  cursor:pointer;
  transition: all .35s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 0 rgba(239,68,68,0),
    inset 0 0 0 rgba(239,68,68,0);
}

/* GLOW LAYER */
.backBtn::before{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(120deg, transparent, rgba(239,68,68,.35), transparent);
  transform: translateX(-100%);
  transition: .6s;
}

/* HOVER */
.backBtn:hover{
  color:#fff;
  border-color:#ef4444;
  box-shadow:
    0 0 20px rgba(239,68,68,.35),
    0 0 40px rgba(239,68,68,.15),
    inset 0 0 10px rgba(239,68,68,.15);
  transform: translateY(-2px);
}

.backBtn:hover::before{
  transform: translateX(100%);
}

/* ACTIVE (CLICK) */
.backBtn:active{
  transform: scale(.96);
  box-shadow:
    0 0 12px rgba(239,68,68,.4),
    inset 0 0 12px rgba(239,68,68,.3);
}


/* LOGIN */
.secureOverlay{
  position:fixed; inset:0;
  background: radial-gradient(circle at top, #020617, #000);
  display:flex; flex-direction:column;
}
.secureTop{
  height:80px; display:flex; align-items:center; justify-content:space-between;
  padding:0 40px; border-bottom:1px solid #1e293b;
}
.secureTag{ color:#facc15; font-weight:700; }
.secureCenter{ flex:1; display:flex; justify-content:center; align-items:center; }

.secureLoginBox{
  width:1420px; height:1300px; border:2px solid #1e293b; border-radius:26px;
  padding:60px; text-align:center;
}
  MODULE TITLE */
.secureLoginBox h2{
  font-size:56px;        /* Big, clear */
  font-weight:900;
  letter-spacing:1px;
  margin-bottom:24px;
  color:#e5e7eb;
}

.secureNote{ color:#94a3b8; margin-bottom:20px; font-size:60px; }
.lockIcon{
  font-size:96px;          /* BIG TITLE */
  font-weight:900;
  letter-spacing:2px;
  margin-bottom:14px;
  color:#38bdf8;
  text-transform:uppercase;
}
.secureLoginBox input{
  width:100%; padding:16px; margin-top:16px; font-size:60px;
  border-radius:12px; border:2px solid #1e293b; background:#0b1020; color:white;
}
.secureLoginBox button{
  width:100%; margin-top:26px; padding:16px; font-size:60px;
  border-radius:14px; border:none; background:#38bdf8; font-weight:800; cursor:pointer;
}
  /* ================= MODULE GRID ================= */
.moduleGrid{
  margin-top:60px;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:40px;
}

.moduleCard{
  background:#020617;
  border:2px solid #1e293b;
  border-radius:24px;
  padding:40px;
  cursor:pointer;
  transition:.25s;
}

.moduleCard:hover{
  border-color:#38bdf8;
  transform:translateY(-6px);
  box-shadow:0 20px 50px rgba(56,189,248,0.25);
}

.moduleCard h2{
  font-size:62px;
  margin-bottom:14px;
}

.moduleCard p{
  font-size:50px;
  color:#cbd5f5;
  line-height:1.6;
}

.errorText{ color:#ef4444; margin-top:12px; font-size655px; }
.demoText{ margin-top:16px; font-size:70px; color:#64748b; }
.backGhost{
  margin-top:16px; background:transparent !important;
  border:2px solid #1e293b !important; color:#cbd5f5 !important;
}
`;

