import { Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import Layout from './pages/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/dashboard' element={<PrivateRoute />} >
          <Route index element={<Dashboard />} />
        </Route>
        <Route path='/profile' element={<PrivateRoute />} >
          <Route index element={<h1>Profile</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
