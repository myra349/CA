import React, { useState, useEffect, useRef } from "react";

/* ================= USERS ================= */
const STUDENTS = ["Ravi", "Sita", "Rahul", "Ananya", "Vikram", "Neha", "Aditya"];

/* ================= REALISTIC ISSUES ================= */
const issueMap = {
  Exams: [
    {
      title: "Hall ticket not generated",
      story:
        "I paid exam fee 10 days ago but hall ticket is still not generated. My exam is tomorrow. Please resolve urgently."
    },
    {
      title: "Internal marks missing",
      story:
        "My internal marks for AI subject are not showing in portal though faculty confirmed submission."
    }
  ],
  Fees: [
    {
      title: "Scholarship not credited",
      story:
        "My scholarship amount is not credited even after 4 months. My classmates already received it."
    },
    {
      title: "Wrong late fee added",
      story:
        "System added late fee even though I paid before due date. Please verify transaction."
    }
  ],
  Facilities: [
    {
      title: "Water cooler not working",
      story:
        "Water cooler in Block B 3rd floor is not working since one week. Students are facing problem."
    }
  ],
  Library: [
    {
      title: "Library access blocked",
      story:
        "My ID card shows blocked in library system though I returned all books."
    }
  ]
};

/* ================= GENERATE PROFESSIONAL QUERIES ================= */
const generateQueries = () => {
  let id = 1;
  const arr = [];

  Object.keys(issueMap).forEach((cat) => {
    issueMap[cat].forEach((issue) => {
      const userName = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];

      arr.push({
        id: id++,
        title: issue.title,
        category: cat,
        priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
        status: "Pending",
        desc: issue.story,
        userRole: "student",
        userName,
        createdAt: new Date().toISOString(),
        messages: [
          {
            from: userName,
            text: issue.story,
            time: new Date().toLocaleTimeString()
          }
        ]
      });
    });
  });

  return arr;
};

