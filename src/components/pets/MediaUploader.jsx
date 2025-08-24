export default function MediaUploader({ files = [], onChange }) {
  const handle = (e) => {
    const list = Array.from(e.target.files)
    onChange?.(list)
  }
  return (
    <div>
  <label className="block text-sm font-semibold text-[#0f2f3f] mb-2">
    Photos / Videos
  </label>

  {/* File input */}
  <input
    type="file"
    multiple
    accept="image/*,video/*"
    onChange={handle}
    className="block w-full text-sm text-slate-700 cursor-pointer
               file:mr-3 file:py-2.5 file:px-4 
               file:rounded-xl file:border-0 file:text-sm file:font-medium
               file:bg-gradient-to-r file:from-cyan-500 file:to-sky-500 file:text-white 
               hover:file:from-cyan-400 hover:file:to-sky-400
               focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2
               transition"
  />

  {/* Previews */}
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
    {files.map((f, i) => {
      const isImage = f.type.startsWith("image/");
      const preview = URL.createObjectURL(f);

      return (
        <div
          key={i}
          className="relative aspect-video bg-slate-100/70 border border-cyan-100/70 
                     rounded-xl overflow-hidden flex items-center justify-center 
                     shadow-sm hover:shadow-md transition"
        >
          {isImage ? (
            <img
              src={preview}
              alt={f.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <video src={preview} className="w-full h-full object-cover" />
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeFile(i)}
            className="absolute top-2 right-2 bg-rose-500/80 hover:bg-rose-600 text-white 
                       rounded-full p-1.5 text-xs shadow-md transition"
          >
            ✕
          </button>
        </div>
      );
    })}
  </div>
</div>


  )
}