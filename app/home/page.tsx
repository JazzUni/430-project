export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Library Management System
        </h1>

        <p className="text-gray-700 mb-6">
          Welcome to the library dashboard
        </p>

        <ul className="space-y-3">
          <li className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer transition">
            Add Books
          </li>
          <li className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer transition">
            View Books
          </li>
          <li className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer transition">
            Borrow Books
          </li>
          <li className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer transition">
            Return Books
          </li>
        </ul>
      </div>
    </main>
  );
}