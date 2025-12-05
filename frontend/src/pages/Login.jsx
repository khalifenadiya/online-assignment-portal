import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/login',{ email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.user.role === 'student') nav('/student')
      else nav('/teacher')
    }catch(err){ alert(err.response?.data?.message || 'Error') }
  }
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full py-2 bg-indigo-600 text-white rounded">Login</button>
        </form>
        <div className="mt-3 text-sm">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></div>
      </div>
    </div>
  )
}
