import React, { useState, useMemo } from "react";

/* dummy live department input */
const baseDept = {
  students: 500,
  avgGPA: 7.5,
  pass: 92,
  attendance: 88,
  placements: 280
};

export default function AdminDynamicPrediction(){

  /* admin controlled weights */
  const [wGPA,setWGPA] = useState(1.2);
  const [wPass,setWPass] = useState(1.0);
  const [wAttend,setWAttend] = useState(1.1);
  const [wPlace,setWPlace] = useState(1.4);

  const prediction = useMemo(()=>{

    const gpa = baseDept.avgGPA / 10;
    const pass = baseDept.pass / 100;
    const att  = baseDept.attendance / 100;
    const placeRate = baseDept.placements / baseDept.students;

    const z =
      gpa * wGPA +
      pass * wPass +
      att  * wAttend +
      placeRate * wPlace -
      1.4;

    const success = 1 / (1 + Math.exp(-z));

    const nextPlacements =
      baseDept.students * placeRate * success;

    const risk =
      1 - success;

    return {
      success : +(success*100).toFixed(2),
      nextPlacements : Math.round(nextPlacements),
      risk : +(risk*100).toFixed(2)
    };

  },[wGPA,wPass,wAttend,wPlace]);

  return(
    <div style={root}>

      <h1>Admin Super Dynamic AI Prediction Panel</h1>

      <div style={panel}>

        <Control label="GPA Weight" value={wGPA} set={setWGPA}/>
        <Control label="Pass % Weight" value={wPass} set={setWPass}/>
        <Control label="Attendance Weight" value={wAttend} set={setWAttend}/>
        <Control label="Placement Weight" value={wPlace} set={setWPlace}/>

      </div>

      <div style={result}>

        <h2>Live AI Prediction Output</h2>

        <p>✅ Success Probability : <b>{prediction.success}%</b></p>
        <p>🎯 Predicted Next Year Placements : <b>{prediction.nextPlacements}</b></p>
        <p>⚠ Academic Risk Probability : <b>{prediction.risk}%</b></p>

      </div>

    </div>
  );
}

/* slider control */

function Control({label,value,set}){

  return(
    <div style={ctrl}>
      <span>{label}</span>
      <input
        type="range"
        min="0"
        max="3"
        step="0.05"
        value={value}
        onChange={e=>set(+e.target.value)}
      />
      <b>{value}</b>
    </div>
  );
}

/* styles */

const root={
  minHeight:"100vh",
  background:"#020617",
  color:"white",
  padding:40
};

const panel={
  maxWidth:600,
  margin:"0 auto",
  display:"flex",
  flexDirection:"column",
  gap:18
};

const ctrl={
  display:"flex",
  gap:10,
  alignItems:"center"
};

const result={
  marginTop:40,
  maxWidth:600,
  marginLeft:"auto",
  marginRight:"auto",
  padding:20,
  border:"1px solid #38bdf8",
  borderRadius:12
};

