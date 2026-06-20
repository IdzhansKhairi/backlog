"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../auth.css";

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordMismatch =
    formData.newPassword !== "" &&
    formData.confirmPassword !== "" &&
    formData.newPassword !== formData.confirmPassword;

  const canSubmit = 
    formData.fullName.trim() !== "" &&
    formData.nickname.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.newPassword.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    !passwordMismatch;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Simulate account creation success and redirect to login
    router.push("/login");
  };

  return (
    <div className="auth-card signup-card">
      <Image
        src="/images/backlog-logo-transparent.png"
        alt="PlamoLog Logo"
        width={300}
        height={300}
        className="auth-logo"
        style={{ marginBottom: 16 }}
      />

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-form-grid">
          <div className="auth-form-group">
            <label className="auth-label">Full name</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Hans Tan"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Nickname</label>
            <input
              type="text"
              name="nickname"
              className="auth-input"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="e.g. Hans"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Username</label>
            <input
              type="text"
              name="username"
              className="auth-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. hans_builds"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. hans@plamolog.app"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className="auth-input auth-password-input"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Create a password"
              />
              <i 
                className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"} auth-password-icon`} 
                onClick={() => setShowNewPassword(!showNewPassword)}
              ></i>
            </div>
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Confirm password</label>
            <div className="auth-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="auth-input auth-password-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <i 
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} auth-password-icon`} 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            {passwordMismatch && <span style={{ color: "#da3633", fontSize: 12, marginTop: 4 }}><i className="bi bi-exclamation-triangle-fill"></i> Passwords do not match</span>}
            {!passwordMismatch && formData.newPassword !== "" && formData.confirmPassword !== "" && (
              <span style={{ color: "#3fb950", fontSize: 12, marginTop: 4 }}><i className="bi bi-check-circle-fill"></i> Passwords match</span>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={!canSubmit}
        >
          Sign Up
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link href="/login" className="auth-link">Login</Link>
      </div>
    </div>
  );
}
