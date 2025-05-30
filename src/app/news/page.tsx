"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Trend {
  title: string;
  date: string;
  description: string;
  image?: string;
}

const initialTrends: Trend[] = [
  {
    title: "AI-Driven Development",
    date: "2025-05-01",
    description: "AI tools are transforming software development by automating tasks and improving code quality.",
    image: "https://via.placeholder.com/400x250.png?text=AI+Development"
  },
  {
    title: "Quantum Computing Breakthroughs",
    date: "2025-04-20",
    description: "Major strides in quantum computing could revolutionize problem-solving in cryptography and materials science.",
    image: "https://via.placeholder.com/400x250.png?text=Quantum+Computing"
  }
];

export default function TechnologyTrends() {
  const router = useRouter();
  const [trends, setTrends] = useState<Trend[]>(initialTrends);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTrend, setNewTrend] = useState<Trend>({ title: "", date: "", description: "", image: "" });
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const user = urlParams.get("username");
      if (user) {
        setUsername(user);
        const numPrefix = parseInt(user.slice(0, 2), 10);
        setIsAlumni(!isNaN(numPrefix) && numPrefix <= 20);
      }
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, index: number | null) => {
    const { name, value } = e.target;
    if (index !== null) {
      setTrends(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
    } else {
      setNewTrend(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number | null) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        if (index !== null) {
          setTrends(prev => prev.map((item, i) => i === index ? { ...item, image: imageBase64 } : item));
        } else {
          setNewTrend(prev => ({ ...prev, image: imageBase64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveTrend = () => setEditingIndex(null);
  const addTrend = () => {
    if (newTrend.title && newTrend.date && newTrend.description) {
      setTrends(prev => [...prev, newTrend]);
      setNewTrend({ title: "", date: "", description: "", image: "" });
    }
  };
  const deleteTrend = (index: number) => setTrends(prev => prev.filter((_, i) => i !== index));
  const handleNavigation = (path: string) => {
    if (path === "dashboard" && isAlumni) path = "Almumnidashboard";
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Technology Trends</h1>
      <nav className="w-full mb-8">
        <ul className="flex justify-around text-lg font-semibold">
          <li><button onClick={() => handleNavigation("dashboard")} className="px-4 py-2 bg-blue-300 rounded-md hover:bg-indigo-700">Home</button></li>
          <li><button onClick={() => handleNavigation("research")} className="px-4 py-2 bg-blue-300 rounded-md hover:bg-indigo-700">Research</button></li>
          <li><button onClick={() => handleNavigation("events")} className="px-4 py-2 bg-blue-300 rounded-md hover:bg-indigo-700">Events</button></li>
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {trends.map((item, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-2xl shadow-lg transition hover:scale-105 hover:bg-gray-700">
            {editingIndex === index ? (
              <>
                <input name="title" value={item.title} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Trend Title" />
                <input name="date" value={item.date} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Date" />
                <textarea name="description" value={item.description} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Description" />
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className="w-full mb-2" />
                <button onClick={saveTrend} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-green-400">{item.title}</h2>
                <p className="text-gray-300 text-sm mb-2">{item.date}</p>
                <p className="text-gray-200 mb-4">{item.description}</p>
                {item.image && <img src={item.image} alt="Trend" className="w-full h-[250px] object-cover rounded-md mb-4 border-2 border-gray-600" />}
                {isAlumni && (
                  <div className="flex space-x-3">
                    <button onClick={() => setEditingIndex(index)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Edit</button>
                    <button onClick={() => deleteTrend(index)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isAlumni && (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Add New Trend</h2>
          <input name="title" value={newTrend.title} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Title" />
          <input name="date" value={newTrend.date} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Date" />
          <textarea name="description" value={newTrend.description} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Description" />
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, null)} className="w-full mb-2" />
          <button onClick={addTrend} className="px-4 py-2 bg-green-500 text-white rounded-md">Add Trend</button>
        </div>
      )}
    </div>
  );
}