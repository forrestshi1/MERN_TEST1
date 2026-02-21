import React from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import "./NavComponent.css";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();

  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功!現在您會被導向到首頁。");
    setCurrentUser(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="nav-wrapper">
      <nav className="navbar navbar-expand-lg nav-custom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            📚 學習系統
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  to="/"
                >
                  首頁
                </Link>
              </li>

              {!currentUser && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/register") ? "active" : ""}`}
                      to="/register"
                    >
                      註冊會員
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/login") ? "active" : ""}`}
                      to="/login"
                    >
                      會員登入
                    </Link>
                  </li>
                </>
              )}
              {currentUser && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                      to="/profile"
                    >
                      個人頁面
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/course") ? "active" : ""}`}
                      to="/course"
                    >
                      課程頁面
                    </Link>
                  </li>
                  {currentUser.user.role === "instructor" && (
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${isActive("/postCourse") ? "active" : ""}`}
                        to="/postCourse"
                      >
                        新增課程
                      </Link>
                    </li>
                  )}
                  {currentUser.user.role === "student" && (
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${isActive("/enroll") ? "active" : ""}`}
                        to="/enroll"
                      >
                        註冊課程
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      onClick={handleLogout}
                    >
                      登出
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
