"use client";
import {useRouter} from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";

interface Update {
  title: string;
  date: string;
  description: string;
}



export default function Updates() {
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newUpdate, setNewUpdate] = useState<Update>({
    title: "",
    date: "",
    description: "",
  });

  
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUpdates = localStorage.getItem("updates");
      if (savedUpdates) {
        setUpdates(JSON.parse(savedUpdates));
      }
      const urlParams = new URLSearchParams(window.location.search);
      const user = urlParams.get("username");
      if (user) {
        setUsername(user);
        const numPrefix = parseInt(user.slice(0, 2), 10);
        setIsAlumni(!isNaN(numPrefix) && numPrefix <= 20);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isAlumni) {
      localStorage.setItem("updates", JSON.stringify(updates));
    }
  }, [updates, isAlumni]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setUpdates((prev) =>
        prev.map((update, i) => (i === index ? { ...update, [name]: value } : update))
      );
    } else {
      setNewUpdate((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveUpdate = () => {
    setEditingIndex(null);
  };

  const addUpdate = () => {
    if (newUpdate.title && newUpdate.date && newUpdate.description) {
      setUpdates((prev) => [...prev, newUpdate]);
      setNewUpdate({ title: "", date: "", description: "" });
    }
  };

  const deleteUpdate = (index: number) => {
    setUpdates((prev) => prev.filter((_, i) => i !== index));
  };
  const handleNavigation = (path: string) => {
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Latest Tech Updates</h1>
      <nav className="w-full mb-8">
        <ul className="flex justify-around text-lg font-semibold">
          <li>
            <button
              onClick={() => handleNavigation("dashboard")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("about")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
            >
              Alumni Contributions
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("alumni-directory")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
            >
              Alumni Directory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("events")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
            >
              Events
            </button>
          </li>
        </ul>
      </nav>
      <div className="max-w-4xl mx-auto space-y-6">
        {updates.map((update, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={update.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Title"
                />
                <input
                  type="text"
                  name="date"
                  value={update.date}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Date"
                />
                <textarea
                  name="description"
                  value={update.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Description"
                />
                <button
                  onClick={saveUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-400">{update.title}</h2>
                <p className="text-gray-300 text-sm mb-2">{update.date}</p>
                <p className="text-gray-200">{update.description}</p>
                {isAlumni && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUpdate(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {isAlumni && (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New Update</h2>
          <input
            type="text"
            name="title"
            value={newUpdate.title}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Title"
          />
          <input
            type="text"
            name="date"
            value={newUpdate.date}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Date"
          />
          <textarea
            name="description"
            value={newUpdate.description}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Description"
          />
          <button
            onClick={addUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Update
          </button>
        </div>
      )}
      <div className="mt-8 text-center text-lg text-gray-300">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>
    </div>
  );
}
