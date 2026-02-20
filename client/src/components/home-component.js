import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeComponent.css"; // 导入 CSS 文件

const HomeComponent = () => {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "calc(100vh - 200px)" }}>
      <div className="container py-5">
        {/* Hero Section - 主标题区域 */}
        <div className="hero-section">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="hero-title">
                  📚 學習系統
                </h1>
                <p className="hero-description">
                  本系統使用 <strong>React.js</strong> 作為前端框架，
                  <strong>Node.js</strong>、<strong>MongoDB</strong> 作為後端服務器。
                  這種項目稱為 <strong>MERN</strong> 項目，它是創建現代網站的最流行的方式之一。
                </p>
                <button
                  className="btn btn-light btn-lg px-4 cta-button"
                  type="button"
                  onClick={() => navigate("/course")}
                >
                  🚀 開始探索課程
                </button>
              </div>
              <div className="col-lg-4 text-center mt-4 mt-lg-0">
                <div style={{ fontSize: "8rem", opacity: 0.3 }}>🎓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - 功能卡片 */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="feature-card student-card">
              <div className="mb-3" style={{ fontSize: "3rem" }}>
                👨‍🎓
              </div>
              <h2 className="h3 fw-bold mb-3">作為一個學生</h2>
              <p className="mb-4" style={{ opacity: 0.9 }}>
                學生可以註冊他們喜歡的課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                className="btn btn-outline-light btn-lg w-100 cta-button"
                type="button"
                onClick={() => navigate("/register")}
              >
                ✨ 立即註冊或登錄
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card instructor-card">
              <div className="mb-3" style={{ fontSize: "3rem" }}>
                👨‍🏫
              </div>
              <h2 className="h3 fw-bold mb-3">作為一個導師</h2>
              <p className="mb-4" style={{ opacity: 0.9 }}>
                您可以通過註冊成為一名講師，並開始製作在線課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                className="btn btn-light btn-lg w-100 cta-button"
                type="button"
                onClick={() => navigate("/postCourse")}
              >
                🎯 開始創建課程
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stack Section - 技术栈展示 */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="tech-stack">
              <h3 className="text-center mb-4 fw-bold">🛠️ 技術棧</h3>
              <div className="row text-center">
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="tech-item">
                    <div className="tech-icon">⚛️</div>
                    <strong>React.js</strong>
                    <p className="small text-muted mb-0">前端框架</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="tech-item">
                    <div className="tech-icon">🟢</div>
                    <strong>Node.js</strong>
                    <p className="small text-muted mb-0">後端運行環境</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="tech-item">
                    <div className="tech-icon">🍃</div>
                    <strong>MongoDB</strong>
                    <p className="small text-muted mb-0">數據庫</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="tech-item">
                    <div className="tech-icon">🔐</div>
                    <strong>JWT</strong>
                    <p className="small text-muted mb-0">身份認證</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-4 mt-5 text-center text-muted border-top">
          <p className="mb-2">
            <strong>MERN 學習系統</strong>
          </p>
          <p className="small mb-0">&copy; 2024 forrest. 本網站僅供學習練習使用。</p>
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
