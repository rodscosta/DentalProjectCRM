import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { MdClose } from "react-icons/md";
// import { FiMenu } from "react-icons/fi";
import logo_dental_notebook from "../../assets/logo_dental_notebook.svg";
import navbar_home from "../../assets/navbar_home.svg";
import navbar_patients from "../../assets/navbar_patients.svg";
import navbar_appointments from "../../assets/navbar_appointments.svg";
import navbar_price_list from "../../assets/navbar_price_list.svg";
import navbar_earnings from "../../assets/navbar_earnings.svg";
import "./Navbar.css";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const sidebar = useRef();
  const hamburger = useRef();

  const handleClick = (e) => {
    if (
      sidebar.current.contains(e.target) ||
      hamburger.current.contains(e.target)
    ) {
      // inside click
      return;
    }
    // outside click
    setIsChecked(false);
    setNavbarOpen(false);
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
    setIsChecked(!isChecked);
  };

  const closeMenu = () => {
    setNavbarOpen(false);
    setIsChecked(false);
  };

  return (
    <div>
      <div className="logo-container">
        <div className="hamburger-menu" ref={hamburger}>
          <input
            className="bar"
            onClick={handleToggle}
            type="checkbox"
            id="b"
            checked={isChecked}
          />
          <label className="hamburger-menu-label" for="b">
            <div class="bar__element one"></div>
            <div class="bar__element two"></div>
            <div class="bar__element three"></div>
          </label>
        </div>

        <Link to="/" className="navbar-link-logo">
          <img src={logo_dental_notebook} alt="Logo" />
        </Link>
      </div>
      <nav className="navBar">
        {/* <button onClick={handleToggle}>
        {navbarOpen ? "Menu" : <span className="navBar-lines"></span>}
      </button> */}
        {/* <button onClick={handleToggle}>
        {navbarOpen ? (
          <MdClose style={{ color: "#fff", width: "40px", height: "40px" }} />
        ) : (
          <FiMenu style={{ color: "#7b7b7b", width: "40px", height: "40px" }} />
        )}
      </button> */}
        <ul
          className={`menuNav ${navbarOpen ? " showMenu" : ""}`}
          ref={sidebar}
        >
          <li>
            <Link to="/" className="active-link" onClick={() => closeMenu()}>
              <span className="navbar-icons">
                <img src={navbar_home} alt="home icon" />
              </span>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/patients"
              className="active-link"
              onClick={() => closeMenu()}
            >
              <span className="navbar-icons">
                <img src={navbar_patients} alt="patients icon" />
              </span>
              Patients
            </Link>
          </li>
          <li>
            <Link
              to="/appointments"
              className="active-link"
              onClick={() => closeMenu()}
            >
              <span className="navbar-icons">
                <img src={navbar_appointments} alt="appointments icon" />
              </span>
              Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/price-list"
              className="active-link"
              onClick={() => closeMenu()}
            >
              <span className="navbar-icons">
                <img src={navbar_price_list} alt="price list icon" />
              </span>
              Price List
            </Link>
          </li>
          <li>
            <Link
              to="/earnings"
              className="active-link"
              onClick={() => closeMenu()}
            >
              <span className="navbar-icons">
                <img src={navbar_earnings} alt="earnings icon" />
              </span>
              Earnings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
