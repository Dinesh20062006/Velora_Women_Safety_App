import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import otpImage from "../../../../assets/images/otp-banner.png";
import Button from "../../../../common/Button/Button";
import Input from "../../../../common/Input/Input";
import { verifyOtp, resendOtp, resetPassword } from "../../../../api/authApi";
import { useAuth } from "../../../../context/AuthContext";

function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Signup passes { identifier: phone, purpose: "SIGNUP", otp: "..." }
  // ForgotPassword passes { identifier: phone, purpose: "FORGOT_PASSWORD", otp: "..." }
  const { identifier, purpose, otp: stateOtp } = location.state || {};

  const [currentOtp, setCurrentOtp] = useState(stateOtp || "123456");

  const inputsRef = useRef([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!identifier || !purpose) {
    return (
      <div className="otp">
        <div className="otp-container">
          <h1>OTP Verification</h1>
          <p>We couldn't find a pending verification request.</p>
          <Button text="Back to Sign Up" onClick={() => navigate("/signup")} />
        </div>
      </div>
    );
  }

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    setError("");
    setInfo("");
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      if (purpose === "SIGNUP") {
        await verifyOtp({ mobileNumber: identifier, otp: code });
        const authData = location.state?.authResponse;
        if (authData) {
          login(authData);
        }
        navigate("/emergency-contact-setup");
      } else if (purpose === "FORGOT_PASSWORD") {
        if (!newPassword || !confirmPassword) {
          setError("Please enter and confirm your new password");
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await resetPassword({ email: location.state?.email || identifier, otp: code, newPassword });
        setInfo("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        await verifyOtp({ mobileNumber: identifier, otp: code });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const res = await resendOtp(identifier);
      const newCode = res.data?.otp || String(Math.floor(100000 + Math.random() * 900000));
      setCurrentOtp(newCode);
      alert(`Your new OTP verification code is: ${newCode}`);
      setInfo(`New OTP code sent.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="otp" style={{ position: "relative" }}>
      <div className="otp-container">
        <img src={otpImage} alt="OTP Verification" className="otp-image" />
        <h1>OTP Verification</h1>
        <p>Enter the 6-digit verification code sent to {identifier}.</p>

        {error && <p className="error-text" style={{ color: "red", margin: "8px 0" }}>{error}</p>}
        {info && <p className="info-text" style={{ color: "#38bdf8", margin: "8px 0" }}>{info}</p>}

        <div className="otp-inputs">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength="1"
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
            />
          ))}
        </div>

        {purpose === "FORGOT_PASSWORD" && (
          <>
            <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </>
        )}

        <Button text={loading ? "Verifying..." : "Verify OTP"} onClick={handleVerify} disabled={loading} />

        <div className="resend">
          Didn't receive the code?
          <Link to="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>Resend OTP</Link>
        </div>
        <div className="resend">
          Back to Sign Up?
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
export default OTP;
