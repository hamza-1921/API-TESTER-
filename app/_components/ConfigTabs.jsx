"use client"

const ConfigTabs = ({ 
  activeTab, 
  setActiveTab, 
  headers, 
  setHeaders, 
  body, 
  setBody, 
  auth, 
  setAuth 
}) => {
  
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const toggleHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders[index].enabled = !newHeaders[index].enabled;
    setHeaders(newHeaders);
  };

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 bg-black/40">
        {['headers', 'body', 'auth'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'text-purple-400 bg-white/5 border-b-2 border-purple-500' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[200px]">
        {/* HEADERS TAB */}
        {activeTab === 'headers' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Key-Value Pairs</span>
              <button onClick={addHeader} className="text-[10px] text-purple-400 hover:underline">+ Add Row</button>
            </div>
            {headers.map((h, i) => (
              <div key={i} className={`flex gap-3 items-center ${h.enabled ? 'opacity-100' : 'opacity-30'}`}>
                <input 
                  type="checkbox" 
                  checked={h.enabled} 
                  onChange={() => toggleHeader(i)} 
                  className="accent-purple-500 w-4 h-4" 
                />
                <input 
                  placeholder="Header-Name" 
                  className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 w-1/2 outline-none focus:border-purple-500 font-mono text-sm" 
                  value={h.key} 
                  onChange={(e) => updateHeader(i, 'key', e.target.value)}
                />
                <input 
                  placeholder="Value" 
                  className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 w-1/2 outline-none focus:border-purple-500 font-mono text-sm" 
                  value={h.value} 
                  onChange={(e) => updateHeader(i, 'value', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* BODY TAB */}
        {activeTab === 'body' && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase cursor-pointer">
              <input 
                type="checkbox" 
                checked={body.enabled} 
                onChange={() => setBody({...body, enabled: !body.enabled})} 
                className="accent-purple-500 w-4 h-4"
              /> 
              Enable JSON Body
            </label>
            <textarea 
              placeholder='{ "key": "value" }' 
              disabled={!body.enabled} 
              className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm outline-none focus:border-purple-500 disabled:opacity-20 transition-all resize-none" 
              value={body.content} 
              onChange={(e) => setBody({...body, content: e.target.value})} 
            />
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase cursor-pointer">
              <input 
                type="checkbox" 
                checked={auth.enabled} 
                onChange={() => setAuth({...auth, enabled: !auth.enabled})} 
                className="accent-purple-500 w-4 h-4"
              /> 
              Enable Bearer Token
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 text-xs font-mono">Bearer</div>
              <input 
                placeholder="Paste your token here..." 
                disabled={!auth.enabled} 
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-20 pr-4 py-3 font-mono text-sm outline-none focus:border-purple-500 disabled:opacity-20 transition-all" 
                value={auth.token} 
                onChange={(e) => setAuth({...auth, token: e.target.value})} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigTabs;