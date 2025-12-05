import React from 'react'
import Header from './Header'
export default function Layout({ children }){
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}
