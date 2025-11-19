export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-full px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Agent Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            Welcome to your dashboard! Here you can manage your listings, view
            inquiries, and track your performance.
          </p>
        </div>
      </div>
    </div>
  );
}
