import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * User management (login, register, profile demo no backend).
 */
export function UserManagement() {
  const [mode, setMode] = useState("profile"); // "login", "register", "profile" for demo
  const [form, setForm] = useState({ name: "", email: "" });

  const handleInput = (e) => {
    setForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  // For demo, pretend user is always signed-in
  return (
    <div className="card" style={{ maxWidth: 450 }}>
      <h2 className="card-title">
        {mode === "profile"
          ? "User Profile"
          : mode === "register"
          ? "Register"
          : "Login"}
      </h2>
      {mode === "profile" && (
        <div>
          <div style={{ marginBottom: 13 }}>
            <div>
              <label>Name:</label>
            </div>
            <strong>Alex Rivera</strong>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div>
              <label>Email:</label>
            </div>
            <span style={{ color: "var(--muted)" }}>alex@email.com</span>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setMode("login")}
            style={{ marginRight: 8 }}
          >
            Log out
          </button>
        </div>
      )}
      {mode !== "profile" && (
        <form style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Name"
            onChange={handleInput}
            required
            style={{ marginBottom: 9 }}
            disabled={mode === "login"}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleInput}
            required
            style={{ marginBottom: 13 }}
          />
          <button
            className="btn"
            onClick={() => setMode("profile")}
            type="button"
          >
            {mode === "register" ? "Register" : "Login"}
          </button>
          <div style={{ marginTop: 9, color: "var(--muted)", fontSize: "0.97em" }}>
            {mode === "login"
              ? (
                  <>
                    Not yet a member?{" "}
                    <button
                      onClick={() => setMode("register")}
                      style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer" }}
                      type="button"
                    >
                      Register
                    </button>
                  </>
                )
              : (
                  <>
                    Have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer" }}
                      type="button"
                    >
                      Login
                    </button>
                  </>
                )}
          </div>
        </form>
      )}
    </div>
  );
}
