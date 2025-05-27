import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import AttendanceReport from './pages/AttendanceReport';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import ManageUsers from './pages/admin/ManageUsers';
import AttendanceReview from './pages/admin/AttendanceReview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected User Routes */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/attendance-report" element={<AttendanceReport />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/attendance" element={<AttendanceReview />} />
          </Route>
          
          {/* Redirect based on role */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                replace 
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate 
                to={localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                replace 
              />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;