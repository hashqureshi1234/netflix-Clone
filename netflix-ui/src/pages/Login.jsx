import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

/* ── Framer Motion Variants ─────────────────────────── */
const formVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const shakeVariants = {
  shake: {
    x: [0, -12, 12, -10, 10, -6, 6, 0],
    transition: { duration: 0.5 },
  },
};

const errorBannerVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: "auto", marginBottom: 16, transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2 } },
};

/* ── Floating‑label input ───────────────────────────── */
function FloatingInput({ id, label, type, value, onChange, onKeyDown, hasError, shakeKey }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <motion.div
      variants={childVariants}
      key={shakeKey}
      animate={hasError ? "shake" : undefined}
      {...(hasError ? { variants: { ...childVariants, ...shakeVariants } } : {})}
    >
      <InputWrapper
        className={`${active ? "active" : ""} ${hasError ? "has-error" : ""}`}
      >
        <motion.input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          autoComplete={type === "password" ? "current-password" : "email"}
        />
        <label htmlFor={id}>{label}</label>
        <span className="focus-border" />
      </InputWrapper>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────── */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();

  const triggerShake = () => setShakeKey((k) => k + 1);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      triggerShake();
      const code = err.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Incorrect email or password.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Container>
      <BackgroundImage />
      <div className="overlay">
        <Header login />
        <div className="form-container">
          <motion.div
            className="sign-in-box"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={childVariants}>Login</motion.h1>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="error-msg"
                  variants={errorBannerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="form-fields">
              <FloatingInput
                id="login-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                hasError={!!error}
                shakeKey={shakeKey}
              />
              <FloatingInput
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                hasError={!!error}
                shakeKey={shakeKey}
              />
            </div>

            <motion.button
              className="submit-btn"
              onClick={handleLogin}
              disabled={loading}
              variants={childVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            <motion.div className="bottom-text" variants={childVariants}>
              <p>
                New to Netflix?{" "}
                <Link to="/signup" className="signup-link">
                  Sign up now
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

/* ── Styled Components ──────────────────────────────── */

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    width: 100%;
    height: 3.5rem;
    padding: 1.25rem 1rem 0.5rem;
    font-size: 1rem;
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #fff;
    background: rgba(55, 55, 55, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    box-sizing: border-box;

    &:focus {
      border-color: #e50914;
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.25), 0 0 20px rgba(229, 9, 20, 0.1);
      background: rgba(55, 55, 55, 0.7);
    }
  }

  label {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: #8c8c8c;
    pointer-events: none;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  /* Floating state */
  &.active label,
  input:focus + label {
    top: 0.55rem;
    transform: translateY(0);
    font-size: 0.7rem;
    color: #e5e5e5;
    letter-spacing: 0.02em;
  }

  /* Error state */
  &.has-error input {
    border-color: #e87c03;
    box-shadow: 0 0 0 3px rgba(232, 124, 3, 0.2);
  }
  &.has-error label {
    color: #e87c03;
  }

  /* Animated bottom‑border accent */
  .focus-border {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #e50914, #ff6b08);
    border-radius: 0 0 6px 6px;
    transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  input:focus ~ .focus-border {
    width: 100%;
    left: 0;
  }
`;

const Container = styled.div`
  position: relative;
  font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0.78) 100%
    );
    display: flex;
    flex-direction: column;
  }

  .form-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .sign-in-box {
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 3.5rem 4rem 3rem;
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .error-msg {
      background: rgba(232, 124, 3, 0.15);
      border-left: 3px solid #e87c03;
      color: #e87c03;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      overflow: hidden;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .submit-btn {
      width: 100%;
      padding: 0.9rem;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.25s;
      margin-top: 0.75rem;
      font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
      letter-spacing: 0.01em;

      &:hover:not(:disabled) {
        background: #c11119;
      }

      &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
    }

    .bottom-text {
      text-align: center;
      margin-top: 1rem;

      p {
        color: #737373;
        font-size: 0.95rem;
      }

      .signup-link {
        color: #fff;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  @media (max-width: 500px) {
    .sign-in-box {
      padding: 2rem 1.5rem;
    }
  }
`;

export default Login;