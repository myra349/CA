import React, { useState, useRef, useEffect } from "react";

export default function AdminDashboard() {

  /* ---------------- STATE ---------------- */
  const [form, setForm] = useState({
    length: "",
    width: "",
    seatType: "chair",
    students: "",
    boardSide: "top",
  });

  const [doors, setDoors] = useState([]);
  const [doorDraft, setDoorDraft] = useState({ side: "left", pos: "" });

  const [errors, setErrors] = useState({});
  const canvasRef = useRef(null);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    let e = {};
    if (!form.length) e.length = "Room length required";
    if (!form.width) e.width = "Room width required";
    if (!form.students || Number(form.students) <= 0)
      e.students = "Valid student count required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- DOORS ---------------- */
  const addDoor = () => {
    if (!doorDraft.pos) return;
    setDoors([...doors, doorDraft]);
    setDoorDraft({ side: "left", pos: "" });
  };

  const removeDoor = (i) =>
    setDoors(doors.filter((_, idx) => idx !== i));

  /* ---------------- GENERATE ---------------- */
  const generatePlan = () => {
    if (!validate()) return;
    alert("✅ Seating layout generated! See right side preview.");
  };

  /* ---------------- DOWNLOAD ---------------- */
  const downloadLayout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "classroom_seating_plan.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={S.page}>
      <h1 style={S.title}>🏫 Smart Space Management (2D Seating Planner)</h1>

      <div style={S.grid}>

        {/* LEFT PANEL */}
        <div style={S.panel}>
          <h2>📐 Classroom Configuration</h2>

          <Input
            label="Room Length (m)"
            name="length"
            value={form.length}
            onChange={handleChange}
            error={errors.length}
          />

          <Input
            label="Room Width (m)"
            name="width"
            value={form.width}
            onChange={handleChange}
            error={errors.width}
          />

          <Select
            name="seatType"
            value={form.seatType}
            onChange={handleChange}
            options={["chair", "bench"]}
          />

          <Input
            label="Number of Students"
            name="students"
            value={form.students}
            onChange={handleChange}
            error={errors.students}
          />

          <Select
            name="boardSide"
            value={form.boardSide}
            onChange={handleChange}
            options={["top", "bottom", "left", "right"]}
          />

          <h3 style={{ marginTop: 18 }}>🚪 Doors</h3>

          <div style={S.row}>
            <select
              style={S.input}
              value={doorDraft.side}
              onChange={(e) =>
                setDoorDraft({ ...doorDraft, side: e.target.value })
              }
            >
              <option>left</option>
              <option>right</option>
              <option>top</option>
              <option>bottom</option>
            </select>

            <input
              style={S.input}
              placeholder="Distance (m)"
              value={doorDraft.pos}
              onChange={(e) =>
                setDoorDraft({ ...doorDraft, pos: e.target.value })
              }
            />

            <button style={S.smallBtn} onClick={addDoor}>＋</button>
          </div>

          {doors.map((d, i) => (
            <div key={i} style={S.doorRow}>
              <span>Door {i + 1}: {d.side} @ {d.pos} m</span>
              <button onClick={() => removeDoor(i)}>✕</button>
            </div>
          ))}

          <button style={S.mainBtn} onClick={generatePlan}>
            Generate Seating Plan
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={S.panel}>
          <h2>📊 2D Layout Preview</h2>

          <Simple2DView form={form} doors={doors} canvasRef={canvasRef} />

          <button style={S.downloadBtn} onClick={downloadLayout}>
            ⬇ Download Seating Plan
          </button>

        </div>
      </div>
    </div>
  );
}

/* ---------------- 2D CANVAS ---------------- */
const Simple2DView = ({ form, doors, canvasRef }) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Room
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // Board
    ctx.fillStyle = "#22c55e";
    if (form.boardSide === "top") ctx.fillRect(W / 2 - 80, 30, 160, 8);
    if (form.boardSide === "bottom") ctx.fillRect(W / 2 - 80, H - 38, 160, 8);
    if (form.boardSide === "left") ctx.fillRect(30, H / 2 - 80, 8, 160);
    if (form.boardSide === "right") ctx.fillRect(W - 38, H / 2 - 80, 8, 160);

    // Seats
    const students = Number(form.students || 0);
    if (students > 0) {
      const cols = Math.ceil(Math.sqrt(students));
      const rows = Math.ceil(students / cols);

      const areaW = W - 120;
      const areaH = H - 120;

      const seatW = areaW / cols;
      const seatH = areaH / rows;

      let count = 0;
      ctx.fillStyle = "#facc15";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (count >= students) break;
          ctx.fillRect(
            60 + c * seatW + 4,
            60 + r * seatH + 4,
            seatW - 8,
            seatH - 8
          );
          count++;
        }
      }
    }

    // Doors
    ctx.fillStyle = "#fb7185";
    doors.forEach((d) => {
      const pos = parseFloat(d.pos || 0) * 5;
      if (d.side === "left") ctx.fillRect(36, 60 + pos, 8, 40);
      if (d.side === "right") ctx.fillRect(W - 44, 60 + pos, 8, 40);
      if (d.side === "top") ctx.fillRect(60 + pos, 36, 40, 8);
      if (d.side === "bottom") ctx.fillRect(60 + pos, H - 44, 40, 8);
    });

  }, [form, doors, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={500}
      style={{
        width: "100%",
        borderRadius: "12px",
        border: "2px solid #38bdf8",
        background: "#020617"
      }}
    />
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */
const Input = ({ label, error, ...props }) => (
  <>
    <input style={S.input} placeholder={label} {...props} />
    {error && <div style={S.error}>{error}</div>}
  </>
);

const Select = ({ options, ...props }) => (
  <select style={S.input} {...props}>
    {options.map(o => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

/* ---------------- STYLES ---------------- */
const S = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "linear-gradient(135deg,#020617,#0f172a)",
    color: "#e5e7eb",
    fontFamily: "Poppins, Segoe UI",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#38bdf8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  panel: {
    padding: "24px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "56px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
  },
  row: {
    display: "flex",
    gap: "8px",
  },
  smallBtn: {
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  mainBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
    color: "#fff",
    cursor: "pointer",
  },
  downloadBtn: {
    marginTop: "16px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "#020617",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
  },
  doorRow: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.12)",
    padding: "6px 10px",
    borderRadius: "8px",
    marginBottom: "6px",
  },
  error: {
    color: "#fca5a5",
    fontSize: "13px",
    marginBottom: "6px",
  },
};
