import React, { useEffect, useMemo, useState } from "react";


export default function ResourcesHub() {

  const [tab, setTab] = useState("books");

  return (
    <div className="book-inventory-adv">

      <h2>📦 Campus Resources Hub</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setTab("books")}>📚 Book Inventory</button>{" "}
        <button onClick={() => setTab("digital")}>📁 Digital Resources</button>
      </div>

      {tab === "books" && <BookInventoryModule />}
      {tab === "digital" && <DigitalResourcesModule />}

    </div>
  );
}

/* ===========================================================
   BOOK INVENTORY MODULE
=========================================================== */

function BookInventoryModule() {

  const [role, setRole] = useState("Librarian");
  const [books, setBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    department: "",
    total: 1
  });

  const [issueForm, setIssueForm] = useState({
    bookId: "",
    user: "",
    days: 7
  });

  useEffect(() => {
    const raw = localStorage.getItem("hub-books");
    if (raw) {
      const d = JSON.parse(raw);
      setBooks(d.books || []);
      setLogs(d.logs || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hub-books",
      JSON.stringify({ books, logs })
    );
  }, [books, logs]);

  function log(action, info) {
    setLogs(p => [
      { id: Date.now(), action, info, time: new Date().toLocaleString() },
      ...p
    ]);
  }

  function addBook() {

    if (role !== "Librarian") return alert("No permission");

    if (!form.title) return alert("Enter title");

    const b = {
      id: Date.now(),
      ...form,
      total: Number(form.total),
      available: Number(form.total),
      issued: 0
    };

    setBooks([...books, b]);
    log("ADD BOOK", b.title);

    setForm({
      title: "",
      author: "",
      isbn: "",
      department: "",
      total: 1
    });
  }

  function issueBook() {

    if (role === "Viewer") return alert("No permission");

    const book = books.find(b => b.id === Number(issueForm.bookId));
    if (!book) return alert("Select book");
    if (book.available <= 0) return alert("Not available");

    setBooks(books.map(b =>
      b.id === book.id
        ? { ...b, available: b.available - 1, issued: b.issued + 1 }
        : b
    ));

    log("ISSUE", `${book.title} → ${issueForm.user}`);
  }

  function returnBook(id) {

    if (role === "Viewer") return;

    const book = books.find(b => b.id === id);

    setBooks(books.map(b =>
      b.id === id
        ? { ...b, available: b.available + 1, issued: b.issued - 1 }
        : b
    ));

    log("RETURN", book.title);
  }

  function markLost(id) {

    if (role !== "Librarian") return alert("Only librarian");

    const book = books.find(b => b.id === id);

    setBooks(books.map(b =>
      b.id === id
        ? {
            ...b,
            total: b.total - 1,
            available: b.available > 0 ? b.available - 1 : b.available
          }
        : b
    ));

    log("LOST", book.title);
  }

  const filtered = useMemo(() => {
    return books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  return (
    <>

      <h4>📚 Book Inventory</h4>

      Role :
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option>Librarian</option>
        <option>Staff</option>
        <option>Viewer</option>
      </select>

      <hr />

      <h4>Add Book</h4>

      <input placeholder="Title" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <input placeholder="Author" value={form.author}
        onChange={e => setForm({ ...form, author: e.target.value })} />

      <input placeholder="ISBN" value={form.isbn}
        onChange={e => setForm({ ...form, isbn: e.target.value })} />

      <input placeholder="Department" value={form.department}
        onChange={e => setForm({ ...form, department: e.target.value })} />

      <input type="number" min="1" value={form.total}
        onChange={e => setForm({ ...form, total: e.target.value })} />

      <button onClick={addBook}>Add Book</button>

      <hr />

      <h4>Issue Book</h4>

      <select
        value={issueForm.bookId}
        onChange={e => setIssueForm({ ...issueForm, bookId: e.target.value })}
      >
        <option value="">Select</option>
        {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
      </select>

      <input placeholder="User"
        value={issueForm.user}
        onChange={e => setIssueForm({ ...issueForm, user: e.target.value })} />

      <button onClick={issueBook}>Issue</button>

      <hr />

      <input
        placeholder="Search books"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Dept</th>
            <th>Total</th>
            <th>Avail</th>
            <th>Issued</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.department}</td>
              <td>{b.total}</td>
              <td>{b.available}</td>
              <td>{b.issued}</td>
              <td>
                <button onClick={() => returnBook(b.id)}>Return</button>
                <button onClick={() => markLost(b.id)}>Lost</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Book Audit Log</h4>
      <ul>
        {logs.slice(0, 8).map(l => (
          <li key={l.id}>[{l.time}] {l.action} – {l.info}</li>
        ))}
      </ul>

    </>
  );
}

/* ===========================================================
   DIGITAL RESOURCES MODULE
=========================================================== */

function DigitalResourcesModule() {

  const [role, setRole] = useState("Coordinator");
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

  useEffect(() => {
    const raw = localStorage.getItem("hub-digital");
    if (raw) {
      const d = JSON.parse(raw);
      setResources(d.resources || []);
      setLogs(d.logs || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hub-digital",
      JSON.stringify({ resources, logs })
    );
  }, [resources, logs]);

  function addLog(action, title) {
    setLogs(p => [
      { id: Date.now(), action, title, time: new Date().toLocaleString() },
      ...p
    ]);
  }

  function addResource() {

    if (role === "Viewer") return alert("No permission");

    if (!form.title || !form.link) return alert("Fill details");

    const r = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toLocaleString()
    };

    setResources([r, ...resources]);
    addLog("ADD", r.title);
  }

  function removeResource(id) {

    if (role !== "Admin") return alert("Only admin");

    const r = resources.find(x => x.id === id);
    setResources(resources.filter(x => x.id !== id));
    if (r) addLog("DELETE", r.title);
  }

  const filtered = useMemo(() => {
    return resources.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [resources, search]);

  return (
    <>

      <h4>📁 Digital Resources</h4>

      Role :
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option>Admin</option>
        <option>Coordinator</option>
        <option>Viewer</option>
      </select>

      <hr />

      <h4>Add Resource</h4>

      <input placeholder="Title" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <select value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}>
        <option>PDF</option>
        <option>Video</option>
        <option>Dataset</option>
        <option>Link</option>
      </select>

      <select value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}>
        <option>Teaching & Learning</option>
        <option>Research</option>
        <option>Student Support</option>
        <option>Governance</option>
        <option>Training</option>
      </select>

      <input placeholder="Department"
        value={form.department}
        onChange={e => setForm({ ...form, department: e.target.value })} />

      <select value={form.access}
        onChange={e => setForm({ ...form, access: e.target.value })}>
        <option>Internal</option>
        <option>Confidential</option>
        <option>Public</option>
      </select>

      <input placeholder="Link"
        value={form.link}
        onChange={e => setForm({ ...form, link: e.target.value })} />

      <button onClick={addResource}>Add Resource</button>

      <hr />

      <input
        placeholder="Search resources"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
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
              <td><a href={r.link} target="_blank" rel="noreferrer">Open</a></td>
              <td>
                <button onClick={() => window.open(r.link, "_blank")}>View</button>
                <button onClick={() => removeResource(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Digital Resource Audit Log</h4>
      <ul>
        {logs.slice(0, 8).map(l => (
          <li key={l.id}>[{l.time}] {l.action} – {l.title}</li>
        ))}
      </ul>

    </>
  );
}
