'use client';

export default function OpenHighLowCloseTable({data}) {
  
  return (
    <div className="overflow-x-auto max-h-[240px] overflow-y-scroll rounded mt-2">
      <table className="min-w-full text-sm text-left table-auto">
        <thead className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Open</th>
          <th className="px-4 py-2">High</th>
          <th className="px-4 py-2">Low</th>
          <th className="px-4 py-2">Close</th>
        </tr>
        </thead>
        <tbody>
        {data?.map((row, i) => (
          <tr
            key={i}
            className="hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
          >
            <td className="px-4 py-2">{`${row.time}`}</td>
            <td className="px-4 py-2">{`$${row.open}`}</td>
            <td className="px-4 py-2">{`$${row.high}`}</td>
            <td className="px-4 py-2">{`$${row.low}`}</td>
            <td className="px-4 py-2">{`$${row.close}`}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
