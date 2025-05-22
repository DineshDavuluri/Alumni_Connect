"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [packages, setPackages] = useState<
    { id: string; company: string; package: string; year: string }[]
  >([]);
  const [newPackage, setNewPackage] = useState({
    company: "",
    package: "",
    year: "",
  });
  const [editingPackage, setEditingPackage] = useState<{
    id: string;
    company: string;
    package: string;
    year: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Handle username
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      setUsername(user);
    } else {
      router.push("/");
    }

    // Load packages from localStorage
    const storedPackages = localStorage.getItem("highestPackages");
    if (storedPackages) {
      setPackages(JSON.parse(storedPackages));
    }
  }, [router]);

  const handleSignOut = () => {
    router.push("/");
  };

  const handleAbout = () => {
    router.push(`/about?username=${encodeURIComponent(username)}`);
  };

  const handleContact = () => {
    router.push(`/contact?username=${encodeURIComponent(username)}`);
  };

  const handleEvents = () => {
    router.push(`/events?username=${encodeURIComponent(username)}`);
  };

  const handleSearchAlumni = () => {
    router.push(`/alumni-directory?username=${encodeURIComponent(username)}`);
  };

  const handleViewNews = () => {
    router.push(`/news?username=${encodeURIComponent(username)}`);
  };

  const handleMentorship = () => {
    router.push(`/mentorship?username=${encodeURIComponent(username)}`);
  };

  const handleViewAllUpdates = () => {
    router.push(`/updates?username=${encodeURIComponent(username)}`);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPackage.company ||
      !newPackage.package ||
      !newPackage.year.match(/^\d{4}$/)
    ) {
      setError("Please fill all fields correctly. Year must be a 4-digit number.");
      return;
    }
    const updatedPackages = [
      ...packages,
      { id: uuidv4(), ...newPackage },
    ];
    setPackages(updatedPackages);
    localStorage.setItem("highestPackages", JSON.stringify(updatedPackages));
    setNewPackage({ company: "", package: "", year: "" });
    setError("");
  };

  const handleEditPackage = (pkg: {
    id: string;
    company: string;
    package: string;
    year: string;
  }) => {
    setEditingPackage(pkg);
    setNewPackage({
      company: pkg.company,
      package: pkg.package,
      year: pkg.year,
    });
  };

  const handleUpdatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPackage.company ||
      !newPackage.package ||
      !newPackage.year.match(/^\d{4}$/)
    ) {
      setError("Please fill all fields correctly. Year must be a 4-digit number.");
      return;
    }
    if (editingPackage) {
      const updatedPackages = packages.map((pkg) =>
        pkg.id === editingPackage.id
          ? { id: pkg.id, ...newPackage }
          : pkg
      );
      setPackages(updatedPackages);
      localStorage.setItem("highestPackages", JSON.stringify(updatedPackages));
      setEditingPackage(null);
      setNewPackage({ company: "", package: "", year: "" });
      setError("");
    }
  };

  const handleDeletePackage = (id: string) => {
    const updatedPackages = packages.filter((pkg) => pkg.id !== id);
    setPackages(updatedPackages);
    localStorage.setItem("highestPackages", JSON.stringify(updatedPackages));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <Image
            src="/laralogo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            LARA CONNECT
          </h1>
        </div>
        <nav className="flex space-x-6">
          <button
            onClick={handleAbout}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            AlumniContributions
          </button>
          <button
            onClick={handleEvents}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Events
          </button>
          <button
            onClick={handleViewNews}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            CurrentTrends
          </button>
          <button
            onClick={handleContact}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Contact
          </button>
        </nav>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          Sign Out
        </button>
      </header>
      <section className="relative flex items-center justify-center h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight animate-fade-in">
            Welcome, Alumni :{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              {username}
            </span>
          </h2>
          <p className="mt-2 text-lg text-gray-200 animate-fade-in-delayed">
            Connect with your Juniors and Guide them in a right way.
          </p>
        </div>
      </section>
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Package Management Section */}
          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">
              Manage Highest Packages
            </h3>
            <form
              onSubmit={editingPackage ? handleUpdatePackage : handleAddPackage}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  value={newPackage.company}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, company: e.target.value })
                  }
                  className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Package (LPA)
                </label>
                <input
                  type="text"
                  value={newPackage.package}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, package: e.target.value })
                  }
                  className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Year
                </label>
                <input
                  type="text"
                  value={newPackage.year}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, year: e.target.value })
                  }
                  className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                {editingPackage ? "Update Package" : "Add Package"}
              </button>
              {editingPackage && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPackage(null);
                    setNewPackage({ company: "", package: "", year: "" });
                    setError("");
                  }}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </form>
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-200">
                Current Packages
              </h4>
              {packages.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {packages.map((pkg) => (
                    <li
                      key={pkg.id}
                      className="flex justify-between items-center p-2 bg-gray-700 rounded-lg"
                    >
                      <span>
                        {pkg.company}: {pkg.package} LPA ({pkg.year})
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No packages added yet.</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 10c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-300">Alumni List</h3>
                <p className="text-gray-400">
                  Search the directory to connect with fellow alumni.
                </p>
              </div>
            </div>
            <button
              onClick={handleSearchAlumni}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Edit Alumni
            </button>
          </div>

          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l2 4h4a2 2 0 012 2v8a2 2 0 01-2 2zM7 10h10M7 14h6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-300">
                  Current Trends
                </h3>
                <p className="text-gray-400">
                  Read the latest updates from our alumni community.
                </p>
              </div>
            </div>
            <button
              onClick={handleViewNews}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-300"
            >
              Edit Info
            </button>
          </div>

          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-300">Mentorship</h3>
                <p className="text-gray-400">
                  Find a mentor or offer your expertise to other alumni.
                </p>
              </div>
            </div>
            <button
              onClick={handleMentorship}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
            >
              Edit Mentors
            </button>
          </div>
        </div>
        <div className="md:col-span-1 space-y-6 flex flex-col items-center">
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/R0FiU-PQ8XM?playlist=R0FiU-PQ8XM&loop=1"
              title="Alumni Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button
            onClick={handleViewAllUpdates}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg"
          >
            <span className="text-lg font-semibold">View All Updates</span>
          </button>
        </div>
      </main>
    </div>
  );
}