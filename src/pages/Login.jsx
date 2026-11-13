import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { motion } from "framer-motion";
import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await loginUser({email, password});
      navigate("/");
    } catch (error) {
      setError(error.message);
    }finally {
      setIsSubmitting(false);
    }
  }
  return (
    <motion.div className="login-page auth-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}>
      
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Good to have you back. Sign in to continue enjoying your BiteBox favourites</p>
        </div>

        <div className="form-field">
          <input type="email" id="login email" placeholder=" " value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required/>
          <label htmlFor="login-email">Email Address</label>
        </div>

        <div className="form-field">
          <input type="password" id="login-password" placeholder=" " value={password}
            onChange={(event) => setPassword(event.target.value)} autoComplete="current-password"
            required />
          <label htmlFor="login-password">Password</label>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account yet? 
          <Link to="/register">Sign Up</Link>
        </p>

      </form>

    </motion.div>
  )
}

export default Login;
