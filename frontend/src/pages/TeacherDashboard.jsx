import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import AssignmentForm from '../components/AssignmentForm'
export default function TeacherDashboard(){
  const [assignments,setAssignments] = useState([])
  const [selected, setSelected] = useState(null)
  const [subs, setSubs] = useState([])
  const [gradeTarget, setGradeTarget] = useState(null)

  useEffect(()=>{
    api.get('/assignments').then(r=>setAssignments(r.data)).catch(()=>{})
  },[])

  const loadSubs = (assignmentId)=>{
    api.get(`/submissions/assignment/${assignmentId}`).then(r=>setSubs(r.data)).catch(()=>{})
    setSelected(assignmentId)
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Teacher Dashboard</h2>
      <AssignmentForm onCreated={() => api.get('/assignments').then(r=>setAssignments(r.data))} />

      <h3 className="mt-4 text-lg">Your Assignments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{a.title}</h4>
                <div className="text-sm text-gray-500">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>loadSubs(a._id)}>View submissions</button>
                <a className="px-3 py-1 bg-gray-200 rounded text-sm" href={`http://localhost:5000/api/submissions/archive/${a._id}`}>Download all</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-6">Submissions</h3>
      <div className="space-y-3 mt-3">
        {subs.map(s=> (
          <div key={s._id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <strong>{s.originalName}</strong>
                <div className="text-sm text-gray-500">Student: {s.student?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <a className="text-blue-600" href={`http://localhost:5000/api/submissions/file/${s.fileId}`} target="_blank" rel="noreferrer">Preview</a>
                <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=> setGradeTarget(s)}>Grade</button>
              </div>
            </div>
            {gradeTarget && gradeTarget._id === s._id && <div className="mt-2"><div className="p-3 bg-gray-50 rounded">Open the Grade modal</div></div>}
          </div>
        ))}
      </div>
    </Layout>
  )
}
