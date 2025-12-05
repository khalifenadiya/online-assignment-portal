import React, { useEffect, useState } from 'react'
import api from '../api/axios'
export default function FilePreview({ fileId }){
  const [html, setHtml] = useState(null);
  useEffect(()=>{
    api.get(`/submissions/file/${fileId}`, { responseType: 'arraybuffer' })
      .then(res=>{
        const ct = res.headers['content-type']
        if (ct && ct.includes('pdf')){
          const blob = new Blob([res.data], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          setHtml(<iframe src={url} style={{width:'100%',height:400}} />)
        } else if (ct && ct.includes('text/html')){
          const decoder = new TextDecoder()
          const text = decoder.decode(res.data)
          setHtml(<div dangerouslySetInnerHTML={{__html: text}} />)
        } else {
          const blob = new Blob([res.data])
          const url = URL.createObjectURL(blob)
          setHtml(<a className="text-blue-600" href={url} download>Download file</a>)
        }
      }).catch(err=>{
        api.get(`/submissions/file/${fileId}`).then(r=> setHtml(<div dangerouslySetInnerHTML={{__html: r.data}} />)).catch(()=>{})
      })
  },[fileId])
  return (<div>{html || <em>Preview unavailable</em>}</div>)
}
