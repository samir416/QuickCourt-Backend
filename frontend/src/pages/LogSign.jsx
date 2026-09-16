import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LogSign() {
  const [mode, setMode] = useState("signup");
  const [stage, setStage] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [imageError, setImageError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;

    setEmailError("");
    setPasswordError("");

    if (mode === "login") {
      navigate("/");
      return;
    }
    if (imageError) return;
    if (email === "user@example.com") {
      setEmailError("This email already exists.");
      return;
    }
    if (!passwordPattern.test(password) || password !== confirmPassword) {
      setPasswordError(
        "Use 8–20 characters with at least one uppercase letter, one number, and one special symbol like @ or #.",
      );
      return;
    }
    setStage("verify");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStage("form");
    setPasswordError("");
    setEmailError("");
    setImageError("");
    setResetMessage("");
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setImageError(
      image && image.size > 1024 * 1024
        ? "Oops! The image is too large. Please upload an image smaller than 1 MB."
        : "",
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-art">
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=90"
          alt="Football players on a green sports field"
        />
        <div className="auth-art-overlay" />
        <span className="auth-art-caption">QUICKCOURT / MEMBER ACCESS</span>
      </section>
      <section className="auth-panel">
        <Link className="auth-brand" to="/">
          quickcourt
        </Link>
        {stage === "verify" ? (
          <VerificationPanel onBack={() => setStage("form")} />
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
                    <select defaultValue="Player">
                      <option>Player</option>
                      <option>Facility Owner</option>
                    </select>
                  </label>
                  <label className="field-label">
                    Full name
                    <input required placeholder="Your name" />
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
                    onClick={() =>
                      setResetMessage(
                        "A password reset link was sent to your email.",
                      )
                    }
                  >
                    Forgot password?
                  </button>
                  {resetMessage && (
                    <small className="auth-success">{resetMessage}</small>
                  )}
                </>
              )}
              <button className="button button-dark button-full" type="submit">
                {mode === "login" ? "Log in ->" : "Sign up"}
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

function PasswordField({ label, name, placeholder, visible, onToggle }) {
  return (
    <label className="field-label password-field">
      {label}
      <span className="password-input-wrap">
        <input
          required
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? "◉" : "◌"}
        </button>
      </span>
    </label>
  );
}

function VerificationPanel({ onBack }) {
  const [message, setMessage] = useState("");

  return (
    <div className="verification-panel">
      <p className="verification-icon" aria-hidden="true">
        ▣
      </p>
      <p className="eyebrow">Verify your email</p>
      <h1>One last step.</h1>
      <p className="muted">
        We've sent a code to your email: <strong>user@example.com</strong>
      </p>
      <div className="code-inputs">
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            maxLength="1"
            inputMode="numeric"
            aria-label={`Verification digit ${index + 1}`}
          />
        ))}
      </div>
      <button
        className="button button-dark button-full"
        onClick={() => setMessage("Email verified successfully.")}
      >
        Verify &amp; continue
      </button>
      <p className="verification-help">
        Didn't receive the code?{" "}
        <button onClick={() => setMessage("A new verification code was sent.")}>
          Resend code
        </button>
      </p>
      {message && (
        <small className="auth-success verification-message">{message}</small>
      )}
      <button className="back-button" onClick={onBack}>
        Back to sign up
      </button>
    </div>
  );
}
