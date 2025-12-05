import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

const Private = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/login" />;
  return children;
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={<Private role="student"><StudentDashboard /></Private>} />
      <Route path="/teacher" element={<Private role="teacher"><TeacherDashboard /></Private>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}
