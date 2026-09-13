import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backendurl } from '../Apipath';

const Register = () => {

  const [credentials, setCredentials] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (errorResponse) => {
    if (Array.isArray(errorResponse)) {
      return errorResponse.map((error) => error.msg || error.message || String(error)).join(' ');
    }
    return errorResponse || "We couldn't create your account. Please check your details.";
  };

  const validate = (name, value, updatedCredentials) => {
    let error = "";

    if (!value.trim()) {
      error = `${name} is required.`;
    } else {
      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        error = "Invalid email format.";
      }
      if (name === "phoneNumber" && !/^\d{10}$/.test(value)) {
        error = "Phone number must be 10 digits.";
      }
      if (name === "password" && (value.length < 8 || !/[a-zA-Z]/.test(value) || !/\d/.test(value))) {
        error = "Password must be 8+ chars, include letters & numbers.";
      }
      if (name === "confirmPassword" && value !== updatedCredentials.password) {
        error = "Passwords do not match.";
      }
    }
    return error;
  };

  const onchange = (e) => {
    const { name, value } = e.target;
    const updatedCredentials = { ...credentials, [name]: value };
    setCredentials(updatedCredentials);

    const error = validate(name, value, updatedCredentials);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = Object.keys(credentials).reduce((result, key) => ({ ...result, [key]: validate(key, credentials[key], credentials) }), {});
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${backendurl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();
      if (!json.success) setErrors({ form: getErrorMessage(json.errors || json.message) });
      else navigate('/Login');
    } catch (err) {
      setErrors({ form: "We couldn't reach the kitchen right now. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page"><section className="auth-panel auth-panel-register">
      <div className="auth-aside"><span className="eyebrow">Join the table</span><h1>Your next favourite meal is waiting.</h1><p>Create an account for faster checkout, easy reorders, and a little more deliciousness.</p><span className="auth-aside-mark">✦</span></div>
      <form className="auth-form" onSubmit={handleSubmit}><div className="form-heading"><span className="form-icon">+</span><h2>Create account</h2><p>It only takes a minute.</p></div>
        <div className="form-grid"><div className="field-group"><label htmlFor="firstName">First name</label><input type="text" id="firstName" name="firstName" value={credentials.firstName} placeholder="Alex" onChange={onchange} required />{errors.firstName && <small className="field-error">{errors.firstName}</small>}</div><div className="field-group"><label htmlFor="lastName">Last name</label><input type="text" id="lastName" name="lastName" value={credentials.lastName} placeholder="Morgan" onChange={onchange} required />{errors.lastName && <small className="field-error">{errors.lastName}</small>}</div></div>
        <div className="field-group"><label htmlFor="register-email">Email address</label><input type="email" id="register-email" name="email" value={credentials.email} onChange={onchange} placeholder="you@example.com" required />{errors.email && <small className="field-error">{errors.email}</small>}</div>
        <div className="field-group"><label htmlFor="phoneNumber">Phone number</label><input type="tel" id="phoneNumber" name="phoneNumber" value={credentials.phoneNumber} onChange={onchange} placeholder="10 digit number" required />{errors.phoneNumber && <small className="field-error">{errors.phoneNumber}</small>}</div>
        <div className="form-grid"><div className="field-group"><label htmlFor="register-password">Password</label><input type="password" id="register-password" name="password" value={credentials.password} onChange={onchange} placeholder="8+ characters" required />{errors.password && <small className="field-error">{errors.password}</small>}</div><div className="field-group"><label htmlFor="confirmPassword">Confirm password</label><input type="password" id="confirmPassword" name="confirmPassword" value={credentials.confirmPassword} onChange={onchange} placeholder="Repeat password" required />{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</div></div>
        {errors.form && <p className="form-error" role="alert">{errors.form}</p>}<button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}<span>→</span></button><p className="auth-switch">Already have an account? <Link to="/Login">Sign in</Link></p>
      </form></section></main>
  )
}
export default Register
