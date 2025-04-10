import React, { useState } from 'react'
import { backendurl } from '../Apipath';

const Register = () => {

  const [credentials, setCredentials] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value, updatedCredentials) => {
    let error = "";

    if (!value.trim()) {
      error = `${name} is required.`;
      error = 'lastName is required';
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

    Object.keys(credentials).forEach(key => validate(key, credentials[key], credentials));
    if (Object.values(errors).some(e => e)) return;


    const response = await fetch(`${backendurl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    const json = await response.json();
    if (!json.success){
      console.log(json.errors)
      alert("Enter valid credentials");
    } 
    else alert("Registered successfully!");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} >
      <h1 style={{ textAlign: "center", marginTop: "10px", marginBottom: "40px", textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)" }}>Registration</h1>

      <form onSubmit={handleSubmit} style={{ alignContent: "center", border: "3px solid black", width: "50%", maxWidth: "600px", borderRadius: "10px", backgroundColor: "#f8f9fa", padding: "10px", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)" }}>
        <div class="row">
          <div class="col">
            <label htmlFor="exampleFirstName" style={{ fontWeight: "bold" }}>First Name</label>
            <input type="text" class="form-control" name='firstName' value={credentials.firstName} placeholder="First name" onChange={onchange} aria-label="First name" />
            {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
          </div>
          <div class="col">
            <label htmlFor="exampleLastName" style={{ fontWeight: "bold" }}>Last Name</label>
            <input type="text" class="form-control" name='lastName' value={credentials.lastName} placeholder="Last name" onChange={onchange} aria-label="Last name" />
            {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
          </div>
        </div>
        <div class="mb-2">
          <label htmlFor="exampleInputEmail1" class="form-label" style={{ fontWeight: "bold" }} >Email Address</label>
          <input type="email" class="form-control" name='email' value={credentials.email} id="exampleInputEmail1" onChange={onchange} aria-describedby="emailHelp" placeholder="Enter your email" />
          {errors.email && <div className="text-danger">{errors.email}</div>}
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-2">
          <label htmlFor="phoneNumber" class="form-label" style={{ fontWeight: "bold" }} >Phone Number</label>
          <input type="number" class="form-control" name='phoneNumber' id="phoneNumber" value={credentials.phoneNumber} aria-describedby="number" onChange={onchange} placeholder="Enter your moblie number" />
          {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
        </div>
        <div class="mb-2">
          <label htmlFor="exampleInputPassword1" class="form-label" style={{ fontWeight: "bold" }} >Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onchange} placeholder="Enter password" />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>
        <div id="passwordHelpBlock" class="form-text">
          Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </div>
        <div class="mb-2">
          <label htmlFor="confirmPassword" class="form-label" style={{ fontWeight: "bold" }} >Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword" name='confirmPassword' value={credentials.confirmPassword} onChange={onchange} placeholder="Renter same password" />
          {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
        <a className='m-3 btn btn-danger' href='./Login' style={{ marginLeft: "300px" }}>click here to login</a>
      </form>
    </div>
  )
}
export default Register
