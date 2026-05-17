"use client"





const RequestBar = ({ url, setUrl, method, setMethod, onRun, loading }) => (
  <div className="flex gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/10 shadow-2xl">
    <select 
      value={method} 
      onChange={(e) => setMethod(e.target.value)} 
      className="bg-transparent text-purple-400 font-bold px-4 outline-none border-r border-white/10"
    >
      {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} className="bg-zinc-900">{m}</option>)}
    </select>
    <input 
      placeholder="https://api.example.com/v1"
      className="flex-1 bg-transparent px-4 py-3 outline-none font-mono text-sm"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
    <button 
      onClick={onRun} 
      disabled={loading} 
      className="bg-purple-600 hover:bg-purple-500 px-10 rounded-xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send"}
    </button>
  </div>
);

export default RequestBar;