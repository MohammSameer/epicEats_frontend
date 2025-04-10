import React, {useState}from 'react'
import { useEffect } from "react";
import {useNavigate} from 'react-router-dom'
 import { backendurl } from '../Apipath';

const Login = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#f0f0f0";
  });
  let navigate=useNavigate()
  const [credentials, setcredentials] = useState({ email: "", password: "" })

  const handleSumbit = async (e) => {
    e.preventDefault()
    const response = await fetch(`${backendurl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    })
    const json = await response.json()
    console.log(json)
    if (!json.success) {
      console.log(json.errors)
      alert("Enter valid credentials")
    }
    else{
    alert('successfully logged in...')
    localStorage.setItem("userEmail", credentials.email)
    localStorage.setItem("authToken",json.authToken)
    console.log(localStorage.getItem("authToken"))
      navigate("/")
    }
  }
  const onchange = (event) => {
    setcredentials({...credentials, [event.target.name]: event.target.value })
  }

  return (
    <>
      <h1 style={{ marginTop: "50px", marginLeft: "660px", width: "100%", textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)" }}>Sign In</h1>
      <div style={{ marginTop: "50px", marginLeft: "400px", height: "100px", width: "50%" }}>
        <form onSubmit={handleSumbit} style={{ padding: "10px", maxWidth: "700px", border: "3px solid black", borderRadius: "10px", backgroundColor: "#f8f9fa", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)" }}>
          <div className="mb-1">
            <label style={{ fontWeight: "bold" }} htmlFor="exampleInputEmail1" className="form-label" >Email Address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={credentials.email} onChange={onchange} placeholder="Enter your email" />
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-1">
            <label style={{ fontWeight: "bold" }} htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onchange} placeholder='Enter password' />
            <div id="passwordHelpBlock" className="form-text">
              Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          <label htmlFor="newUser" style={{ fontWeight: "bold", marginLeft: "300px" }} >If New User:</label>
          <a href='/Register' className='m-3 btn btn-danger' aria-current="page" style={{ marginLeft: "15px", textAlign: "right" }}>click here to register</a>
        </form>
      </div>

    </>
  )
}

export default Login
