import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-pixelify-sans">404</h1>
      <p className="mt-2 text-lg text-gray-500">This page could not be found.</p>
      <Link href="/" className="mt-6 text-blue-600 hover:text-blue-800 transition-colors">
        Back to home
      </Link>
    </div>
  );
}
