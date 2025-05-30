import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl mb-2">Page Not Found</p>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
