'use client';

// Skeleton for table loading state, keeps it snappy
export function SkeletonTable() {
  return (
    <div className="rounded-lg border border-gray-200/50 p-4 bg-white/95 backdrop-blur-sm shadow-sm">
      <table className="w-full text-gray-800 text-sm sm:text-base">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="p-4 font-medium">Id</th>
            <th className="p-4 font-medium">First Name</th>
            <th className="p-4 font-medium">Last Name</th>
            <th className="p-4 font-medium">Address</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Specialization</th>
            <th className="p-4 font-medium">Experience</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="border-t border-gray-200/30">
              <td className="p-4">
                <div className="h-4 w-16 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-32 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-28 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-20 bg-gray-300/70 rounded animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 bg-gray-300/70 rounded animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for card loading state, looks clean
export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white/95 p-4 sm:p-6 rounded-xl border border-gray-200/50 shadow-sm animate-pulse"
        >
          <div className="h-5 w-2/3 bg-gray-300/70 rounded mb-3" />
          <div className="h-4 w-1/2 bg-gray-300/70 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-300/70 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-300/70 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-300/70 rounded mb-2" />
        </div>
      ))}
    </div>
  );
}