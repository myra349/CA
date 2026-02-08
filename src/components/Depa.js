import React, { useMemo, useState } from "react";

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

const attendanceTrend = {
  CSE:[78,81,84,86,88,89,90,91],
  "AI&DS":[80,83,86,88,90,91,92,93],
  ECE:[72,74,77,80,82,84,85,86],
  EEE:[70,72,74,77,79,81,83,84],
  MECH:[71,73,76,78,80,82,83,85],
  CIVIL:[68,70,72,74,77,79,81,82]
};

const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

/* ================= BASIC HELPERS ================= */

const mean = arr => arr.reduce((a,b)=>a+b,0)/arr.length;

const std = arr => {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/arr.length);
};

const zScore = (v,arr) => {
  const s = std(arr);
  if(!s) return 0;
  return (v-mean(arr))/s;
};

const normalize = (v,max) => v/max;

const trendSlope = arr =>
  (arr[arr.length-1]-arr[0])/(arr.length-1);

const volatility = arr => {
  let d=[];
  for(let i=1;i<arr.length;i++)
    d.push(Math.abs(arr[i]-arr[i-1]));
  return mean(d);
};

const linearForecast = (arr,steps=2)=>{
  const s = trendSlope(arr);
  let last = arr[arr.length-1];
  const out=[];
  for(let i=0;i<steps;i++){
    last += s;
    out.push(+last.toFixed(1));
  }
  return out;
};

/* ================= MINI LINE CHART ================= */

function Line({points}){

  const max=Math.max(...points);
  const min=Math.min(...points);

  const map=(v,i)=>{
    const x=(i/(points.length-1))*100;
    const y=100-((v-min)/(max-min))*90-5;
    return `${x},${y}`;
  };

  return(
    <svg viewBox="0 0 100 100" className="line">
      <polyline
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2"
        points={points.map(map).join(" ")}
      />
    </svg>
  );
}

/* ================= MAIN ================= */

