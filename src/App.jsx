import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Login           from "./components/Login";
import Register        from "./components/Register";
import ForgotPassword  from "./components/ForgotPassword";
import CodeBot         from "./components/CodeBot";
import CodeEditor      from "./components/CodeEditor";
import WebDev          from "./components/WebDev"
import SQLPlayground   from "./components/SQLPlayground";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/codebot"         element={<CodeBot />} />
        <Route path="/"                element={<CodeEditor />} />
        <Route path="/webdev"          element={<WebDev />} />
        <Route path="/sql"             element={<SQLPlayground />} />
      </Routes>
    </Router>
  );
}

export default App;