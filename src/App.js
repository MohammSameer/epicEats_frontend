import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import { CartProvider } from './components/ContextReducer'
import Myorder from './pages/Myorder'
 


const App = () => {
  return (
    <CartProvider CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Myorder' element={<Myorder />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
