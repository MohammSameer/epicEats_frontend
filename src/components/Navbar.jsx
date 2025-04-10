import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Button} from 'react-bootstrap'
import Badge  from 'react-bootstrap/Badge'
import Modal from '../Modal'
import Cart from '../pages/Cart'
import { useCart } from './ContextReducer'
const Navbar = () => {
  const [cartView, setCartView] = useState(false)
  let data = useCart()
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link style={{ color: "yellow", fontWeight: "bold" }} className="navbar-brand fs-1 fst-italic" to="/">EpicEats</Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li>
                <Link to="/" style={{ color: "white" }} className="nav-link active fs-5" aria-current="page">Home</Link>
              </li>

              {(localStorage.getItem("authToken")) ?
                <li>
                  <Link to="/Myorder" className="nav-link active fs-5" style={{ color: "white" }} aria-current="page">My Orders</Link>
                </li>
                : ""
              }

            </ul>

            {(!localStorage.getItem("authToken")) ?
              <div className='d-flex'>
                <Link to="/Login">
                  <Button className='mx-2' variant='success'>Login</Button>
                </Link>
                <Link to="/Register">
                  <Button className='mx-2' variant='success'>Register</Button>
                </Link>
              </div>
              :
              <div>
                <div className='btn text-white  bg-warning mx-2' style={{ fontWeight: "bold" }} onClick={() => { setCartView(true) }}>
                  My Cart {" "}
                  <Badge pill bg='danger'>{data.length}</Badge>
                </div>
                {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : null}
                <div className='btn text-white  bg-danger mx-2' style={{ fontWeight: "bold" }} onClick={handleLogout}>
                  Logout
                </div>
              </div>
            }

          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
