import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import "./css/Codeeditor.css";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(CODE_SNIPPETS.python);
  const [language, setLanguage] = useState("python");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("code");
    if (encoded) {
      try {
        const decoded = atob(decodeURIComponent(encoded));
        setValue(decoded);
      } catch (err) {
        console.error("Failed to decode shared code:", err);
      }
    }
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onLanguageChange = (lang) => {
    const lower = lang.toLowerCase();
    setLanguage(lower);
    setValue(CODE_SNIPPETS[lower] || "");
  };

  const downloadCode = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    let ext = "txt";
    if (language === "javascript") ext = "js";
    else if (language === "python") ext = "py";
    a.download = `code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-editor-container">
      <TopBar
        onDownload={downloadCode}
        onUpload={setValue}
        onAskAi={() => {}}
        code={value}
      />

      <div className="main-area">
        <Navbar onLanguageChange={onLanguageChange} />
        <div className="code-editor-content">
          {/* Editor Pane Wrapper */}
          <div className="editor-box">
            <Editor
              options={{ minimap: { enabled: false } }}
              height="100%"
              width="100%"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(v) => typeof v === "string" && setValue(v)}
            />
          </div>

          {/* Output Pane Wrapper */}
          <div className="output-box">
            <Output
              editorRef={editorRef}
              language={language}
              code={value}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
