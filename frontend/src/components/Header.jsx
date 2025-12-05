import React from 'react'
export default function Header({ user }){
  return (
    <header className="bg-slate-800 text-white p-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold">Assignment Portal</div>
        <div className="flex items-center gap-4">
          <div className="text-sm">{user?.name}</div>
          <button className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location = '/login' }}>Logout</button>
        </div>
      </div>
    </header>
  )
}
