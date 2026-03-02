export default function Loading() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-96 bg-gray-100 rounded animate-pulse" />
        </div>
      </section>

      <section>
        <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
