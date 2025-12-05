import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('student')
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/register',{ name,email,password,role })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      nav(res.data.user.role === 'student' ? '/student' : '/teacher')
    }catch(err){ alert(err.response?.data?.message || 'Error') }
  }
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="w-full p-2 border rounded" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button className="w-full py-2 bg-indigo-600 text-white rounded">Register</button>
        </form>
        <div className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></div>
      </div>
    </div>
  )
}
