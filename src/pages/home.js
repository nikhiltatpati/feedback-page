import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridGap: "0.75rem",
        }}
      >
        <Link to="/feedback">
          <button
            style={{
              padding: "20px 25px",
              border: "2",
              lineHeight: "2",
              borderRadius: "3px",
              background: "#3f51b5",
              color: "white",
            }}
          >
            Feedback
          </button>
        </Link>

        <Link to="/admin">
          <button
            style={{
              padding: "20px 25px",
              border: "2",
              lineHeight: "2",
              borderRadius: "3px",
              background: "#f1f2f7",
              color: "#434449",
            }}
          >
            Admin
          </button>
        </Link>
      </div>
    </div>
  );
}
