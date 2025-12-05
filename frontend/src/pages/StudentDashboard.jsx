import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import AssignmentCard from '../components/AssignmentCard'
import SubmissionForm from '../components/SubmissionForm'
import FilePreview from '../components/FilePreview'

export default function StudentDashboard(){
  const [assignments,setAssignments] = useState([])
  const [mySubs,setMySubs] = useState([])
  useEffect(()=>{
    api.get('/assignments').then(r=>setAssignments(r.data)).catch(()=>{})
    api.get('/submissions/my').then(r=>setMySubs(r.data)).catch(()=>{})
  },[])
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map(a=> (
          <div key={a._id} className="space-y-2">
            <AssignmentCard a={a} onView={()=>{}} />
            <SubmissionForm assignmentId={a._id} dueDate={a.dueDate} onSubmitted={()=> api.get('/submissions/my').then(r=>setMySubs(r.data))} />
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-lg font-semibold">My Submissions</h3>
      <div className="space-y-3 mt-3">
        {mySubs.map(s=> (
          <div key={s._id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div><strong>{s.originalName}</strong><div className="text-sm text-gray-500">Assignment: {s.assignment?.title || '—'}</div></div>
              <div className="text-sm">{s.grade ? <span className="text-green-600">Grade: {s.grade}</span> : <em>Not graded</em>}</div>
            </div>
            <div className="mt-2"><FilePreview fileId={s.fileId} /></div>
            {s.feedback && <div className="mt-2 p-2 bg-gray-50 rounded">Feedback: {s.feedback}</div>}
          </div>
        ))}
      </div>
    </Layout>
  )
}
