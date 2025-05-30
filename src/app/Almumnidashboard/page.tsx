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
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      setUsername(user);
    } else {
      router.push("/");
    }
    const storedPackages = localStorage.getItem("highestPackages");
    if (storedPackages) {
      setPackages(JSON.parse(storedPackages));
    }
  }, [router]);

  const handleNavigation = (path: string) => router.push(`${path}?username=${encodeURIComponent(username)}`);

  const handleAddOrUpdatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.company || !newPackage.package || !newPackage.year.match(/^\d{4}$/)) {
      setError("Please fill all fields correctly. Year must be a 4-digit number.");
      return;
    }
    const updated = editingPackage
      ? packages.map(pkg => pkg.id === editingPackage.id ? { id: pkg.id, ...newPackage } : pkg)
      : [...packages, { id: uuidv4(), ...newPackage }];

    setPackages(updated);
    localStorage.setItem("highestPackages", JSON.stringify(updated));
    setEditingPackage(null);
    setNewPackage({ company: "", package: "", year: "" });
    setError("");
  };

  const handleDeletePackage = (id: string) => {
    const updated = packages.filter(pkg => pkg.id !== id);
    setPackages(updated);
    localStorage.setItem("highestPackages", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Image src="/laralogo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <h1 className="text-xl font-bold">LARA CONNECT</h1>
        </div>
        <nav className="flex gap-4">
          {[
            { label: "AlumniContributions", path: "/about" },
            { label: "Events", path: "/events" },
            { label: "CurrentTrends", path: "/news" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <button key={label} onClick={() => handleNavigation(path)} className="px-3 py-1 border border-white rounded hover:bg-white hover:text-black transition">
              {label}
            </button>
          ))}
        </nav>
        <button onClick={() => router.push("/")} className="px-3 py-1 border border-white rounded hover:bg-white hover:text-black transition">
          Sign Out
        </button>
      </header>

      <section className="py-10 text-center border-b border-gray-800">
        <h2 className="text-3xl font-semibold">Welcome, Alumni: <span className="text-white">{username}</span></h2>
        <p className="text-gray-400 mt-2">Connect with your Juniors and Guide them in a right way.</p>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Manage Highest Packages</h3>
          <form onSubmit={handleAddOrUpdatePackage} className="space-y-3">
            {['company', 'package', 'year'].map(field => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(newPackage as any)[field]}
                onChange={(e) => setNewPackage({ ...newPackage, [field]: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-white text-white"
              />
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300">
                {editingPackage ? "Update" : "Add"} Package
              </button>
              {editingPackage && (
                <button type="button" onClick={() => { setEditingPackage(null); setNewPackage({ company: "", package: "", year: "" }); setError(""); }} className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Current Packages</h4>
            <ul className="space-y-2">
              {packages.map(pkg => (
                <li key={pkg.id} className="flex justify-between items-center bg-neutral-800 p-3 rounded">
                  <span>{pkg.company}: {pkg.package} LPA ({pkg.year})</span>
                  <div className="space-x-2">
                    <button onClick={() => { setEditingPackage(pkg); setNewPackage({ company: pkg.company, package: pkg.package, year: pkg.year }); }} className="text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-400 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="aspect-video w-full rounded overflow-hidden">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/R0FiU-PQ8XM?playlist=R0FiU-PQ8XM&loop=1" title="Alumni Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
          <button onClick={() => handleNavigation("/updates")} className="w-full px-4 py-3 bg-white text-black font-semibold rounded hover:bg-gray-300 transition">
            View All Updates
          </button>
        </div>
      </main>
    </div>
  );
}