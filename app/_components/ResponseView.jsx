"use client"

const ResponseView = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-black/60 border border-white/10 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h3 className="text-xs font-black uppercase text-zinc-500">Response</h3>
        <span className={`text-xs font-mono font-bold ${result.status < 400 ? "text-green-400" : "text-red-400"}`}>
          {result.status} {result.statusText}
        </span>
      </div>
      <pre className="text-xs font-mono text-purple-300/80 overflow-auto max-h-[500px]">
        {JSON.stringify(result.data || result, null, 2)}
      </pre>
    </div>
  );
};

export default ResponseView;