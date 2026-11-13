import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { motion } from "framer-motion";
import "./Auth.css";


function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({name, email, password});

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div className="register-page auth-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Join the BiteBox Family!</h2>
          <p>Create an account and make ordering your favourite meals easier.</p>
        </div>

        <div className="form-field">
          <input type="text" id="register-name" value={name} onChange={(event) =>
            setName(event.target.value)} autoComplete="name" placeholder=" " required />
          <label htmlFor="register-name">Full Name</label>
        </div>

        <div className="form-field">
          <input type="email" id="register-email" placeholder=" "value={email} onChange={(event) =>
            setEmail(event.target.value)} autoComplete="email" required />
          <label htmlFor="register-email">Email</label>
        </div>

        <div className="form-field">
          <input type="password" id="register-password" placeholder=" " value={password} onChange={(event) =>
            setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
          <label htmlFor="register-password">Password</label>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </p>

      </form>
    </motion.div>
  );
}

export default Register;
