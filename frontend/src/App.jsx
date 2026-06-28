import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './auth/Signup'
import Signin from './auth/Signin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App