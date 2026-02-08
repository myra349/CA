import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= DATA ================= */

const departments = ["CSE","AI&DS","ECE","EEE","MECH","CIVIL"];

const base = [
  { dept:"CSE", students:620, pass:94, fail:6, avgGPA:7.8, attendance:89, placements:410, research:32 },
  { dept:"AI&DS", students:480, pass:96, fail:4, avgGPA:8.2, attendance:92, placements:360, research:28 },
  { dept:"ECE", students:540, pass:91, fail:9, avgGPA:7.2, attendance:86, placements:300, research:21 },
  { dept:"EEE", students:410, pass:88, fail:12, avgGPA:6.9, attendance:84, placements:210, research:14 },
  { dept:"MECH", students:500, pass:90, fail:10, avgGPA:7.1, attendance:85, placements:260, research:17 },
  { dept:"CIVIL", students:360, pass:87, fail:13, avgGPA:6.8, attendance:82, placements:160, research:11 }
];

const deptAttendanceTrend = {
  CSE:[78,81,84,86,88,89,90,91],
  "AI&DS":[80,83,86,88,90,91,92,93],
  ECE:[72,74,77,80,82,84,85,86],
  EEE:[70,72,74,77,79,81,83,84],
  MECH:[71,73,76,78,80,82,83,85],
  CIVIL:[68,70,72,74,77,79,81,82]
};

const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

/* ================= CHART HELPERS ================= */

function Bar({ value, max }) {
  return <div className="bar" style={{ height:`${(value/max)*100}%` }} />;
}

function LineChart({ points }){

  const max = Math.max(...points);
  const min = Math.min(...points);

  const map = (v,i)=>{
    const x = (i/(points.length-1))*100;
    const y = 100-((v-min)/(max-min))*90-5;
    return `${x},${y}`;
  };

  return (
    <svg viewBox="0 0 100 100" className="line">
      <polyline
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2"
        points={points.map(map).join(" ")}
      />
      {points.map((v,i)=>{
        const x=(i/(points.length-1))*100;
        const y=100-((v-min)/(max-min))*90-5;
        return <circle key={i} cx={x} cy={y} r="1.6" fill="#22d3ee"/>;
      })}
    </svg>
  );
}

function PieChart({ pass, fail }){

  const total = pass+fail;
  const a = (pass/total)*360;

  return(
    <svg viewBox="0 0 120 120" className="pie">
      <circle cx="60" cy="60" r="50" fill="#1e293b"/>
      <path d={arc(60,60,50,0,a)} fill="#22c55e"/>
      <path d={arc(60,60,50,a,360)} fill="#ef4444"/>
      <text x="60" y="60" dy="5" textAnchor="middle" fill="white" fontSize="12">
        {pass}% Pass
      </text>
    </svg>
  );
}

