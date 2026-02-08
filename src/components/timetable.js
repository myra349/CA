import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MOCK DATA ================= */

const roles = ["Admin","Academic Officer","Faculty","Clerk","Viewer"];
const departments = ["Exam","Academics","Admin","Faculty","Finance","Library","Infra","Analytics"];

const createUsers = () =>
  Array.from({ length: 25 }, (_, i) => ({
    id: "U" + String(i+1).padStart(3,"0"),
    name: ["Ravi","Kiran","Suma","Anil","Pooja","Neha","Rahul","Divya","Suresh","Kavitha"][i%10] + " " + (i+1),
    email: `user${i+1}@college.edu`,
    role: roles[i % roles.length],
    dept: departments[i % departments.length],
    active: Math.random() > 0.2
  }));

/* ================= COMPONENT ================= */

export default function UserManagement(){

  const navigate = useNavigate();

  const [users, setUsers] = useState(createUsers());
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [newUser, setNewUser] = useState({
    name:"",
    email:"",
    role:"Faculty",
    dept:"Academics",
    active:true
  });

  const filtered = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* ================= ACTIONS ================= */

  const addUser = () => {
    if(!newUser.name || !newUser.email){
      alert("Name and email required");
      return;
    }

    setUsers(prev => [
      ...prev,
      {
        ...newUser,
        id:"U" + String(prev.length + 1).padStart(3,"0")
      }
    ]);

    setNewUser({
      name:"",
      email:"",
      role:"Faculty",
      dept:"Academics",
      active:true
    });
  };

  const saveEdit = () => {
    setUsers(prev =>
      prev.map(u => u.id === editing.id ? editing : u)
    );
    setEditing(null);
  };

  const toggleActive = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  };

  const deleteUser = (id) => {
    if(!window.confirm("Delete this user?")) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="um-root">

      {/* TOP BAR */}
      <div className="um-top">

        <button
          className="um-back"
          onClick={() =>
            navigate("/dashboard",{ state:{ openDept:"admin" }})
          }
        >
          ⬅ Back
        </button>

        <div className="um-title">User Management</div>

      </div>

      {/* ADD USER */}
      <div className="um-add">

        <h3>Create New User</h3>

        <div className="um-form">

          <input
            placeholder="Full name"
            value={newUser.name}
            onChange={e=>setNewUser({...newUser,name:e.target.value})}
          />

          <input
            placeholder="Email"
            value={newUser.email}
            onChange={e=>setNewUser({...newUser,email:e.target.value})}
          />

          <select
            value={newUser.role}
            onChange={e=>setNewUser({...newUser,role:e.target.value})}
          >
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>

          <select
            value={newUser.dept}
            onChange={e=>setNewUser({...newUser,dept:e.target.value})}
          >
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>

          <button onClick={addUser}>Add User</button>

        </div>
      </div>

      {/* SEARCH */}
      <div className="um-search">
        <input
          placeholder="Search users..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>

      {/* USER TABLE */}
      <div className="um-table-wrap">

        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>

                <td>{u.id}</td>

                <td>
                  {editing?.id === u.id ? (
                    <input
                      value={editing.name}
                      onChange={e=>setEditing({...editing,name:e.target.value})}
                    />
                  ) : u.name}
                </td>

                <td>
                  {editing?.id === u.id ? (
                    <input
                      value={editing.email}
                      onChange={e=>setEditing({...editing,email:e.target.value})}
                    />
                  ) : u.email}
                </td>

                <td>
                  {editing?.id === u.id ? (
                    <select
                      value={editing.role}
                      onChange={e=>setEditing({...editing,role:e.target.value})}
                    >
                      {roles.map(r => <option key={r}>{r}</option>)}
                    </select>
                  ) : u.role}
                </td>

                <td>
                  {editing?.id === u.id ? (
                    <select
                      value={editing.dept}
                      onChange={e=>setEditing({...editing,dept:e.target.value})}
                    >
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  ) : u.dept}
                </td>

                <td>
                  <span className={u.active ? "active" : "inactive"}>
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>

                <td className="actions">

                  {editing?.id === u.id ? (
                    <>
                      <button onClick={saveEdit}>Save</button>
                      <button className="ghost" onClick={()=>setEditing(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>setEditing(u)}>Edit</button>
                      <button onClick={()=>toggleActive(u.id)}>
                        {u.active ? "Disable" : "Enable"}
                      </button>
                      <button className="danger" onClick={()=>deleteUser(u.id)}>Delete</button>
                    </>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* CSS */}
      <style>{css}</style>

    </div>
  );
}

/* ================= CSS ================= */

const css = `
.um-root{
  min-height:300vh;
  background:#020617;
  color:#e5e7eb;
  padding:24px 32px 60px;
  font-family:Inter,Segoe UI,Arial;
}

.um-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:18px;
}

.um-top{
  position:relative;
}

.um-title{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  font-size:76px;
  font-weight:900;
  color:#38bdf8;
}


.um-back{
  background:#020617;
  color:#cbd5f5;
  font-size:60px;
  border:1px solid #1e293b;
  padding:8px 14px;
  border-radius:8px;
  cursor:pointer;
}

/* ADD */
.um-add{
  border:1px solid #1e293b;
  border-radius:14px;
  padding:16px;
  margin-bottom:18px;
}

.um-add h3{
  margin-bottom:10px;
  color:#38bdf8;
  font-size:60px;
}

.um-form{
  display:grid;
  font-size:50px;
  grid-template-columns:repeat(auto-fit,minmax(180px,2fr));
  gap:10px;
}

.um-form input,
.um-form select{
  padding:80px 100;
  border-radius:8px;
  border:1px solid #1e293b;
  background:#0b1020;
  font-size:40px;
  color:white;
}

.um-form button{
  padding:8px 12px;
  border:none;
  border-radius:8px;
  background:#2563eb;
  color:white;
  cursor:pointer;
}

/* SEARCH */
.um-search{
  margin-bottom:12px;
}

.um-search input{
  width:100%;
  padding:8px 10px;
  font-size:60px;
 border-radius:8px;
  border:1px solid #1e293b;
  background:#0b1020;
  color:white;
}

/* TABLE */
.um-table-wrap{
  border:1px solid #1e293b;
  border-radius:14px;
  overflow:auto;
  max-height:65vh;
}

.um-table{
  width:100%;
  border-collapse:collapse;
  min-width:900px;
}

.um-table th,
.um-table td{
  padding:8px 10px;
  border-bottom:1px solid #1e293b;
  font-size:55px;
  color:white;
}

.um-table th{
  color:#38bdf8;
  text-align:left;
}

.actions button{
  margin-right:6px;
  padding:5px 8px;
  border:none;
  border-radius:6px;
  background:#2563eb;
  color:white;
  cursor:pointer
  ;
  gap:50px;
  font-size:42px;
}

.actions .danger{
  background:#7f1d1d;
}

.actions .ghost{
  background:#475569;
}

.active{
  color:#22c55e;
  font-weight:700;
}
.inactive{
  color:#ef4444;
  font-weight:700;
}
`;

