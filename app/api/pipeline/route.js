import { NextResponse } from 'next/server';

export async function POST(req) {
  const { step, data } = await req.json();
  
  // Artificial delay to see the "Loading" state in the graph
 

  if (step === 1) {
    return NextResponse.json({ status: "Online", version: "2.0" });
  } 
  
  if (step === 2) {
    if (!data?.url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    return NextResponse.json({ message: "Metadata Cached", id: "VID_99" });
  }

  if (step === 3) {
    return NextResponse.json({ sentiment: "Positive", score: 0.92 });
  }

  return NextResponse.json({ error: "Invalid Step" }, { status: 400 });
}