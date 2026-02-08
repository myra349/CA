import React, { useEffect, useMemo, useState } from "react";


export default function DigitalResources() {

  const [role, setRole] = useState("Coordinator"); // Admin | Coordinator | Viewer
  const [resources, setResources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "PDF",
    category: "Teaching & Learning",
    department: "CSE",
    access: "Internal",
    link: ""
  });

  /* ------------ Load / Save ------------ */

  useEffect(() => {
    const raw = localStorage.getItem("digital-resources-store");
    if (raw) {
      const d = JSON.parse(raw);
      setResources(d.resources || []);
      setLogs(d.logs || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "digital-resources-store",
      JSON.stringify({ resources, logs })
    );
  }, [resources, logs]);

  /* ------------ helpers ------------ */

  function addLog(action, title) {
    setLogs(p => [
      {
        id: Date.now(),
        action,
        title,
        time: new Date().toLocaleString()
      },
      ...p
    ]);
  }

  /* ------------ add ------------ */

  function addResource() {

    if (role === "Viewer") {
      alert("No permission");
      return;
    }

    if (!form.title || !form.link) {
      alert("Title and link required");
      return;
    }

    const r = {
      id: Date.now(),
      ...form,
      createdBy: role,
      createdAt: new Date().toLocaleString()
    };

    setResources([r, ...resources]);
    addLog("ADD", r.title);

    setForm({
      title: "",
      type: "PDF",
      category: "Teaching & Learning",
      department: "CSE",
      access: "Internal",
      link: ""
    });
  }

  /* ------------ delete ------------ */

  function removeResource(id) {

    if (role !== "Admin") {
      alert("Only admin can delete");
      return;
    }

    const r = resources.find(x => x.id === id);

    setResources(resources.filter(x => x.id !== id));
    if (r) addLog("DELETE", r.title);
  }

  /* ------------ filter ------------ */

  const filtered = useMemo(() => {
    return resources.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [resources, search]);

  /* ------------ UI ------------ */

  return (
    <div className="book-inventory-adv">

      <h2>📁 Digital Resources</h2>

      {/* role */}
      <div style={{ marginBottom: 10 }}>
        Role :
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option>Admin</option>
          <option>Coordinator</option>
          <option>Viewer</option>
        </select>
      </div>

      <hr />

      <h4>Add Resource</h4>

      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <select
        value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}
      >
        <option>PDF</option>
        <option>Video</option>
        <option>Presentation</option>
        <option>Dataset</option>
        <option>Link</option>
      </select>

      <select
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      >
        <option>Teaching & Learning</option>
        <option>Research</option>
        <option>Student Support</option>
        <option>Governance</option>
        <option>Training</option>
        <option>Best Practices</option>
      </select>

      <input
        placeholder="Department"
        value={form.department}
        onChange={e => setForm({ ...form, department: e.target.value })}
      />

      <select
        value={form.access}
        onChange={e => setForm({ ...form, access: e.target.value })}
      >
        <option>Internal</option>
        <option>Confidential</option>
        <option>Public</option>
      </select>

      <input
        placeholder="Resource link / drive link"
        value={form.link}
        onChange={e => setForm({ ...form, link: e.target.value })}
      />

      <button onClick={addResource}>Add Resource</button>

      <hr />

      {/* search */}
      <input
        placeholder="Search by title / category / department"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* table */}
      <table
        border="1"
        cellPadding="6"
        style={{ width: "100%", marginTop: 10 }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Category</th>
            <th>Dept</th>
            <th>Access</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.type}</td>
              <td>{r.category}</td>
              <td>{r.department}</td>
              <td>{r.access}</td>
              <td>
                <a href={r.link} target="_blank" rel="noreferrer">
                  Open
                </a>
              </td>
              <td>
                <button onClick={() => window.open(r.link, "_blank")}>
                  View
                </button>
                <button onClick={() => removeResource(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="7">No resources found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* audit */}
      <h4>Audit Log</h4>
      <ul>
        {logs.slice(0, 12).map(l => (
          <li key={l.id}>
            [{l.time}] {l.action} – {l.title}
          </li>
        ))}
      </ul>

    </div>
  );
}
