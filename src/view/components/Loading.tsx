export function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-[500px]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}
