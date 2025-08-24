export default function Stars({ value=0 }){
  return (
   <div className="flex gap-1" role="radiogroup" aria-label="Rating">
  {Array.from({ length: 5 }).map((_, i) => (
    <button
      key={i}
      type="button"
      aria-checked={i < value}
      role="radio"
      onClick={() => onChange?.(i + 1)}
      className="focus:outline-none group"
    >
      <svg
        className={`h-6 w-6 transition-colors duration-200 drop-shadow-sm
          ${
            i < value
              ? "fill-yellow-400"
              : "fill-gray-200 group-hover:fill-yellow-200"
          }`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z" />
      </svg>
    </button>
  ))}
</div>


  )
}