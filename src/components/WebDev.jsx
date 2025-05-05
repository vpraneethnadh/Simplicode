// src/components/WebDev.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './css/WebDev.css';

export default function WebDev() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
  <html>
  <head><title>My Page</title></head>
  <body>
    Hello, world!
  </body>
  </html>`);
  const [css, setCss] = useState(`body { 
  font-family: sans-serif; 
  color: #333; 
}`);
  const [js, setJs] = useState(`console.log("Page loaded");`);
  const [showPrompt, setShowPrompt] = useState(false);
  const [projectName, setProjectName] = useState('');

  const buildDocument = () => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    ${html}
    <script src="script.js"></script>
  </body>
</html>`;

  const runCode = () => {
    const doc = `
<html>
  <head>
    <meta charset="utf-8" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}</script>
  </body>
</html>`;
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const downloadProject = () => {
    const zip = new JSZip();
    zip.file('index.html', buildDocument());
    zip.file('style.css', css);
    zip.file('script.js', js);
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${projectName || 'web-project'}.zip`);
      setShowPrompt(false);
      setProjectName('');
    });
  };

  return (
    <div className="webdev-container">
      {/* Header */}
      <div className="header top-bar">
        <div className="logo-web">SIMPLICODE</div>
        <div className="buttons">
          <button className="download-button" onClick={() => setShowPrompt(true)}>
            {/* 📦 Download Project */}
            Download
          </button>
          <button className="run-button" onClick={runCode}>
            {/* ▶️ Run Code in New Tab */}
            Run Code
          </button>
        </div>
      </div>

      {/* Editors */}
      <div className="editors">
        <div className="editor-pane large">
          <h4>index.html</h4>
          <Editor
            height="100%"
            defaultLanguage="html"
            value={html}
            onChange={setHtml}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
        <div className="editor-pane large">
          <h4>style.css</h4>
          <Editor
            height="100%"
            defaultLanguage="css"
            value={css}
            onChange={setCss}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
        <div className="editor-pane large">
          <h4>script.js</h4>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={js}
            onChange={setJs}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Download Modal */}
      {showPrompt && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Download Project</h3>
            <input
              className="modal-input"
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
            <div className="modal-actions">
              <button className="topbar-btn" onClick={() => setShowPrompt(false)}>
                Cancel
              </button>
              <button className="topbar-btn" onClick={downloadProject}>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