function polar(cx,cy,r,a){
  const rad=(a-90)*Math.PI/180;
  return {x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)};
}
function arc(cx,cy,r,s,e){
  const p1=polar(cx,cy,r,e);
  const p2=polar(cx,cy,r,s);
  const l=e-s<=180?"0":"1";
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${l} 0 ${p2.x} ${p2.y} L ${cx} ${cy} Z`;
}

/* ================= MAIN ================= */

export default function CompleteAnalyticsDashboard(){

  const navigate = useNavigate();
  const [dept,setDept] = useState("All");

  const data = useMemo(()=>{
    if(dept==="All") return base;
    return base.filter(d=>d.dept===dept);
  },[dept]);

  const instituteAttendance = useMemo(()=>{
    return months.map((_,i)=>{
      const sum = base.reduce((a,b)=>a+deptAttendanceTrend[b.dept][i],0);
      return +(sum/base.length).toFixed(1);
    });
  },[]);

  const summary = useMemo(()=>{
    const students=data.reduce((a,b)=>a+b.students,0);
    const avgGPA=(data.reduce((a,b)=>a+b.avgGPA,0)/data.length).toFixed(2);
    const attendance=(data.reduce((a,b)=>a+b.attendance,0)/data.length).toFixed(1);
    const placements=data.reduce((a,b)=>a+b.placements,0);
    return {students,avgGPA,attendance,placements};
  },[data]);

  const maxStudents=Math.max(...base.map(d=>d.students));

  return(
    <div className="cad-root">

      <div className="cad-top">
        <button onClick={()=>navigate("/dashboard",{state:{openDept:"analytics"}})}>⬅ Back</button>
        <h1>Complete Institutional Analytics</h1>
        <select value={dept} onChange={e=>setDept(e.target.value)}>
          <option value="All">All Departments</option>
          {departments.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="cad-kpis">
        <div><span>Total Students</span><b>{summary.students}</b></div>
        <div><span>Average GPA</span><b>{summary.avgGPA}</b></div>
        <div><span>Attendance %</span><b>{summary.attendance}</b></div>
        <div><span>Total Placements</span><b>{summary.placements}</b></div>
      </div>

      <div className="panel wide">
        <h3>Overall Institute Attendance Trend</h3>
        <LineChart points={instituteAttendance}/>
        <div className="months">
          {months.map(m=><span key={m}>{m}</span>)}
        </div>
      </div>

      {/* ================= ADVANCED ATTENDANCE INTELLIGENCE ================= */}

      <div className="panel wide">

        <h3>Attendance Intelligence & Risk Analysis</h3>

        <div className="att-grid">

          <div className="att-block">
            <h4>Department Wise Average Attendance</h4>
            {data.map(d=>(
              <div key={d.dept} className="att-row">
                <span>{d.dept}</span>
                <div className="att-bar-bg">
                  <div
                    className={
                      d.attendance<75?"att-bar danger":
                      d.attendance<85?"att-bar warn":"att-bar good"
                    }
                    style={{width:`${d.attendance}%`}}
                  />
                </div>
                <small>{d.attendance}%</small>
              </div>
            ))}
          </div>

          <div className="att-block">
            <h4>Attendance Risk Segmentation</h4>
            {data.map(d=>{

              const total=d.students;
              const high=Math.round(total*(100-d.attendance)/100*0.6);
              const mid=Math.round(total*(100-d.attendance)/100*0.3);
              const safe=total-high-mid;

              return(
                <div key={d.dept} className="risk-row">
                  <b>{d.dept}</b>
                  <div className="risk-stack">
                    <div className="risk high" style={{width:`${(high/total)*100}%`}}/>
                    <div className="risk mid" style={{width:`${(mid/total)*100}%`}}/>
                    <div className="risk safe" style={{width:`${(safe/total)*100}%`}}/>
                  </div>
                  <small>
                    High:{high} | Medium:{mid} | Safe:{safe}
                  </small>
                </div>
              );
            })}
          </div>

          <div className="att-block">
            <h4>Attendance Loss & Recovery Scope</h4>
            {data.map(d=>{
              const loss=Math.round(d.students*(100-d.attendance)/100);
              const recover=Math.round(loss*0.55);
              return(
                <div key={d.dept} className="loss-row">
                  <b>{d.dept}</b>
                  <small>
                    Impacted students ≈ {loss}<br/>
                    Recoverable through mentoring ≈ {recover}
                  </small>
                </div>
              );
            })}
          </div>

          <div className="att-block">
            <h4>Actionable Insights</h4>
            <ul className="att-insights">
              {data.map(d=>{
                let msg =
                  d.attendance<75
                  ? `${d.dept}: Immediate intervention needed. Weekly monitoring & parent alerts.`
                  : d.attendance<85
                  ? `${d.dept}: Moderate risk. Increase tutorial hours and mentoring.`
                  : `${d.dept}: Healthy attendance. Maintain current practices.`;
                return <li key={d.dept}>{msg}</li>;
              })}
            </ul>
          </div>

        </div>

      </div>

      <div className="cad-grid">

        <div className="panel">
          <h3>Department Strength</h3>
          <div className="bars">
            {data.map(d=>(
              <div key={d.dept} className="bar-wrap">
                <Bar value={d.students} max={maxStudents}/>
                <span>{d.dept}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Pass / Fail Distribution</h3>
          <div className="pie-row">
            {data.map(d=>(
              <div key={d.dept} className="pie-card">
                <PieChart pass={d.pass} fail={d.fail}/>
                <span>{d.dept}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Academic Performance</h3>
          <table>
            <thead>
              <tr>
                <th>Dept</th>
                <th>GPA</th>
                <th>Attendance</th>
                <th>Pass%</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d=>(
                <tr key={d.dept}>
                  <td>{d.dept}</td>
                  <td>{d.avgGPA}</td>
                  <td>{d.attendance}%</td>
                  <td>{d.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Placements & Research Output</h3>
          {data.map(d=>(
            <div key={d.dept} className="stack">
              <span>{d.dept}</span>
              <div className="stack-bar">
                <div className="pl" style={{width:`${(d.placements/d.students)*100}%`}}/>
                <div className="rs" style={{width:`${(d.research/60)*100}%`}}/>
              </div>
              <small>{d.placements} placed | {d.research} papers</small>
            </div>
          ))}
        </div>

        {dept!=="All" && (
          <div className="panel wide">
            <h3>{dept} – Attendance Trend</h3>
            <LineChart points={deptAttendanceTrend[dept]}/>
            <div className="months">
              {months.map(m=><span key={m}>{m}</span>)}
            </div>
          </div>
        )}

      </div>

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css=`

.cad-root{
  min-height:100vh;
  background:#020617;
  color:#e5e7eb;
  padding:30px 40px 80px;
  font-family:Inter,Segoe UI,Arial;
}

.cad-top{
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:20px;
}
.cad-top h1{
  flex:1;
  text-align:center;
  color:#38bdf8;
  font-size:50px;
}
.cad-top button{
  background:#020617;
  border:1px solid #1e293b;
  color:#cbd5f5;
  padding:8px 14px;
  border-radius:10px;
}
.cad-top select{
  background:#0b1020;
  border:1px solid #1e293b;
  color:white;
  padding:8px 10px;
  border-radius:10px;
}

.cad-kpis{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
  margin-bottom:18px;
}
.cad-kpis div{
  border:1px solid #1e293b;
  border-radius:14px;
  padding:12px;
  text-align:center;
}
.cad-kpis span{
  font-size:12px;
  color:#94a3b8;
}
.cad-kpis b{
  display:block;
  font-size:22px;
  margin-top:6px;
}

.cad-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:18px;
}

