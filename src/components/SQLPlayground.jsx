// src/components/SQLPlayground.jsx
import React, { useState, useEffect, useRef } from "react";
import initSqlJs from "sql.js";
import Editor from "@monaco-editor/react";
import "./css/SQLPlayground.css";

export default function SQLPlayground() {
  const [SQL, setSQL] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [fileName, setFileName] = useState("query_results");
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const SQLlib = await initSqlJs({
          locateFile: () => "/assets/sql-wasm.wasm", // Correct WASM file path
        });
        setSQL(SQLlib);
      } catch (err) {
        console.error(err);
        setError("Failed to load SQL engine");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const executeQuery = () => {
    setError("");
    setMessage("");
    setResults([]);

    if (!SQL) return setError("SQL engine not ready");
    if (!query.trim()) return setError("Please enter SQL");

    try {
      const db = new SQL.Database();
      const execResults = db.exec(query);
      if (execResults.length === 0) {
        setMessage("Query executed successfully (no results to display)");
      } else {
        setResults(execResults);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
  };

  const exportResults = () => {
    const content = JSON.stringify(
      { query, results, timestamp: new Date().toISOString() },
      null,
      2
    );
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    link.click();
    setShowExportModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        setQuery(content.query);
        setResults(content.results);
      } catch {
        setError("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="loading">Initializing SQL Engine…</div>;
  }

  return (
    <div className="sql-playground">
      <div className="header">
        {/* Left logo */}
        <div className="logo-sql">SIMPLICODE</div>

        {/* Center title */}
        {/* <h2 className="text-sql">SQL Playground</h2> */}

        {/* Right toolbar */}
        <div className="toolbar">
          <button className="btn" onClick={() => fileInputRef.current.click()}>
            Upload
          </button>
          <button className="btn" onClick={() => setShowExportModal(true)}>
            Download
          </button>
          <button className="btn primary" onClick={executeQuery}>
            Execute Query
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
        accept=".json"
      />

      {/* Side-by-side panels */}
      <div className="panels">
        {/* Editor Panel */}
        <div className="panel editor-panel">
          <Editor
            height="100%"
            theme="vs-dark"
            language="sql"
            value={query}
            onChange={setQuery}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="panel results-panel">
          {error && <div className="banner error">{error}</div>}
          {message && <div className="banner success">{message}</div>}

          {results.length === 0 && !message ? (
            <div className="no-results">-- No results yet --</div>
          ) : (
            results.map((res, idx) => (
              <div key={idx} className="result-set">
                <div className="result-header">
                  <span>Result Set #{idx + 1}</span>
                  <span>{res.values.length} rows</span>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {res.columns.map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {res.values.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td key={c}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="export-modal">
            <h3>Export Results</h3>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={exportResults}>
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
