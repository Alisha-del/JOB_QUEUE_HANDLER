"use client";
import React, { useEffect, useState } from "react";

interface ImportLog {
  _id: string;
  fileName: string;
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { job: any; reason: string }[];
}

const API_BASE = "";

export default function AdminDashboard() {
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/import/logs`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerImport = async () => {
    setImporting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/import`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to trigger import");
      setSuccess("Import triggered successfully!");
      fetchLogs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Optionally, poll every 30s
    // const interval = setInterval(fetchLogs, 30000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <button onClick={triggerImport} disabled={importing} style={{ marginBottom: 16 }}>
        {importing ? "Importing..." : "Trigger Import"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <h2>Import History</h2>
      {loading ? (
        <div>Loading logs...</div>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", marginTop: 16 }}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Timestamp</th>
              <th>Total</th>
              <th>New</th>
              <th>Updated</th>
              <th>Failed</th>
              <th>Failed Reasons</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.fileName}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.totalImported}</td>
                <td>{log.newJobs}</td>
                <td>{log.updatedJobs}</td>
                <td>{log.failedJobs.length}</td>
                <td>
                  {log.failedJobs.length > 0 ? (
                    <ul>
                      {log.failedJobs.map((f, i) => (
                        <li key={i}>{f.reason}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 