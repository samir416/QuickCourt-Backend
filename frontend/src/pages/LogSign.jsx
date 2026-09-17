import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LogSign() {
  const [mode, setMode] = useState("login");
  const [stage, setStage] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [imageError, setImageError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const fullName = formData.get("fullName");
    const roleType = formData.get("roleType");
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;

    setEmailError("");
    setPasswordError("");
    setFormError("");
    setUserEmail(email);
    if (fullName) setUserName(fullName);

    if (imageError) return;
    setIsSubmitting(true);

    if (mode === "login") {
      try {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        login(data);
        if (data.role === "ADMIN") navigate("/admin/dashboard");
        else if (data.role === "FACILITY_OWNER") navigate("/owner/dashboard");
        else navigate("/");
      } catch (err) {
        setFormError(err.message || "Login failed");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!passwordPattern.test(password) || password !== confirmPassword) {
      setPasswordError(
        "Use 8-20 characters with at least one uppercase letter, one number, and one special symbol like @ or #."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const dbRole = roleType === "Facility Owner" ? "FACILITY_OWNER" : "PLAYER";
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: fullName, email, password, role: dbRole }),
      });
      setStage("verify");
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("email")) {
        setEmailError(err.message);
      } else {
        setFormError(err.message || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setImageError("File size should not exceed 2MB");
      e.target.value = "";
    } else {
      setImageError("");
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStage("form");
    setPasswordError("");
    setEmailError("");
    setImageError("");
    setResetMessage("");
    setFormError("");
  };

  return (
    <main className="auth-page">
      <section className="auth-art" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--ink, #1d2821)' }}>
        <img 
          src="/login-bg.jpg" 
          alt="QuickCourt Sports Facility" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 1 }} 
        />
        {/* Subtle dark green overlay for readability without destroying the image */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(29, 40, 33, 0.9) 0%, rgba(29, 40, 33, 0.4) 50%, rgba(29, 40, 33, 0.1) 100%)', zIndex: 2 }} />

        <div className="auth-art-content" style={{ justifyContent: 'flex-end', paddingBottom: '12%', zIndex: 10 }}>
          <div style={{ position: 'relative', color: '#ffffff' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em' }}>
              QUICKCOURT
            </h2>
            <p style={{ marginTop: '12px', fontSize: 'clamp(14px, 1.5vw, 18px)', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '320px', lineHeight: 1.4, fontWeight: '400' }}>
              LOCAL SPORTS. SIMPLE BOOKING.
            </p>
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <Link className="auth-brand" to="/">
          quickcourt
        </Link>
        {stage === "verify" ? (
          <VerificationPanel onBack={() => setStage("form")} userEmail={userEmail} userName={userName} />
        ) : stage === "forgot" ? (
          <ForgotPasswordPanel onBack={() => setStage("form")} onProceed={(email) => { setUserEmail(email); setStage("reset"); }} />
        ) : stage === "reset" ? (
          <ResetPasswordPanel onBack={() => setStage("form")} userEmail={userEmail} onSuccess={() => setStage("form")} />
        ) : (
          <>
            <div className="auth-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
              <button
                className={mode === "signup" ? "active" : ""}
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
            </div>
            <h1 className="auth-screen-title">
              {mode === "login" ? "LOGIN" : "SIGN UP"}
            </h1>
            <form onSubmit={handleSubmit} className="auth-form">
              {formError && (
                  <div style={{ color: 'red', marginBottom: '15px' }}>
                    {formError}
                    {formError.includes("verify your email") && (
                      <button
                        type="button"
                        onClick={async () => {
                          setFormError("");
                          try {
                            setIsSubmitting(true);
                            await apiFetch("/auth/otp/send", { method: "POST", body: JSON.stringify({ email: userEmail, type: "VERIFICATION" }) });
                            setStage("verify");
                          } catch (e) {
                            setFormError(e.message || "Failed to send OTP");
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        style={{ display: "block", marginTop: "10px", padding: "5px 10px", background: "none", border: "1px solid currentColor", color: "inherit", cursor: "pointer", fontSize: "0.9em", borderRadius: "4px" }}
                      >
                        Resend Verification OTP
                      </button>
                    )}
                  </div>
                )}
              {mode === "signup" && (
                <>
                  <label className="field-label profile-picture-field">
                    Profile Picture
                    <input
                      name="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imageError && (
                      <small className="auth-error">{imageError}</small>
                    )}
                  </label>
                  <label className="field-label">
                    Sign up as
                    <select name="roleType" defaultValue="Player">
                      <option>Player</option>
                      <option>Facility Owner</option>
                    </select>
                  </label>
                  <label className="field-label">
                    Full name
                    <input name="fullName" required placeholder="Your name" />
                  </label>
                </>
              )}
              <label className="field-label">
                Email
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                />
                {emailError && (
                  <small className="auth-error">{emailError}</small>
                )}
              </label>
              <PasswordField
                label="Password"
                placeholder="8-20 characters"
                name="password"
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
              {mode === "signup" && (
                <PasswordField
                  label="Confirm password"
                  placeholder="Repeat your password"
                  name="confirmPassword"
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((current) => !current)}
                />
              )}
              {passwordError && (
                <small className="auth-error password-error">
                  {passwordError}
                </small>
              )}
              {mode === "login" && (
                <>
                  <button
                    className="forgot-link"
                    type="button"
                    onClick={() => setStage("forgot")}
                  >
                    Forgot password?
                  </button>
                  {resetMessage && (
                    <small className="auth-success">{resetMessage}</small>
                  )}
                </>
              )}
              <button className="button button-dark button-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : (mode === "login" ? "Log in ->" : "Sign up")}
              </button>
            </form>
            <p className="auth-switch">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function PasswordField({ label, name, placeholder, visible, onToggle, value, onChange }) {
  return (
    <label className="field-label password-field">
      {label}
      <span className="password-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          required
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ width: '100%', paddingRight: '40px' }}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          title={visible ? "Hide password" : "Show password"}
          style={{
            position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex'
          }}
        >
          {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}

function ForgotPasswordPanel({ onBack, onProceed }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSend = async (e) => {
        e.preventDefault();
        if(!email) return setError("Enter your email.");
        try {
            setLoading(true);
            await apiFetch("/auth/otp/send", { method: "POST", body: JSON.stringify({ email, type: "RESET_PASSWORD" }) });
            onProceed(email);
        } catch(err) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="verification-panel">
            <h1>Reset Password</h1>
            <p className="muted">Enter your email address to receive an OTP.</p>
            <form onSubmit={handleSend} className="auth-form">
                <label className="field-label">Email
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
                </label>
                {error && <small style={{color:'red'}}>{error}</small>}
                <button type="submit" className="button button-dark button-full" disabled={loading} style={{marginTop:'15px'}}>{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
            <button className="back-button" onClick={onBack} style={{marginTop:'20px'}}>Back to login</button>
        </div>
    );
}

function ResetPasswordPanel({ onBack, userEmail, onSuccess }) {
    const [code, setCode] = useState(Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;

    const handleReset = async (e) => {
        e.preventDefault();
        const otpCode = code.join("");
        if (otpCode.length < 6) return setError("Please enter all 6 digits.");
        if (!passwordPattern.test(password)) return setError("Use 8-20 characters with at least one uppercase letter, one number, and one special symbol.");
        try {
            setLoading(true);
            await apiFetch("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ email: userEmail, otp: otpCode, newPassword: password })
            });
            alert("Password reset successfully! Please log in.");
            onSuccess();
        } catch(err) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-panel">
            <h1>Create New Password</h1>
            <p className="muted">Enter the 6-digit OTP sent to <strong>{userEmail}</strong> and your new password.</p>
            <form onSubmit={handleReset} className="auth-form">
                <OTPInput code={code} setCode={setCode} />
                <PasswordField label="New Password" placeholder="8-20 characters" name="newPassword" visible={showPassword} onToggle={() => setShowPassword(!showPassword)} value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <small style={{color:'red', display:'block', marginTop:'10px'}}>{error}</small>}
                <button type="submit" className="button button-dark button-full" disabled={loading} style={{marginTop:'15px'}}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
            <button className="back-button" onClick={onBack} style={{marginTop:'20px'}}>Back to login</button>
        </div>
    );
}

function VerificationPanel({ onBack, userEmail, userName }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    const otpCode = code.join("");
    if (otpCode.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    try {
      await apiFetch("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email: userEmail, otp: otpCode })
      });
      setMessage("Email verified successfully. You can now log in.");
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await apiFetch("/auth/otp/send", { method: "POST", body: JSON.stringify({ email: userEmail, type: "VERIFICATION" }) });
      setMessage("A new verification code was sent.");
      setError("");
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  return (
    <div className="verification-panel">
      <p className="eyebrow">Verify your email</p>
      <h1>One last step.</h1>
      <p className="muted">
        We've sent a code to your email: <strong>{userEmail}</strong>
      </p>
      <OTPInput code={code} setCode={setCode} />
      {error && <small className="auth-error verification-message" style={{color: 'red'}}>{error}</small>}
      {message && <small className="auth-success verification-message">{message}</small>}
      <button
        className="button button-dark button-full"
        onClick={handleVerify}
      >
        Verify &amp; continue
      </button>
      <p className="verification-help">
        Didn't receive the code?{" "}
        <button type="button" onClick={handleResend}>
          Resend code
        </button>
      </p>
      
      <button className="back-button" onClick={onBack}>
        Back to sign up
      </button>
    </div>
  );
}



function OTPInput({ code, setCode }) {
  const otpRefs = useRef([]);
  return (
    <OTPInput code={code} setCode={setCode} />
  );
}

