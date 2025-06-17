import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-lg mb-4">Page Not Found</p>
        <p className="text-sm text-gray-300 mb-8">The page you are looking for does not exist.</p>
        <Link to="/dashboard">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
