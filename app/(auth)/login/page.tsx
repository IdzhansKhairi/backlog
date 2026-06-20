"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../auth.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    // Simulate login logic with specific credentials
    const isValidAdmin1 = username === "admin1" && password === "admin1";
    const isValidAdmin2 = username === "admin2" && password === "admin2";

    if (!isValidAdmin1 && !isValidAdmin2) {
      setError("Invalid username or password.");
      return;
    }

    // On successful login, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="auth-card">
      <Image
        src="/images/backlog-logo-transparent.png"
        alt="PlamoLog Logo"
        width={300}
        height={300}
        className="auth-logo"
      />

      {error && (
        <div className="auth-error-msg">
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-form-group">
          <label className="auth-label">Username</label>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <div className="auth-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input auth-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <i 
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} auth-password-icon`} 
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={!username.trim() || !password.trim()}
        >
          Login
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link href="/signup" className="auth-link">Sign up</Link>
      </div>
    </div>
  );
}
