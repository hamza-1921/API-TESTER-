"use client"
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { encodeState, decodeState } from '@/lib/utils';

// Your existing sub-components
import RequestBar from './RequestBar';
import ConfigTabs from './ConfigTabs';
import ResponseView from './ResponseView';

// The new Graph component
import WorkflowCanvas from './WorkflowCanvas';

const PlaygroundContent = () => {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'workflow'
  
  // --- STATE ---
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [activeTab, setActiveTab] = useState('headers');
  const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
  const [body, setBody] = useState({ content: '', enabled: false });
  const [auth, setAuth] = useState({ token: '', enabled: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Hydration & Initial Load
  useEffect(() => {
    setMounted(true);
    const data = searchParams.get('data');
    if (data) {
      const saved = decodeState(data);
      if (saved) {
        setUrl(saved.url || '');
        setMethod(saved.method || 'GET');
        setHeaders(saved.headers || [{ key: '', value: '', enabled: true }]);
        setBody(saved.body || { content: '', enabled: false });
        setAuth(saved.auth || { token: '', enabled: false });
      }
    }
  }, []);

  // 2. FIXED: Sync State to URL with DEBOUNCE
  // This stops the "rendering every millisecond" issue
  useEffect(() => {
    if (!mounted || viewMode !== 'single') return;

    const timeoutId = setTimeout(() => {
      const state = { url, method, headers, body, auth };
      const encoded = encodeState(state);
      const currentParams = new URLSearchParams(window.location.search);
      
      // Only update if data actually changed
      if (encoded !== currentParams.get('data')) {
        window.history.replaceState(null, '', `?data=${encoded}`);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [url, method, headers, body, auth, mounted, viewMode]);

  const runTest = async () => {
    setLoading(true);
    const headerObj = headers.reduce((acc, curr) => {
      if (curr.enabled && curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});

    try {
      const res = await axios.post('/api/proxy', {
        url,
        method,
        headers: headerObj,
        body: (body.enabled && body.content) ? JSON.parse(body.content) : null,
        auth: auth.enabled ? { type: 'Bearer', token: auth.token } : null
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: "Execution Failed", details: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="p-10 text-zinc-500 font-mono italic text-center">Initialising HAMZALABS...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-zinc-200">
      <header className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            API<span className="text-purple-500">Playground</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">// Stateless Engine</p>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 scale-90 md:scale-100">
          <button 
            onClick={() => setViewMode('single')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'single' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
          >
            Single
          </button>
          <button 
            onClick={() => setViewMode('workflow')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'workflow' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
          >
            Graph
          </button>
        </div>

        <button 
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Magic Link Copied!"); }}
          className="hidden md:block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-purple-500/20 transition-all"
        >
          Share
        </button>
      </header>

      {viewMode === 'single' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <RequestBar url={url} setUrl={setUrl} method={method} setMethod={setMethod} onRun={runTest} loading={loading} />
          <ConfigTabs activeTab={activeTab} setActiveTab={setActiveTab} headers={headers} setHeaders={setHeaders} body={body} setBody={setBody} auth={auth} setAuth={setAuth} />
          <ResponseView result={result} />
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <WorkflowCanvas />
        </div>
      )}
    </div>
  );
};

export default function AdvancedPlayground() {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Initializing...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}