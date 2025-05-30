export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-black">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">PS</span>
        </div>
      </div>
    </div>
  );
}
