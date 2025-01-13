import '../db/dbconfig'
import { Route, Routes } from 'react-router-dom';
import './App.css'
import RegisterPage from './pages/register';
import Login from './pages/login';
import UsersDashboard from './pages/dashboard';
import { HelmetProvider } from 'react-helmet-async';

function App() {

  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path='/' element={<RegisterPage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/dashboard' element={<UsersDashboard/>}></Route>
        </Routes>
      </HelmetProvider>
    </>
  )
}

export default App
