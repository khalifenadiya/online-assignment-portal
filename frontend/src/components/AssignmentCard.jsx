import React from 'react'
export default function AssignmentCard({ a, onView }){
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{a.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{a.description}</p>
        </div>
        <div className="text-right text-sm text-gray-500">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500" onClick={() => onView(a._id)}>View</button>
      </div>
    </div>
  )
}