.panel{
  border:1px solid #1e293b;
  border-radius:16px;
  padding:14px;
}
.panel.wide{grid-column:1/3;}
.panel h3{color:#7dd3fc;margin-bottom:10px;}

.bars{
  height:200px;
  display:flex;
  align-items:flex-end;
  gap:12px;
}
.bar-wrap{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.bar{
  width:100%;
  background:linear-gradient(#38bdf8,#22d3ee);
  border-radius:8px 8px 0 0;
}
.bar-wrap span{font-size:12px;margin-top:6px;}

.pie-row{
  display:flex;
  flex-wrap:wrap;
  gap:14px;
}
.pie-card{
  width:110px;
  text-align:center;
}
.pie{width:100px;height:100px;}

.stack{margin-bottom:10px;}
.stack span{font-size:13px;}
.stack-bar{
  height:12px;
  background:#0b1020;
  border-radius:8px;
  overflow:hidden;
  display:flex;
}
.pl{background:#22c55e;}
.rs{background:#38bdf8;}

table{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}
th,td{
  padding:6px 8px;
  border-bottom:1px solid #1e293b;
}

.line{
  width:100%;
  height:150px;
}

.months{
  display:flex;
  justify-content:space-between;
  font-size:11px;
  color:#94a3b8;
  margin-top:6px;
}

/* ================= ATTENDANCE INTELLIGENCE ================= */

.att-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px;
}

.att-block{
  border:1px solid #1e293b;
  border-radius:14px;
  padding:12px;
  background:#020617;
}

.att-block h4{
  color:#7dd3fc;
  margin-bottom:10px;
  font-size:14px;
}

.att-row{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:8px;
  font-size:12px;
}

.att-bar-bg{
  flex:1;
  height:10px;
  background:#0b1020;
  border-radius:8px;
  overflow:hidden;
}

.att-bar{height:100%;border-radius:8px;}
.att-bar.good{background:#22c55e;}
.att-bar.warn{background:#facc15;}
.att-bar.danger{background:#ef4444;}

.risk-row{margin-bottom:12px;font-size:12px;}
.risk-stack{
  height:10px;
  border-radius:8px;
  overflow:hidden;
  display:flex;
  background:#0b1020;
  margin:4px 0;
}
.risk.high{background:#ef4444;}
.risk.mid{background:#facc15;}
.risk.safe{background:#22c55e;}

.loss-row{margin-bottom:10px;font-size:12px;}

.att-insights{
  padding-left:18px;
  font-size:12px;
  color:#cbd5f5;
}
.att-insights li{margin-bottom:8px;}

`;

