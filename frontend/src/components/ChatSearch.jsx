import React from 'react'

function ChatSearch() {
  return (
    <div className='absolute min-h-[7vh] w-screen bg-zinc-200 bottom-0 flex items-center justify-between px-8 right-0 gap-4'>
        <input placeholder='Search Here' className='bg-transparent border border-zinc-500 rounded-lg px-2 py-1 w-full' type="text" />
        <button className='text-white bg-green-400/80 px-4 py-2 rounded-xl' type="submit">Send</button>
    </div>
  )
}

export default ChatSearch