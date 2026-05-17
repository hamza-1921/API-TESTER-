"use client"
import React from 'react'
import axios from 'axios'
import { useState } from 'react'

const Test = () => {


    const sendRequest = async ()=>{
      const response  = await axios.post('/api/proxy',{
        message:'hello'
      })

      const result  = await response.data ;
      console.log(result)
    }


  return (
    <div>
    <button onClick={sendRequest} className='bg-blue-500 border-2 border-b-black '>Send request</button>
    </div>
  )
}

export default Test
