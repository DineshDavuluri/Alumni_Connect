"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";

interface Update {
  title: string;
  date: string;
  description: string;
}

// Extended static updates
const staticUpdates: Update[] = [
  { title: "AI Revolution in 2025", date: "2025-05-10", description: "Massive developments in GenAI across education and industry sectors." },
  { title: "Quantum Computing Breakthrough", date: "2025-04-22", description: "Researchers achieve stable quantum entanglement for longer durations." },
  { title: "SpaceX Launches Lunar Mission", date: "2025-03-30", description: "New lunar base supply drop completed successfully." },
  { title: "5G Network Upgrade Completed", date: "2025-02-15", description: "Nationwide coverage offers 10x faster speeds." },
  { title: "Neural Implants Go Mainstream", date: "2025-01-20", description: "Commercial neural links enhance learning efficiency." },
  { title: "Blockchain Voting Pilots", date: "2024-12-05", description: "Decentralized voting tested in local governments." },
  { title: "Biodegradable Chipsets", date: "2024-11-18", description: "Eco-tech firm reveals planet-friendly processors." },
  { title: "Virtual Reality Classrooms", date: "2024-10-10", description: "Widespread adoption of immersive learning environments." },
  { title: "Energy Storage Breakthrough", date: "2024-09-25", description: "Battery lasts 10x longer using graphene composites." },
];

export default function Updates() {
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>(staticUpdates);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newUpdate, setNewUpdate] = useState<Update>({ title: "", date: "", description: "" });

  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      setUsername(user);
      const numPrefix = parseInt(user.slice(0, 2), 10);
      setIsAlumni(!isNaN(numPrefix) && numPrefix <= 20);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | null) => {
    const { name, value } = e.target;
    if (index !== null) {
      setUpdates(prev => prev.map((u, i) => i === index ? { ...u, [name]: value } : u));
    } else {
      setNewUpdate(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveUpdate = () => setEditingIndex(null);

  const addUpdate = () => {
    if (newUpdate.title && newUpdate.date && newUpdate.description) {
      setUpdates(prev => [...prev, newUpdate]);
      setNewUpdate({ title: "", date: "", description: "" });
    } else {
      alert("Please fill in all fields to add an update.");
    }
  };

  const deleteUpdate = (index: number) => setUpdates(prev => prev.filter((_, i) => i !== index));

  const handleNavigation = (path: string) => {
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 sm:px-6 lg:px-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Latest Tech Updates</h1>

      <nav className="mb-8 flex flex-wrap justify-center gap-4">
        {[
          { path: "dashboard", label: "Home" },
          { path: "about", label: "Alumni Contributions" },
          { path: "alumni-directory", label: "Alumni Directory" },
          { path: "events", label: "Events" },
        ].map(({ path, label }) => (
          <button key={path} onClick={() => handleNavigation(path)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium">
            {label}
          </button>
        ))}
      </nav>

      <div className="space-y-8 max-w-5xl mx-auto">
        {updates.map((update, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''} bg-gray-100 shadow-md rounded-xl overflow-hidden`}
          >
            <div className="w-full sm:w-1/2 p-6">
              {editingIndex === index ? (
                <>
                  <input name="title" value={update.title} onChange={e => handleInputChange(e, index)} placeholder="Title" className="mb-2 w-full p-2 border rounded-md" />
                  <input name="date" value={update.date} onChange={e => handleInputChange(e, index)} placeholder="Date" className="mb-2 w-full p-2 border rounded-md" />
                  <textarea name="description" value={update.description} onChange={e => handleInputChange(e, index)} placeholder="Description" className="mb-2 w-full p-2 border rounded-md" />
                  <button onClick={saveUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800">{update.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{update.date}</p>
                  <p className="text-gray-700 mb-2">{update.description}</p>
                  {isAlumni && (
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingIndex(index)} className="px-3 py-1 bg-yellow-500 text-white rounded-md">Edit</button>
                      <button onClick={() => deleteUpdate(index)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full sm:w-1/2 bg-gray-200 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-300 p-10">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {isAlumni && (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Update</h2>
          <input name="title" value={newUpdate.title} onChange={e => handleInputChange(e, null)} placeholder="Title" className="mb-2 w-full p-2 border rounded-md" />
          <input name="date" value={newUpdate.date} onChange={e => handleInputChange(e, null)} placeholder="Date" className="mb-2 w-full p-2 border rounded-md" />
          <textarea name="description" value={newUpdate.description} onChange={e => handleInputChange(e, null)} placeholder="Description" className="mb-2 w-full p-2 border rounded-md" />
          <button onClick={addUpdate} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Add Update</button>
        </div>
      )}

      <p className="text-center text-sm text-gray-600 mt-10">Logged in as: <span className="font-semibold">{username}</span></p>
    </div>
  );
}
