import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Discuss from './pages/Discuss';
import Resource from './pages/Resource';
import Admin from './pages/Admin';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Certificate from './pages/Certificate';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/learning" 
              element={
                <PrivateRoute>
                  <Learning />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <PrivateRoute>
                  <Quizzes />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/discuss" 
              element={
                <PrivateRoute>
                  <Discuss />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/resource" 
              element={
                <PrivateRoute>
                  <Resource />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/account" 
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/certificate" 
              element={
                <PrivateRoute>
                  <Certificate />
                </PrivateRoute>
              } 
            />
          </Routes>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
