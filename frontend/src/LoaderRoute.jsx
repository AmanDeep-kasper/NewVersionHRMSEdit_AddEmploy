// LoaderRoute.jsx
import React from "react";

import MUNCLOGO from "./img/MUNCSMALL.svg";

const LoaderRoute = () => {
  return (
    <>
      <style>{`
        :root {
          --primary: #6366f1;     /* indigo-500 */
          --primary-light: #a78bfa; /* violet-400 */
          --text: #e2e8f0;
          --text-muted: #94a3b8;
          --bg: #234ec5;
        }

        .loading-screen {
          position: fixed;
          inset: 0;
          background: var(--bg);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          text-align: center;
          padding: 2rem;
        }

        .spinner {
          position: relative;
          width: 90px;
          height: 90px;
        }

        .ring {
          position: absolute;
          inset: 0;
          border: 5px solid transparent;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1.35s cubic-bezier(0.6, 0.1, 0.8, 0.8) infinite;
        }

        .ring:nth-child(2) {
          animation-delay: -0.22s;
          border-top-color: var(--primary-light);
          opacity: 0.7;
        }

        .ring:nth-child(3) {
          animation-delay: -0.44s;
          border-top-color: var(--primary);
          opacity: 0.45;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .loading-message {
          font-size: 1rem;
          color: var(--text-muted);
          margin: 0.75rem 0 0;
          max-width: 320px;
          line-height: 1.5;
        }

        .loading-dots {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: pulse 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.75);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        /* Optional: subtle glow effect */
        .spinner::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>

      <div className="loading-screen">
        <div className="loader-wrapper">
          <div className="spinner">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          <img
            src={MUNCLOGO}
            alt="MUN-C HRMS"
            style={{ height: "48px", marginBottom: "1rem" }}
          />

          <div>
            <h2 className="loading-title">Loading Dashboard</h2>
            <p className="loading-message">
              Setting up your workspace • This won't take long...
            </p>
          </div>

          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoaderRoute;
