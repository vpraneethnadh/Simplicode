import React, { useState, useRef, useEffect } from "react";
import { LANGUAGE_VERSIONS } from "../constants";
import "./css/Languageselector.css";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#3182ce";

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (lang) => {
    onSelect(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="selector-container">
      <div className="selector-label">Language:</div>
      <div className="menu" ref={menuRef}>
        <button className="menu-button" onClick={toggleMenu}>
          {language}
        </button>
        {isOpen && (
          <ul className="menu-list">
            {languages.map(([lang, version]) => (
              <li
                key={lang}
                className={`menu-item ${lang === language ? "active" : ""}`}
                onClick={() => handleSelect(lang)}
              >
                {lang} <span className="menu-item-version">({version})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
