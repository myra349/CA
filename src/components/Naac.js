import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ---------------- Simple local UI (no shadcn, no aliases) ---------------- */
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:border-indigo-700/60 ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

// -------- MOCK API (later you can replace with real backend call) --------
function fetchDashboardData(year) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: {
          grade: year === "2025" ? "A++" : "A+",
          cgpa: year === "2025" ? 3.61 : 3.45,
          nbaPrograms: 6,
          faculty: 128,
          departments: 12
        },
        naac: [
          { criteria: "C1", score: year === "2025" ? 3.4 : 3.2 },
          { criteria: "C2", score: year === "2025" ? 3.7 : 3.5 },
          { criteria: "C3", score: year === "2025" ? 3.3 : 3.1 },
          { criteria: "C4", score: year === "2025" ? 3.6 : 3.4 },
          { criteria: "C5", score: year === "2025" ? 3.8 : 3.6 },
          { criteria: "C6", score: year === "2025" ? 3.5 : 3.3 },
          { criteria: "C7", score: year === "2025" ? 3.9 : 3.7 }
        ],
        nba: [
          { dept: "CSE", status: "Accredited" },
          { dept: "ECE", status: "Accredited" },
          { dept: "EEE", status: "Applied" },
          { dept: "ME", status: "Accredited" },
          { dept: "CE", status: "Not Applied" }
        ]
      });
    }, 500);
  });
}

export default function VistarNetraDashboard() {
  const [year, setYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [naacData, setNaacData] = useState([]);
  const [nbaData, setNbaData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, [year]);

  async function loadData() {
    setLoading(true);
    const res = await fetchDashboardData(year);
    setSummary(res.summary);
    setNaacData(res.naac);
    setNbaData(res.nba);
    setLoading(false);
  }

  function updateScore(criteria, value) {
    setNaacData((prev) =>
      prev.map((c) =>
        c.criteria === criteria ? { ...c, score: Number(value) } : c
      )
    );
  }

  const filteredNBA = useMemo(() => {
    if (statusFilter === "ALL") return nbaData;
    return nbaData.filter((n) => n.status === statusFilter);
  }, [nbaData, statusFilter]);

  const averageScore = useMemo(() => {
    if (!naacData.length) return 0;
    return (
      naacData.reduce((a, b) => a + b.score, 0) / naacData.length
    ).toFixed(2);
  }, [naacData]);

  return (
    <div className="naac-dashboard min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 text-white">

      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Vistar Netra – NAAC / NBA Dashboard</h1>
   

        </div>

        {/* Back to Quality page */}
        <Link
          to="/quality"
          className="inline-flex items-center rounded-xl border border-indigo-700/60 bg-indigo-900/40 px-4 py-2 text-sm font-semibold hover:bg-indigo-900 transition"
        >
          ← Back to Quality
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <button
          onClick={loadData}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-900/60 hover:bg-indigo-900 font-semibold"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm mb-4 opacity-80">Loading dashboard data...</p>}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <StatCard title="NAAC Grade" value={summary.grade} />
          <StatCard title="CGPA (Avg)" value={`${averageScore} / 4`} />
          <StatCard title="NBA Programs" value={summary.nbaPrograms} />
          <StatCard title="Faculty" value={summary.faculty} />
          <StatCard title="Departments" value={summary.departments} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* NAAC block */}
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">NAAC Criteria – Dynamic Scores</h2>
              <span className="text-sm opacity-80">Editable</span>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={naacData}>
                  <XAxis dataKey="criteria" stroke="#ffffff" />
                  <YAxis domain={[0, 4]} stroke="#ffffff" />
                  <Tooltip />
                  <Bar dataKey="score" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {naacData.map((c) => (
                <div key={c.criteria} className="text-sm">
                  <label className="block mb-1 opacity-80">{c.criteria}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={c.score}
                    onChange={(e) => updateScore(c.criteria, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NBA block */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">NBA Accreditation</h2>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="ALL">All</option>
                <option value="Accredited">Accredited</option>
                <option value="Applied">Applied</option>
                <option value="Not Applied">Not Applied</option>
              </select>
            </div>

            <ul className="space-y-4 text-sm">
              {filteredNBA.map((n) => (
                <li
                  key={n.dept}
                  className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2"
                >
                  <span className="font-medium">{n.dept}</span>
                  <span
                    className={
                      n.status === "Accredited"
                        ? "text-emerald-400"
                        : n.status === "Applied"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {n.status}
                  </span>
                </li>
              ))}

              {!filteredNBA.length && (
                <p className="text-sm opacity-70">No departments found</p>
              )}
            </ul>
          </CardContent>
        </Card>

      </div>

      {/* Quality activity cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <ActionCard
          title="Student Progress"
          items={["Live pass % tracking", "Placement sync", "Higher studies update"]}
        />
        <ActionCard
          title="Research & Innovation"
          items={["Auto publication fetch", "Patent status sync", "Funding reports"]}
        />
        <ActionCard
          title="Infrastructure"
          items={["Lab utilization tracking", "Asset audit logs", "Smart classroom reports"]}
        />
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, items }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <ul className="text-sm space-y-2 opacity-90">
          {items.map((i) => (
            <li key={i}>• {i}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

