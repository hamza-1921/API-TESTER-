import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { url, method, headers, body, auth } = await req.json();

    const finalHeaders = { ...headers };
    if (auth?.type === 'Bearer' && auth.token) {
      finalHeaders['Authorization'] = `Bearer ${auth.token}`;
    }

    const response = await axios({
      url,
      method: method || 'GET',
      headers: finalHeaders,
      data: body || null,
      validateStatus: () => true, // We want to see 404s and 500s, not crash the proxy
    });

    // We return the target's status code. 
    // The frontend will treat 200-299 as "Green" and everything else as "Red".
    return NextResponse.json({
      status: response.status,
      data: response.data,
      success: response.status >= 200 && response.status < 300,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Target API unreachable", success: false, details: error.message },
      { status: 200 } // Keep status 200 so the Proxy response itself doesn't trigger a catch block
    );
  }
}