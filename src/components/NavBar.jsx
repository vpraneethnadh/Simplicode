import React from "react";
import PropTypes from "prop-types";
import {
  SiCplusplus,
  SiTypescript,
  SiPhp,
  SiGo,
  SiRuby,
  SiMongodb,
  SiMysql,
} from "react-icons/si";
import {
  FaPython,
  FaJs,
  FaJava,
  FaCuttlefish,
} from "react-icons/fa";
import { MdOutlineWebAsset } from "react-icons/md";
import "./css/NavBar.css";

const Navbar = ({ onLanguageChange }) => {
  const languages = [
    { name: "Python",     icon: <FaPython />,     type: 'action' },
    { name: "Java",       icon: <FaJava />,       type: 'action' },
    { name: "C",          icon: <FaCuttlefish />, type: 'action' },
    { name: "Cpp",        icon: <SiCplusplus />,  type: 'action' },
    { name: "JavaScript", icon: <FaJs />,         type: 'action' },
    { name: "TypeScript", icon: <SiTypescript />, type: 'action' },
    { name: "Go",         icon: <SiGo />,         type: 'action' },
    { name: "Ruby",       icon: <SiRuby />,       type: 'action' },
    { name: "PHP",        icon: <SiPhp />,        type: 'action' },
    { name: "Web Development", icon: <MdOutlineWebAsset />, type: 'nav', path: '/webdev' },
    { name: "SQL",        icon: <SiMysql />,      type: 'nav', path: '/sql' },
    // { name: "MongoDB",    icon: <SiMongodb />,    type: 'nav', path: '/mongodb' },
  ];

  // Always open a hash URL so HashRouter sees it
  const navigate = (path) => {
    const hashUrl = `${window.location.origin}/#${path}`;
    window.open(hashUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="vscode-navbar">
      {languages.map(({ name, icon, type, path }) => (
        <button
          key={name}
          className="navbar-button"
          title={name}
          onClick={() => {
            if (type === 'nav') {
              navigate(path);
            } else {
              onLanguageChange(name);
            }
          }}
        >
          {icon}
        </button>
      ))}
    </nav>
  );
};

Navbar.propTypes = {
  onLanguageChange: PropTypes.func.isRequired,
};

export default Navbar;
