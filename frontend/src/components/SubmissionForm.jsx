import React, { useState, useEffect } from 'react'
import api from '../api/axios'
export default function SubmissionForm({ assignmentId, dueDate, onSubmitted }){
  const [file,setFile] = useState(null)
  const [disabled, setDisabled] = useState(false)
  useEffect(()=>{
    if(!dueDate) return
    const now = new Date()
    const dd = new Date(dueDate)
    setDisabled(now > dd)
  },[dueDate])
  const submit = async e => {
    e.preventDefault()
    if(disabled) return alert('This assignment is closed')
    if(!file) return alert('Choose file')
    const fd = new FormData(); fd.append('file', file)
    try{ await api.post(`/submissions/${assignmentId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Submitted'); onSubmitted && onSubmitted()
    }catch(err){ alert(err.response?.data?.message || 'Error') }
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-3">
      <input type="file" onChange={e=>setFile(e.target.files[0])} className="text-sm" />
      <button className={`px-3 py-1 rounded ${disabled ? 'bg-gray-300' : 'bg-green-600 text-white'}`} disabled={disabled} type="submit">Submit</button>
      {disabled && <span className="text-red-500 text-sm">Deadline passed</span>}
    </form>
  )
}
