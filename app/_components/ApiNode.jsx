"use client"
import { Handle, Position } from '@xyflow/react';

export default function ApiNode({ id, data }) {
  const handleChange = (field, value) => {
    if (data.onNodeDataChange) data.onNodeDataChange(id, { ...data, [field]: value });
  };

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all duration-300 min-w-[350px] bg-zinc-950 shadow-2xl ${
      data.status === 'success' ? 'border-green-500/50' : data.status === 'error' ? 'border-red-500/50' : 'border-white/10'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">ID: {id}</span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            data.status === 'success' ? 'bg-green-500' : data.status === 'loading' ? 'bg-yellow-500' : 'bg-zinc-700'
          }`} />
        </div>

        {/* Inputs */}
        <div className="flex gap-2">
           <select value={data.method} onChange={(e) => handleChange('method', e.target.value)} className="bg-zinc-900 text-[10px] font-black text-purple-400 uppercase rounded px-2 outline-none border border-white/5">
            {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={data.url} onChange={(e) => handleChange('url', e.target.value)} placeholder="Enter Global URL..." className="flex-1 bg-black text-[10px] font-mono text-zinc-300 p-2 rounded border border-white/5 outline-none focus:border-purple-500/50" />
        </div>

        {/* Results Area */}
        {data.response && (
          <div className="mt-4 space-y-1">
            <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Server Response</label>
            <div className="max-h-40 overflow-y-auto bg-black/60 rounded-lg p-3 border border-white/5">
              <pre className="text-[10px] font-mono text-green-400 leading-tight">
                {JSON.stringify(data.response, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        {data.status === 'error' && (
          <div className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">
            ⚠ Request Failed. Check Console or URL.
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
}