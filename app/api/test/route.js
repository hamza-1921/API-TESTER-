import { NextRequest,NextResponse } from "next/server";

export async function POST(req){
    const res = 'hello'

   
    return NextResponse.json({message: res}) ;
}