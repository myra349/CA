import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= PERMISSION MASTER ================= */

const PERMISSIONS = [
  { key:"users.view", label:"View Users" },
  { key:"users.edit", label:"Create / Edit Users" },
  { key:"users.delete", label:"Delete Users" },

  { key:"timetable.manage", label:"Manage Timetable" },
  { key:"subjects.manage", label:"Subjects & Curriculum" },
  { key:"students.analytics", label:"Student Analytics" },

  { key:"finance.view", label:"View Finance" },
  { key:"finance.edit", label:"Edit Finance" },

  { key:"leave.approve", label:"Approve Leave" },
  { key:"workload.manage", label:"Manage Faculty Workload" },

  { key:"system.settings", label:"System Settings" },
  { key:"audit.logs", label:"Audit & Logs" },
];

/* ================= INITIAL ROLES ================= */

const initialRoles = [
  {
    id:"R1",
    name:"Super Admin",
    permissions: PERMISSIONS.map(p=>p.key)
  },
  {
    id:"R2",
    name:"Academic Officer",
    permissions: [
      "timetable.manage",
      "subjects.manage",
      "students.analytics",
      "users.view"
    ]
  },
  {
    id:"R3",
    name:"Finance Officer",
    permissions: [
      "finance.view",
      "finance.edit"
    ]
  },
  {
    id:"R4",
    name:"Faculty",
    permissions: [
      "students.analytics"
    ]
  }
];

/* ================= COMPONENT ================= */

export default function RolesPermissions(){

  const navigate = useNavigate();

  const [roles, setRoles] = useState(initialRoles);
  const [selected, setSelected] = useState(roles[0]);
  const [newRoleName, setNewRoleName] = useState("");

  /* ============ TOGGLE PERMISSION ============ */

  const togglePermission = (perm) => {

    setRoles(prev => {

      const copy = structuredClone(prev);

      const role = copy.find(r => r.id === selected.id);

      if(role.permissions.includes(perm)){
        role.permissions = role.permissions.filter(p => p !== perm);
      }else{
        role.permissions.push(perm);
      }

      setSelected({ ...role });
      return copy;
    });
  };

  /* ============ CREATE ROLE ============ */

  const addRole = () => {

    if(!newRoleName.trim()) return;

    setRoles(prev => [
      ...prev,
      {
        id: "R" + (prev.length + 1),
        name: newRoleName,
        permissions:[]
      }
    ]);

    setNewRoleName("");
  };

  /* ============ DELETE ROLE ============ */

  const deleteRole = (id) => {

    if(!window.confirm("Delete this role?")) return;

    setRoles(prev => prev.filter(r => r.id !== id));

    if(selected.id === id){
      setSelected(null);
    }
  };

  return (
    <div className="rp-root">

      {/* TOP BAR */}
      <div className="rp-top">

        <button
          className="rp-back"
          onClick={() =>
            navigate("/dashboard",{ state:{ openDept:"admin" }})
          }
        >
          ⬅ Back
        </button>

        <div className="rp-title">
          Roles & Permissions Control
        </div>

      </div>

      <div className="rp-layout">

        {/* LEFT : ROLES */}
        <div className="rp-roles">

          <h3>Roles</h3>

          {roles.map(r => (
            <div
              key={r.id}
              className={`rp-role ${selected?.id === r.id ? "active" : ""}`}
              onClick={() => setSelected(r)}
            >
              <span>{r.name}</span>

              {r.name !== "Super Admin" && (
                <button
                  className="rp-del"
                  onClick={(e)=>{
                    e.stopPropagation();
                    deleteRole(r.id);
                  }}
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          <div className="rp-add">
            <input
              placeholder="New role name"
              value={newRoleName}
              onChange={e=>setNewRoleName(e.target.value)}
            />
            <button onClick={addRole}>Add</button>
          </div>

        </div>

        {/* RIGHT : PERMISSIONS */}
        <div className="rp-perms">

          {selected ? (
            <>
              <h3>{selected.name} – Permissions</h3>

              <div className="rp-grid">
                {PERMISSIONS.map(p => (
                  <label key={p.key} className="rp-check">
                    <input
                      type="checkbox"
                      checked={selected.permissions.includes(p.key)}
                      onChange={()=>togglePermission(p.key)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p>Select a role</p>
          )}

        </div>

      </div>

      {/* CSS */}
      <style>{css}</style>
    </div>
  );
}


/* ================= CSS ================= */

const css = `
.rp-root{
  min-height:100vh;
  background:#020617;
  color:#e5e7eb;
  padding:30px 40px 70px;
  font-family:'Inter','Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif;
}

/* TOP */
.rp-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:25px;
}

.rp-title{
  font-size:30px;
  font-weight:900;
  color:#38bdf8;
}

.rp-back{
  background:#020617;
  border:1px solid #1e293b;
  color:#cbd5f5;
  padding:8px 14px;
  border-radius:10px;
  cursor:pointer;
}

/* LAYOUT */
.rp-layout{
  display:grid;
  grid-template-columns:300px 1fr;
  gap:20px;
}

/* ROLES */
.rp-roles{
  border:1px solid #1e293b;
  border-radius:18px;
  padding:16px;
  background:#020617;
}

.rp-roles h3{
  margin-bottom:12px;
  color:#38bdf8;
}

.rp-role{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 12px;
  border-radius:10px;
  cursor:pointer;
  margin-bottom:6px;
  border:1px solid transparent;
}

.rp-role:hover{
  background:#0b1020;
}

.rp-role.active{
  border-color:#38bdf8;
  background:#0b1020;
}

.rp-del{
  background:none;
  border:none;
  color:#ef4444;
  cursor:pointer;
  font-size:14px;
}

/* ADD ROLE */
.rp-add{
  display:flex;
  gap:6px;
  margin-top:12px;
}

.rp-add input{
  flex:1;
  padding:8px;
  border-radius:8px;
  border:1px solid #1e293b;
  background:#0b1020;
  color:white;
}

.rp-add button{
  padding:8px 12px;
  border:none;
  border-radius:8px;
  background:#38bdf8;
  color:#020617;
  font-weight:700;
}

/* PERMISSIONS */
.rp-perms{
  border:1px solid #1e293b;
  border-radius:18px;
  padding:16px;
  background:#020617;
}

.rp-perms h3{
  margin-bottom:12px;
  color:#38bdf8;
}

.rp-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:10px;
}

.rp-check{
  display:flex;
  align-items:center;
  gap:8px;
  background:#0b1020;
  padding:10px;
  border-radius:10px;
  cursor:pointer;
  font-size:14px;
}

.rp-check input{
  accent-color:#38bdf8;
}
`;










