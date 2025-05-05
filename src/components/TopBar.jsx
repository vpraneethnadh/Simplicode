import React, { useRef, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./css/TopBar.css";

const TopBar = ({ onDownload, onUpload, code }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // user & profile menu
  const [user, setUser] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);

  // download modal
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [fileName, setFileName] = useState("code.txt");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) setProfileVisible(false);
    });
    return unsub;
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => onUpload(evt.target.result);
    reader.readAsText(file);
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setProfileVisible((v) => !v);
  };

  const handleSignOut = (e) => {
    e.stopPropagation();
    signOut(auth).catch(console.error);
    setProfileVisible(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleAskAi = (e) => {
    e.stopPropagation();
    if (!user) return;
    const url = `${window.location.origin}/#/codebot`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    try {
      const encoded = encodeURIComponent(btoa(code || ""));
      const link = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
      navigator.clipboard.writeText(link);
      alert("Shareable link copied to clipboard!");
    } catch {
      alert("Failed to create share link.");
    }
  };

  // Show the “enter filename” modal
  const showDownloadModal = () => {
    setFileName("code.txt");
    setDownloadModalVisible(true);
  };

  // Create the file and trigger download
  const downloadWithName = () => {
    const blob = new Blob([code || ""], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    let name = fileName.trim();
    if(!name.includes("."))
      name += ".txt";
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    setDownloadModalVisible(false);
  };

  return (
    <div className="topbar" onClick={() => setProfileVisible(false)}>
      <div className="topbar-left">
      <h2 className="logo">Simplicode</h2>
        <button
          className="topbar-btn-ai"
          onClick={handleAskAi}
          disabled={!user}
          title={!user ? "Login to use this feature" : "Ask AI"}
        >
          Ask AI
        </button>
      </div>

      <div className="topbar-buttons">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className="button-17-upload"
          onClick={() => fileInputRef.current.click()}
          role = "button"
        >
          Upload
        </button>

        <button
          className="button-17-download"
          onClick={showDownloadModal}
          role = "button"
        >
          Download
        </button>

        <button 
          className="button-17-share"
          onClick={handleShare}
          role = "button"
        >
          Share
        </button>

        {user ? (
          <div className="profile-container">
            <img
              src={user.photoURL || "default-avatar.png"}
              alt="Profile"
              className="profile-pic"
              onClick={toggleProfile}
            />
            {profileVisible && (
              <div
                className="profile-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <p>
                  <strong>{user.displayName}</strong>
                </p>
                <p>{user.email}</p>
                
                <ol className="profile-actions">
                  {/* <li>
                    <button className="topbar-btn" onClick={goToProfile}>
                      Profile
                    </button>
                  </li>  */}
                  <li>
                    <button className="topbar-btn" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </li>
                </ol>

              </div>
            )}
          </div>
        ) : (
          <button className="button-17-login" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>

      {downloadModalVisible && (
        <div
          className="modal-overlay"
          onClick={() => setDownloadModalVisible(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Name your file</h3>
            <input
              className="modal-input"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <div className="modal-actions">
              <button className="topbar-btn" onClick={downloadWithName}>
                Download
              </button>
              <button
                className="topbar-btn"
                onClick={() => setDownloadModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
