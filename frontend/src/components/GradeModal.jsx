import React, { useState } from 'react'
import api from '../api/axios'
export default function GradeModal({ submission, onSaved, onClose }){
  const [grade,setGrade] = useState(submission.grade||'')
  const [feedback,setFeedback] = useState(submission.feedback||'')
  const save = async ()=>{
    await api.put(`/submissions/grade/${submission._id}`, { grade, feedback })
    onSaved && onSaved()
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow w-96">
        <h4 className="font-semibold">Grade: {submission.originalName}</h4>
        <input value={grade} onChange={e=>setGrade(e.target.value)} className="w-full p-2 border rounded mt-2" placeholder="Grade" />
        <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} className="w-full p-2 border rounded mt-2" placeholder="Feedback" />
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}
