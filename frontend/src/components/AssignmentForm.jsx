import React, { useState } from 'react'
import api from '../api/axios'
export default function AssignmentForm({ onCreated }){
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [dueDate,setDueDate]=useState('')
  const submit = async e => {
    e.preventDefault()
    try{
      await api.post('/assignments', { title, description, dueDate })
      setTitle(''); setDescription(''); setDueDate('')
      onCreated && onCreated()
    }catch(err){ alert(err.response?.data?.message || 'Error') }
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <div className="grid grid-cols-1 gap-3">
        <input className="p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="p-2 border rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="p-2 border rounded" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <div className="text-right"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button></div>
      </div>
    </form>
  )
}
