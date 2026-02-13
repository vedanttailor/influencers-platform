"use client";
import { useState } from "react";

export default function Forgot() {
  const [email,setEmail]=useState("");

  async function submit() {
    await fetch("http://localhost:8000/auth/forgot-password",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({email})
    });
    alert("Reset link sent");
  }

  return (
    <div>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <button onClick={submit}>Send reset</button>
    </div>
  );
}
