export function SkeletonTable() {
  return (
    <div className="rounded-md border border-gray-800 p-4 bg-gray-900">
      <table className="w-full text-gray-100">
        <thead>
          <tr className="text-left text-sm text-gray-400">
            <th className="p-2">Id</th>
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Address</th>
            <th className="p-2">Email</th>
            <th className="p-2">Specialization</th>
            <th className="p-2">Experience</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="border-t border-gray-800">
              <td className="p-2">
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="p-2">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-900 p-4 rounded-md border border-gray-800 animate-pulse"
        >
          <div className="h-5 w-2/3 bg-gray-700 rounded mb-3" />
          <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-700 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
        </div>
      ))}
    </div>
  );
}