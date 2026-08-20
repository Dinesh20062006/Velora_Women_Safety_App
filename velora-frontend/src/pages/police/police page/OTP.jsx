import { useRef, useState } from "react";
import otpImage from "/src/assets/image/otp-banner.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { policeVerifyOtp } from "../../../api/policeApi";
import { resendOtp, resetPassword } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";

function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { identifier, phone, purpose, email, otp: stateOtp } = location.state || {};
  const targetId = identifier || phone;

  const [currentOtp, setCurrentOtp] = useState(stateOtp || "123456");

  const inputsRef = useRef([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!targetId) {
    return (
      <div className="otp" style={{ backgroundImage: "#0b0f19" }}>
        <div className="otp-container">
          <h1>OTP Verification</h1>
          <p>We couldn't find a pending verification request.</p>
          <button className="verify-btn" onClick={() => navigate("/police/register")}>
            Back to Registration
          </button>
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

  const verifyOTP = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      alert("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      if (purpose === "SIGNUP" || purpose === "POLICE_REGISTER") {
        await policeVerifyOtp({ mobileNumber: targetId, otp: code });
        const authData = location.state?.authResponse;
        if (authData) {
          login(authData);
        }
        alert("OTP Verified Successfully");
        navigate("/police/dashboard");
      } else if (purpose === "FORGOT_PASSWORD") {
        if (!newPassword || !confirmPassword) {
          alert("Please enter and confirm your new password");
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        await resetPassword({ email: email || targetId, otp: code, newPassword });
        alert("Password reset successful. Please log in with your new password.");
        navigate("/login");
      } else {
        await policeVerifyOtp({ mobileNumber: targetId, otp: code });
        navigate("/police/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const res = await resendOtp(targetId);
      const newCode = res.data?.otp || String(Math.floor(100000 + Math.random() * 900000));
      setCurrentOtp(newCode);
      alert(`Your new OTP verification code is: ${newCode}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="otp" style={{ position: "relative" }}>

      <div className="otp-container">

        <img src={otpImage} alt="OTP Verification" className="otp-image" />
        <h1>OTP Verification</h1>

        <p className="otp-text">Enter the 6-digit verification code sent to {targetId}.</p>

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
            <input
              type="password"
              placeholder="New Password"
              className="mobile-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="mobile-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        <button className="verify-btn" onClick={verifyOTP} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <div className="resend">
          Didn't receive the code?
          <Link onClick={resend}>Resend OTP</Link>
        </div>

      </div>
    </div>
  );
}

export default OTP;