export default function CampusDashboard() {
  const [queries, setQueries] = useState(
    () => JSON.parse(localStorage.getItem("campus_queries_v2")) || generateQueries()
  );
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const confRef = useRef(null);
  const chatEndRef = useRef(null);

  /* ================= SAVE ================= */
  useEffect(() => {
    localStorage.setItem("campus_queries_v2", JSON.stringify(queries));
  }, [queries]);

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedQuery, queries, userTyping]);

  /* ================= SMART FOLLOW-UP (ONCE) ================= */
  useEffect(() => {
    if (!selectedQuery) return;

    const timeout = setTimeout(() => {
      setUserTyping(true);

      setTimeout(() => {
        const msg = {
          from: selectedQuery.userName,
          text: "Sir, any update on this? This is becoming urgent for me.",
          time: new Date().toLocaleTimeString()
        };

        setQueries((prev) =>
          prev.map((q) =>
            q.id === selectedQuery.id
              ? { ...q, messages: [...q.messages, msg] }
              : q
          )
        );

        setUserTyping(false);
      }, 3000);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [selectedQuery]);

  /* ================= CONFETTI ================= */
  const spawnConfetti = (container, n = 40) => {
    if (!container) return;
    const colors = ["#22c55e", "#3b82f6", "#f97316", "#a855f7"];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "ap-conf";
      el.style.left = Math.random() * 100 + "%";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = 6 + Math.random() * 10 + "px";
      el.style.height = 8 + Math.random() * 14 + "px";
      container.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = (q, status) => {
    setQueries((prev) =>
      prev.map((x) => (x.id === q.id ? { ...x, status } : x))
    );
    if (status === "Resolved") spawnConfetti(confRef.current, 40);
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedQuery) return;

    const adminMsg = {
      from: "Admin",
      text: chatMessage,
      time: new Date().toLocaleTimeString()
    };

    setQueries((prev) =>
      prev.map((q) =>
        q.id === selectedQuery.id
          ? {
              ...q,
              status: "In Progress",
              messages: [...q.messages, adminMsg]
            }
          : q
      )
    );

    setChatMessage("");

    // System reply
    setTimeout(() => {
      const sys = {
        from: "System",
        text:
          "Your complaint is forwarded to the concerned department. You will be updated shortly.",
        time: new Date().toLocaleTimeString()
      };

      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id
            ? { ...q, messages: [...q.messages, sys] }
            : q
        )
      );
    }, 1500);
  };

  /* ================= ANALYTICS ================= */
  const total = queries.length;
  const pending = queries.filter((q) => q.status === "Pending").length;
  const inProgress = queries.filter((q) => q.status === "In Progress").length;
  const resolved = queries.filter((q) => q.status === "Resolved").length;

  return (
    <div className="campus-root">
      <h2>🎓 Smart Campus Grievance Dashboard</h2>

      <div className="campus-analytics">
        <div className="card">Total<br />{total}</div>
        <div className="card">Pending<br />{pending}</div>
        <div className="card">In Progress<br />{inProgress}</div>
        <div className="card">Resolved<br />{resolved}</div>
      </div>

      <div className="campus-main">
        {/* LEFT */}
        <div className="campus-left">
          {queries.map((q) => (
            <div key={q.id} className="query-card">
              <h4>{q.title}</h4>
              <small>{q.userName} • {q.category}</small>
              <p>{q.desc}</p>

              <button onClick={() => { setSelectedQuery(q); setChatOpen(true); }}>
                Open Chat
              </button>

              <select value={q.status} onChange={(e) => updateStatus(q, e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          ))}
        </div>

        {/* RIGHT CHAT */}
        <div className="campus-right">
          {selectedQuery && chatOpen ? (
            <>
              <h3>Chat with {selectedQuery.userName}</h3>

              <div className="chat-box">
                {selectedQuery.messages.map((m, i) => (
                  <div key={i} className={`msg-bubble ${m.from === "Admin" || m.from === "System" ? "admin" : "user"}`}>
                    <div className="msg-author">{m.from}</div>
                    <div>{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                ))}

                {userTyping && (
                  <div className="typing-indicator">
                    {selectedQuery.userName} is typing...
                  </div>
                )}

                <div ref={chatEndRef}></div>
              </div>

              <div className="chat-input">
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type reply..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <p>Select a complaint to open chat</p>
          )}
        </div>
      </div>

      <div ref={confRef} className="confetti-wrap" />

      {/* ================= STYLE ================= */}
      <style>{`
      body { background:#0f172a; color:white; font-family:Segoe UI; }
      .campus-root{ padding:20px; }
      .campus-analytics{ display:flex; gap:10px; }
      .card{ background:#020617; padding:15px; border-radius:10px; min-width:120px; text-align:center; }
      .campus-main{ display:flex; gap:10px; margin-top:20px; }
      .campus-left{ width:50%; max-height:75vh; overflow:auto; }
      .campus-right{ width:50%; background:#020617; border-radius:10px; padding:10px; }
      .query-card{ background:#020617; margin-bottom:10px; padding:12px; border-radius:10px; }
      .query-card button{ margin-right:10px; }

      .chat-box{ height:400px; overflow:auto; display:flex; flex-direction:column; }
      .msg-bubble{ max-width:70%; margin:6px; padding:10px; border-radius:12px; }
      .msg-bubble.user{ background:#1e40af; align-self:flex-start; }
      .msg-bubble.admin{ background:#166534; align-self:flex-end; }
      .msg-author{ font-size:12px; opacity:0.7; }
      .msg-time{ font-size:10px; opacity:0.6; text-align:right; }
      .chat-input{ display:flex; gap:10px; }
      .chat-input input{ flex:1; padding:10px; border-radius:8px; }
      .typing-indicator{ font-style:italic; opacity:0.7; margin:5px; }

      .confetti-wrap{ position:fixed; inset:0; pointer-events:none; }
      .ap-conf{ position:absolute; top:-10px; animation: fall 3s linear; }
      @keyframes fall{ to{ transform:translateY(100vh) rotate(360deg); } }
      `}</style>
    </div>
  );
}





