export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-8 animate-spin">
          💸
        </div>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Wreckless Racks Casino
        </h1>

        <p className="text-xl text-white mb-8">
          Loading your casino experience...
        </p>

        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}