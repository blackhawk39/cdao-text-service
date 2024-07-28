import React from 'react'

function Login() {
  return (
    <div className="min-h-[92vh] w-screen  flex items-center justify-center flex-col">
      <div className="text-center text-[#543F3F]">
        <h1 className="text-8xl font-bold ">SIMPL</h1>
        <p className=" leading-none text-[27px]">Decentralized Chat App</p>
      </div>
      <div className="flex items-center flex-col text-3xl mt-20">
        <input
          type="email"
          placeholder="Email"
          className="bg-transparent border border-zinc-400 py-3 px-3 rounded-xl my-2 placeholder:text-3xl outline-none"
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="Password"
          className="bg-transparent border border-zinc-400 py-3 px-3 rounded-xl placeholder:text-3xl outline-none"
        />
      </div>
      <div className="text-center text-white mt-16">
        <button className="bg-[#36D59F] text-2xl py-4 font-semibold rounded-xl px-[155px]">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login