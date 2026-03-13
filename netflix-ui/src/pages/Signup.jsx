
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../utils/api";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { firebaseAuth } from "../utils/firebase-config"; 
import Footer from "../components/Footer";
import ReasonsToJoin from "../components/ReasonsToJoin";


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = useCallback(async () => {
    const { email, password } = formValues;
    if (!email || !password) return;
    setLoading(true);
    setOtpError("");
    try {
      await api.post("/user/send-otp", { email });
      setShowOtpModal(true);
      setCountdown(60);
      setOtpValues(["", "", "", "", "", ""]);
    } catch (error) {
      setOtpError(error.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }, [formValues]);

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtpError("");
    setLoading(true);
    try {
      await api.post("/user/send-otp", {
        email: formValues.email,
      });
      setCountdown(60);
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setOtpError(error.response?.data?.msg || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    setOtpError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtpValues(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      await api.post("/user/verify-otp", {
        email: formValues.email,
        otp,
      });
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await api.post("/user/signup", { email });
    } catch (error) {
      setOtpError(error.response?.data?.msg || "Verification failed.");
    } finally {
      setLoading(false);
    }
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
        <div className="sign-in-box">
        <h1>Sign Up</h1>
        <p className="tagline">Unlimited movies, TV shows and more.</p>
        <div className="form-fields">
          <input
          type="email"
          placeholder="Email address"
          onChange={(e) =>
            setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
            })
          }
          name="email"
          value={formValues.email}
          />
          {showPassword && (
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value,
            })
            }
            name="password"
            value={formValues.password}
          />
          )}
        </div>
        {!showPassword ? (
          <button
          className="submit-btn"
          onClick={() => setShowPassword(true)}
          >
          Get Started
          </button>
        ) : (
          <button
          className="submit-btn"
          onClick={handleSendOtp}
          disabled={loading}
          >
          {loading ? "Sending..." : "Sign Up"}
          </button>
        )}
        {/* Login link footer */}
        <div className="mt-6 text-center">
          <span className="text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            className="text-[#E50914] hover:underline font-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
          </span>
        </div>
        
        </div>
      </div>
      </div>
      <ReasonsToJoin />
      <Footer />

      {showOtpModal && (
      <Overlay>
        <OtpModal>
        <button
          className="close-btn"
          onClick={() => setShowOtpModal(false)}
        >
          &times;
        </button>
        <h2>Verify Your Email</h2>
        <p>
          We sent a 6-digit code to <strong>{formValues.email}</strong>
        </p>
        <div className="otp-inputs" onPaste={handleOtpPaste}>
          {otpValues.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            autoFocus={i === 0}
          />
          ))}
        </div>
        {otpError && <p className="error">{otpError}</p>}
        <button
          className="verify-btn"
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>
        <div className="resend">
          {countdown > 0 ? (
          <span>Resend code in {countdown}s</span>
          ) : (
          <button onClick={handleResendOtp} disabled={loading}>
            Resend OTP
          </button>
          )}
        </div>
        </OtpModal>
      </Overlay>
      )}
    </Container>
    );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const OtpModal = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2.5rem;
  width: 90%;
  max-width: 420px;
  text-align: center;
  position: relative;
  color: #fff;

  .close-btn {
    position: absolute;
    top: 0.75rem;
    right: 1rem;
    background: none;
    border: none;
    color: #757575;
    font-size: 1.5rem;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }

  h2 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    color: #b3b3b3;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;

    strong {
      color: #fff;
    }
  }

  .otp-inputs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;

    input {
      width: 3rem;
      height: 3.5rem;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      border: 2px solid #333;
      border-radius: 6px;
      background: #141414;
      color: #fff;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #e50914;
      }
    }
  }

  .error {
    color: #e50914;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .verify-btn {
    width: 100%;
    padding: 0.85rem;
    background: #e50914;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 1rem;

    &:hover:not(:disabled) {
      background: #f40612;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .resend {
    color: #757575;
    font-size: 0.85rem;

    button {
      background: none;
      border: none;
      color: #e50914;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: underline;

      &:disabled {
        color: #757575;
        cursor: not-allowed;
        text-decoration: none;
      }
    }
  }
`;

const Container = styled.div`
  position: relative;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.75) 100%
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

    .tagline {
      color: #b3b3b3;
      font-size: 1.05rem;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;

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

        &::placeholder {
          color: #8c8c8c;
        }

        &:focus {
          border-color: #e50914;
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.25), 0 0 20px rgba(229, 9, 20, 0.1);
          background: rgba(55, 55, 55, 0.7);
        }
      }
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

    .info-text {
      color: #8c8c8c;
      font-size: 0.85rem;
      text-align: center;
    }
  }

  @media (max-width: 500px) {
    .sign-in-box {
      padding: 2rem 1.5rem;
    }
  }
`;

export default Signup;