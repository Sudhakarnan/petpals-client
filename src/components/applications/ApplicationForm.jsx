import { useState } from 'react'

export default function ApplicationForm({ petId, onSubmit }) {
  const [about, setAbout] = useState('')
  const [home, setHome] = useState('Apartment')
  const [havePets, setHavePets] = useState('No')

  return (
    <form
  className="space-y-5 p-6 rounded-2xl 
             bg-gradient-to-b from-[#fff1f2] via-white to-[#ffe4e6] 
             shadow-lg border border-pink-100/70 backdrop-blur-sm transition"
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit?.({ petId, about, home, havePets });
  }}
>
  {/* About */}
  <label className="block space-y-1.5">
    <span className="text-sm font-semibold text-pink-700">Tell the shelter about you</span>
    <textarea
      placeholder="Share a little about yourself, your lifestyle, and why you want to adopt..."
      className="w-full rounded-xl border border-pink-200 bg-white/90 px-3 py-2 
                 text-slate-700 placeholder-slate-400 shadow-inner
                 focus:border-transparent focus:ring-2 focus:ring-pink-300 focus:outline-none 
                 transition-all duration-200"
      rows={4}
      value={about}
      onChange={(e) => setAbout(e.target.value)}
    />
  </label>

  {/* Home type */}
  <label className="block space-y-1.5">
    <span className="text-sm font-semibold text-pink-700">Home type</span>
    <select
      className="w-full rounded-xl border border-pink-200 bg-white/90 px-3 py-2 
                 text-slate-700 shadow-inner
                 focus:border-transparent focus:ring-2 focus:ring-pink-300 focus:outline-none 
                 transition-all duration-200"
      value={home}
      onChange={(e) => setHome(e.target.value)}
    >
      {['Apartment', 'House', 'Farm', 'Other'].map((h) => (
        <option key={h} value={h}>{h}</option>
      ))}
    </select>
  </label>

  {/* Pets question */}
  <label className="block space-y-1.5">
    <span className="text-sm font-semibold text-pink-700">Do you currently have pets?</span>
    <select
      className="w-full rounded-xl border border-pink-200 bg-white/90 px-3 py-2 
                 text-slate-700 shadow-inner
                 focus:border-transparent focus:ring-2 focus:ring-pink-300 focus:outline-none 
                 transition-all duration-200"
      value={havePets}
      onChange={(e) => setHavePets(e.target.value)}
    >
      {['No', 'Yes'].map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </label>

  {/* Submit button */}
  <button
    type="submit"
    className="w-full inline-flex items-center justify-center rounded-xl font-semibold text-white 
               px-4 py-2.5 shadow-md hover:shadow-lg active:scale-[.98]
               bg-gradient-to-r from-pink-500 to-rose-500
               hover:from-pink-500/90 hover:to-rose-500/90
               focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 
               focus-visible:ring-offset-2 focus-visible:ring-offset-white
               transition-all duration-200"
  >
    Submit Application
  </button>
</form>



  )
}