export default function AdvancedDepartmentComparison(){

  const [A,setA]=useState("CSE");
  const [B,setB]=useState("AI&DS");

  const goBack = () => {
    window.history.back();
  };

  const a = useMemo(()=>base.find(d=>d.dept===A),[A]);
  const b = useMemo(()=>base.find(d=>d.dept===B),[B]);

  const max = useMemo(()=>({
    students:Math.max(...base.map(d=>d.students)),
    placements:Math.max(...base.map(d=>d.placements)),
    research:Math.max(...base.map(d=>d.research))
  }),[]);

  /* ================= POPULATION ================= */

  const pop = useMemo(()=>({
    gpa: base.map(d=>d.avgGPA),
    pass: base.map(d=>d.pass),
    attendance: base.map(d=>d.attendance),
    placements: base.map(d=>d.placements),
    research: base.map(d=>d.research)
  }),[]);

  /* ================= DEPARTMENT METRICS ================= */

  const metrics = d => {

    const strengthIndex =
      zScore(d.avgGPA,pop.gpa)*0.25 +
      zScore(d.pass,pop.pass)*0.20 +
      zScore(d.attendance,pop.attendance)*0.15 +
      zScore(d.placements,pop.placements)*0.25 +
      zScore(d.research,pop.research)*0.15;

    const placementEfficiency = (d.placements/d.students)*100;
    const researchProductivity = (d.research/d.students)*100;

    const attendanceVolatility =
      volatility(attendanceTrend[d.dept]);

    const forecast =
      linearForecast(attendanceTrend[d.dept],2);

    const weakFlags = {
      gpa: d.avgGPA < mean(pop.gpa),
      pass: d.pass < mean(pop.pass),
      attendance: d.attendance < mean(pop.attendance),
      placements: d.placements < mean(pop.placements),
      research: d.research < mean(pop.research)
    };

    return{
      strengthIndex:+strengthIndex.toFixed(3),
      placementEfficiency:+placementEfficiency.toFixed(2),
      researchProductivity:+researchProductivity.toFixed(2),
      attendanceVolatility:+attendanceVolatility.toFixed(2),
      forecast,
      weakFlags
    };
  };

  const aM = metrics(a);
  const bM = metrics(b);

  /* ================= COMPOSITE SCORE ================= */

  const score = d => {

    const academic =
      normalize(d.avgGPA,10)*0.35 +
      normalize(d.pass,100)*0.25 +
      normalize(d.attendance,100)*0.20;

    const outcome =
      normalize(d.placements,max.placements)*0.15 +
      normalize(d.research,max.research)*0.05;

    return +(academic+outcome).toFixed(3);
  };

  const aScore = score(a);
  const bScore = score(b);

  /* ================= RISK ================= */

  const riskIndex = d => {
    let r=0;
    if(d.attendance<80) r+=0.4;
    if(d.pass<90) r+=0.3;
    if(d.avgGPA<7) r+=0.3;
    return r;
  };

  /* ================= TREND ================= */

  const aTrend = trendSlope(attendanceTrend[A]);
  const bTrend = trendSlope(attendanceTrend[B]);

  /* ================= RANK ENGINE ================= */

  const rankTable = useMemo(()=>{

    const all = base.map(d=>({
      dept:d.dept,
      ...metrics(d)
    }));

    return all
      .sort((x,y)=>y.strengthIndex-x.strengthIndex)
      .map((d,i)=>({...d,rank:i+1}));

  },[A,B]);

  /* ================= SMART INSIGHT ================= */

  const insight = useMemo(()=>{

    const ra = rankTable.find(r=>r.dept===A);
    const rb = rankTable.find(r=>r.dept===B);

    const t=[];

    t.push(`${A} is ranked #${ra.rank} in institutional strength index.`);
    t.push(`${B} is ranked #${rb.rank} in institutional strength index.`);

    if(aScore>bScore)
      t.push(`${A} leads in composite academic–outcome score.`);
    else
      t.push(`${B} leads in composite academic–outcome score.`);

    if(aM.placementEfficiency>bM.placementEfficiency)
      t.push(`${A} converts student base into placements more efficiently.`);
    else
      t.push(`${B} shows better placement efficiency.`);

    if(aM.researchProductivity>bM.researchProductivity)
      t.push(`${A} demonstrates higher per-student research output.`);
    else
      t.push(`${B} demonstrates higher per-student research output.`);

    if(aM.attendanceVolatility>bM.attendanceVolatility)
      t.push(`${A} has higher attendance instability.`);
    else
      t.push(`${B} has more stable attendance trend.`);

    if(aTrend>bTrend)
      t.push(`${A} attendance improvement trend is stronger.`);
    else
      t.push(`${B} attendance improvement trend is stronger.`);

    const wa = Object.entries(aM.weakFlags).filter(x=>x[1]).map(x=>x[0]);
    const wb = Object.entries(bM.weakFlags).filter(x=>x[1]).map(x=>x[0]);

    if(wa.length)
      t.push(`${A} underperforms in ${wa.join(", ")} relative to campus mean.`);
    if(wb.length)
      t.push(`${B} underperforms in ${wb.join(", ")} relative to campus mean.`);

    return t.join(" ");

  },[A,B,rankTable]);

  return(
    <div className="adc-root">

      <div className="back-row">
        <button onClick={goBack}>⬅ Back to Dashboard</button>
      </div>

      <h1>Advanced Department Comparison Analytics</h1>

      <div className="select-row">
        <select value={A} onChange={e=>setA(e.target.value)}>
          {departments.map(d=><option key={d}>{d}</option>)}
        </select>
        <span>VS</span>
        <select value={B} onChange={e=>setB(e.target.value)}>
          {departments.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="score-row">
        <div className={`score-card ${aScore>bScore?"win":""}`}>
          <h3>{A}</h3>
          <p>Composite Score</p>
          <b>{aScore}</b>
        </div>
        <div className={`score-card ${bScore>aScore?"win":""}`}>
          <h3>{B}</h3>
          <p>Composite Score</p>
          <b>{bScore}</b>
        </div>
      </div>

      <div className="grid">

        <div className="block">
          <h4>Academic Indicators</h4>
          <table><tbody>
            <tr><td>GPA</td><td>{a.avgGPA}</td><td>{b.avgGPA}</td></tr>
            <tr><td>Pass %</td><td>{a.pass}</td><td>{b.pass}</td></tr>
            <tr><td>Attendance</td><td>{a.attendance}</td><td>{b.attendance}</td></tr>
          </tbody></table>
        </div>

        <div className="block">
          <h4>Outcome Indicators</h4>
          <table><tbody>
            <tr><td>Placements</td><td>{a.placements}</td><td>{b.placements}</td></tr>
            <tr><td>Research</td><td>{a.research}</td><td>{b.research}</td></tr>
          </tbody></table>
        </div>

        <div className="block">
          <h4>Attendance Trend</h4>
          <div className="trend">
            <div>
              <small>{A}</small>
              <Line points={attendanceTrend[A]} />
            </div>
            <div>
              <small>{B}</small>
              <Line points={attendanceTrend[B]} />
            </div>
          </div>
          <div className="months">
            {months.map(m=><span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="block">
          <h4>Risk Exposure Index</h4>

          <div className="risk-row">
            <span>{A}</span>
            <div className="risk-bar">
              <div style={{width:`${riskIndex(a)*100}%`}} className="risk-fill a"/>
            </div>
            <small>{(riskIndex(a)*100).toFixed(0)}%</small>
          </div>

          <div className="risk-row">
            <span>{B}</span>
            <div className="risk-bar">
              <div style={{width:`${riskIndex(b)*100}%`}} className="risk-fill b"/>
            </div>
            <small>{(riskIndex(b)*100).toFixed(0)}%</small>
          </div>
        </div>

        <div className="block">
          <h4>Advanced Performance Intelligence</h4>
          <table><tbody>
            <tr><td>Strength Index</td><td>{aM.strengthIndex}</td><td>{bM.strengthIndex}</td></tr>
            <tr><td>Placement Efficiency %</td><td>{aM.placementEfficiency}</td><td>{bM.placementEfficiency}</td></tr>
            <tr><td>Research / 100 Students</td><td>{aM.researchProductivity}</td><td>{bM.researchProductivity}</td></tr>
            <tr><td>Attendance Volatility</td><td>{aM.attendanceVolatility}</td><td>{bM.attendanceVolatility}</td></tr>
            <tr><td>Forecast (next 2 months)</td><td>{aM.forecast.join(", ")}</td><td>{bM.forecast.join(", ")}</td></tr>
            <tr><td>Rank</td><td>#{rankTable.find(r=>r.dept===A)?.rank}</td><td>#{rankTable.find(r=>r.dept===B)?.rank}</td></tr>
          </tbody></table>
        </div>

      </div>

      <div className="insight">
        <h3>Strategic Decision Insight</h3>
        <p>{insight}</p>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css = `
.adc-root{
  min-height:300vh;
  background:#020617;
  color:#e5e7eb;
  padding:40px;
  font-family:Inter,Segoe UI,Arial;
}

.back-row{
  margin-bottom:20px;
}

.back-row button{
  background:#0b1020;
  border:2px solid #38bdf8;
  color:#38bdf8;
  padding:10px 18px;
  border-radius:10px;
  cursor:pointer;
  font-size:18px;
}

.back-row button:hover{
  background:#38bdf8;
  color:#020617;
}

h1{text-align:center;color:#38bdf8;margin-bottom:20px;}
.select-row{display:flex;justify-content:center;gap:14px;margin-bottom:25px;}
.select-row select{background:#0b1020;border:1px solid #1e293b;color:white;padding:10px 14px;border-radius:10px;}
.select-row span{font-weight:800;color:#facc15;}
.score-row{display:flex;justify-content:center;gap:20px;margin-bottom:30px;}
.score-card{border:1px solid #1e293b;border-radius:14px;padding:18px 28px;min-width:200px;text-align:center;}
.score-card.win{border-color:#22c55e;box-shadow:0 0 15px rgba(34,197,94,.3);}
.score-card b{font-size:58px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(600px,4fr));gap:18px;font-size:43px;max-width:4100px;height:800px;margin:0 auto;}
.block{border:1px solid #1e293b;border-radius:14px;padding:14px;}
.block h4{color:#7dd3fc;margin-bottom:10px;}
table{width:100%;font-size:43px;}
td{padding:6px;}
.trend{display:flex;gap:10px;}
.trend small{display:block;text-align:center;color:white;}
.line{width:100%;height:90px;}
.months{display:flex;justify-content:space-between;font-size:51px;color:#64748b;margin-top:6px;}
.risk-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:53px;}
.risk-bar{flex:1;height:10px;background:#0b1020;border-radius:8px;overflow:hidden;}
.risk-fill.a{background:#ef4444;height:100%;}
.risk-fill.b{background:#facc15;height:100%;}
.insight{max-width:3100px;margin:600px auto 0;border:10px solid #99bcf3;border-radius:14px;padding:18px;background:#020617;height:900px;}
.insight h3{color:#7dd3fc;margin-bottom:6px;font-size:74px;}
.insight p{font-size:64px;color:#cbd5f5;line-height:1.6;}
`;


