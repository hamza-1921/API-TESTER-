"use client"
import React, { useCallback, useState } from 'react';
import { 
  ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, Panel 
} from '@xyflow/react';
import axios from 'axios';
import ApiNode from './ApiNode';
import '@xyflow/react/dist/style.css';

const nodeTypes = { apiNode: ApiNode };

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);

  const onNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)));
  }, [setNodes]);

  /**
   * SMART INJECTOR:
   * 1. Still supports {{node_id.path}} for complex deep-dives.
   * 2. NEW: Detects raw "node_123..." strings and automatically swaps them 
   *    for the numeric 'id' found in that node's response.
   */
  const injectVariables = (text, memory) => {
    if (!text || typeof text !== 'string') return text;

    // First pass: Handle explicit brackets {{node_id.key}}
    let processedText = text.replace(/\{\{(node_\d+)\.(.+?)\}\}/g, (match, nodeId, path) => {
      const nodeResponse = memory[nodeId];
      if (!nodeResponse) return match;
      const value = path.split('.').reduce((obj, key) => obj?.[key], nodeResponse);
      return value !== undefined ? String(value) : match;
    });

    // Second pass: Automatic detection of raw Node IDs (Zero Brackets)
    // Matches patterns like 'node_1778411937180'
    processedText = processedText.replace(/(node_\d+)/g, (match) => {
      const nodeResponse = memory[match];
      
      if (nodeResponse) {
        // Automatically grab the primary ID from the response object
        const autoId = nodeResponse.id || nodeResponse._id || nodeResponse.uid;
        return autoId !== undefined ? String(autoId) : match;
      }
      return match;
    });

    return processedText;
  };

  const addRequestNode = () => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type: 'apiNode',
      position: { x: 100, y: 100 },
      data: { 
        label: `Request #${nodes.length + 1}`, 
        method: 'GET', 
        url: '', 
        body: '',
        status: 'idle',
        response: null,
        onNodeDataChange 
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const runDeployment = async () => {
    setLoading(true);
    let memory = {}; // Keeps track of responses for injection

    for (const node of nodes) {
      onNodeDataChange(node.id, { ...node.data, status: 'loading' });

      // Clean the URL and Body using the Smart Injector
      const finalUrl = injectVariables(node.data.url, memory);
      let finalBody = null;
      
      try {
        if (node.data.body) {
          const injectedBodyText = injectVariables(node.data.body, memory);
          finalBody = JSON.parse(injectedBodyText);
        }
      } catch (e) {
        console.error("JSON Parse Error in Node:", node.id);
      }

      try {
        // Sending to your local proxy
        const response = await axios.post('/api/proxy', {
          url: finalUrl,
          method: node.data.method,
          body: finalBody
        });

        if (response.data.success) {
          // Store the raw data so the NEXT node can use it
          memory[node.id] = response.data.data;
          
          onNodeDataChange(node.id, { 
            ...node.data, 
            status: 'success', 
            response: response.data.data 
          });
        } else {
          onNodeDataChange(node.id, { ...node.data, status: 'error' });
          break; // Stop sequence on failure
        }
      } catch (err) {
        onNodeDataChange(node.id, { ...node.data, status: 'error' });
        break;
      }
    }
    setLoading(false);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#a855f7', strokeWidth: 2 } 
    }, eds)),
    [setEdges]
  );

  return (
    <div className="h-[750px] w-full bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
      >
        <Background variant="dots" gap={25} size={1} color="#222" />
        <Controls className="!bg-zinc-900 !border-white/10 !fill-white" />
        <Panel position="top-left" className="flex gap-3">
          <button 
            onClick={addRequestNode} 
            className="bg-zinc-900 border border-white/10 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-purple-500 transition-all shadow-xl"
          >
            + New Endpoint
          </button>
          <button 
            onClick={runDeployment} 
            disabled={loading || nodes.length === 0} 
            className="bg-purple-600 text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 disabled:opacity-30 shadow-xl shadow-purple-500/20 transition-all"
          >
            {loading ? '⚡ Running Chain...' : '▶ Deploy Sequence'}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}