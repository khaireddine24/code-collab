export function SheetsSkeleton() {
    return (
      <div className="grid gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 border rounded animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }