import React, { useEffect, useMemo, useState } from "react";

/*
  Roles simulation:
  Librarian  -> full control
  Staff      -> issue / return / reserve
  Viewer     -> only view
*/

export default function BookInventoryAdvanced() {

  const [role, setRole] = useState("Librarian");

  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);

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

  /* ---------------- persistence ---------------- */

  useEffect(() => {
    const raw = localStorage.getItem("book-inventory-advanced");
    if (raw) {
      const parsed = JSON.parse(raw);
      setBooks(parsed.books || []);
      setTransactions(parsed.transactions || []);
      setReservations(parsed.reservations || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "book-inventory-advanced",
      JSON.stringify({ books, transactions, reservations })
    );
  }, [books, transactions, reservations]);

  /* ---------------- helpers ---------------- */

  function log(action, info) {
    setTransactions((p) => [
      {
        id: Date.now(),
        action,
        info,
        time: new Date().toLocaleString()
      },
      ...p
    ]);
  }

  /* ---------------- book master ---------------- */

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
    log("ADD_BOOK", b.title);

    setForm({
      title: "",
      author: "",
      isbn: "",
      department: "",
      total: 1
    });
  }

  /* ---------------- issue ---------------- */

  function issueBook() {

    if (role === "Viewer") return alert("No permission");

    const book = books.find(b => b.id === Number(issueForm.bookId));
    if (!book) return alert("Select book");

    if (book.available <= 0) return alert("Not available");

    const due = new Date();
    due.setDate(due.getDate() + Number(issueForm.days));

    setBooks(books.map(b =>
      b.id === book.id
        ? { ...b, available: b.available - 1, issued: b.issued + 1 }
        : b
    ));

    log("ISSUE", `${book.title} to ${issueForm.user} (Due: ${due.toDateString()})`);

    setIssueForm({ bookId: "", user: "", days: 7 });
  }

  /* ---------------- return ---------------- */

  function returnBook(bookId, user) {

    if (role === "Viewer") return alert("No permission");

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    setBooks(books.map(b =>
      b.id === bookId
        ? { ...b, available: b.available + 1, issued: b.issued - 1 }
        : b
    ));

    log("RETURN", `${book.title} from ${user}`);
  }

  /* ---------------- lost / damaged ---------------- */

  function markLost(bookId) {

    if (role !== "Librarian") return alert("Only librarian");

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    setBooks(books.map(b =>
      b.id === bookId
        ? {
            ...b,
            total: b.total - 1,
            available: b.available > 0 ? b.available - 1 : b.available
          }
        : b
    ));

    log("LOST/DAMAGED", book.title);
  }

  /* ---------------- reservation ---------------- */

  function reserveBook(bookId, user) {

    if (role === "Viewer") return alert("No permission");

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    setReservations([
      ...reservations,
      {
        id: Date.now(),
        bookId,
        title: book.title,
        user,
        time: new Date().toLocaleString()
      }
    ]);

    log("RESERVE", `${book.title} by ${user}`);
  }

  /* ---------------- fine simulation ---------------- */

  function calculateFine(dueDateStr) {

    const today = new Date();
    const due = new Date(dueDateStr);

    if (today <= due) return 0;

    const diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return diff * 2; // 2 currency units per day
  }

  /* ---------------- filters ---------------- */

  const filtered = useMemo(() => {
    return books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  /* ---------------- reports ---------------- */

  const summary = useMemo(() => {

    const totalBooks = books.reduce((a, b) => a + b.total, 0);
    const issued = books.reduce((a, b) => a + b.issued, 0);
    const available = books.reduce((a, b) => a + b.available, 0);

    return { totalBooks, issued, available };

  }, [books]);

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>

      <h2>📚 Advanced Book Inventory</h2>

      {/* role switch */}
      <div style={{ marginBottom: 15 }}>
        Role :
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option>Librarian</option>
          <option>Staff</option>
          <option>Viewer</option>
        </select>
      </div>

      {/* summary */}
      <div style={{ marginBottom: 15 }}>
        <b>Total copies :</b> {summary.totalBooks} &nbsp; |
        <b> Issued :</b> {summary.issued} &nbsp; |
        <b> Available :</b> {summary.available}
      </div>

      {/* add book */}
      <h4>Add Book (Librarian)</h4>
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
      <button onClick={addBook}>Add</button>

      <hr />

      {/* issue */}
      <h4>Issue book</h4>

      <select
        value={issueForm.bookId}
        onChange={e => setIssueForm({ ...issueForm, bookId: e.target.value })}
      >
        <option value="">Select book</option>
        {books.map(b => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <input
        placeholder="User name"
        value={issueForm.user}
        onChange={e => setIssueForm({ ...issueForm, user: e.target.value })}
      />

      <input
        type="number"
        value={issueForm.days}
        onChange={e => setIssueForm({ ...issueForm, days: e.target.value })}
      />

      <button onClick={issueBook}>Issue</button>

      <hr />

      {/* search */}
      <input
        placeholder="Search books..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* table */}
      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Dept</th>
            <th>Total</th>
            <th>Available</th>
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
                <button onClick={() => reserveBook(b.id, "Student")}>Reserve</button>
                <button onClick={() => returnBook(b.id, "Student")}>Return</button>
                <button onClick={() => markLost(b.id)}>Lost</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* reservations */}
      <h4>Reservations</h4>
      <ul>
        {reservations.map(r => (
          <li key={r.id}>
            {r.title} – {r.user} – {r.time}
          </li>
        ))}
      </ul>

      {/* audit log */}
      <h4>Audit / Transaction Log</h4>
      <ul>
        {transactions.slice(0, 15).map(t => (
          <li key={t.id}>
            [{t.time}] {t.action} – {t.info}
          </li>
        ))}
      </ul>

    </div>
  );
}

