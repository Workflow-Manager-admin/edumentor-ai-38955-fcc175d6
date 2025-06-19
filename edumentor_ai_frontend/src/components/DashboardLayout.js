import React from "react";
import "../dashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main dashboard layout: sidenav, header, content.
 */
function DashboardLayout({ user, nav, selected, onSelect, children }) {
  return (
    <div className="dashboard-app">
      <aside className="dashboard-sidenav">
        <div className="sidenav-logo">EduMentor AI</div>
        <ul className="sidenav-nav">
          {nav.map((item) => (
            <li key={item.key}>
              <button
                className={
                  "sidenav-link" + (selected === item.key ? " selected" : "")
                }
                onClick={() => onSelect(item.key)}
                type="button"
                style={{ width: "100%", background: "none", border: "none" }}
                aria-current={selected === item.key}
              >
                <span style={{ width: 24, fontSize: "1.11em", marginRight: 9 }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidenav-bottom">
          <span>2024 &copy; EduMentor AI</span>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span style={{ fontWeight: 600, color: "var(--primary)" }}>
              Welcome, {user.name?.split(" ")[0]}
            </span>
          </div>
          <div className="user-info">
            <span className="profile-circle">{user.initial ?? "U"}</span>
            <span style={{ fontWeight: 500, color: "var(--muted)" }}>
              {user.name}
            </span>
          </div>
        </header>
        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
}

export default DashboardLayout;
