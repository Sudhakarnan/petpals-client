import { useState } from 'react'

export default function MessageInput({ onSend }){
  const [text, setText] = useState('')
  return (
   <form
  className="flex gap-2 items-center p-2 rounded-2xl border border-cyan-200/70 
             bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition"
  onSubmit={(e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend?.(text);
    setText("");
  }}
>
  {/* Input */}
  <input
    className="flex-1 px-4 py-2 rounded-xl border border-cyan-200 bg-white/80
               placeholder-slate-400 text-sm text-slate-800 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400/50 
               focus:outline-none transition"
    placeholder="Type a message..."
    value={text}
    onChange={(e) => setText(e.target.value)}
  />

  {/* Send button */}
  <button
    type="submit"
    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl font-medium
               bg-gradient-to-r from-cyan-500 to-sky-500 text-white
               shadow-sm hover:shadow-md hover:from-cyan-400 hover:to-sky-400
               active:scale-[.98] transition-all"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8l16-6-6 16-2-6-6-2z"
      />
    </svg>
    Send
  </button>
</form>


  )
}