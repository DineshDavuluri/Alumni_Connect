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
    title: "Agentic AI",
    date: "2025-05-01",
    description: "AI systems capable of autonomous decision-making and task execution.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Artificial_Intelligence_%26_AI_%26_Machine_Learning_-_30212411048.jpg/640px-Artificial_Intelligence_%26_AI_%26_Machine_Learning_-_30212411048.jpg"
  },
  {
    title: "Post-Quantum Cryptography",
    date: "2025-04-20",
    description: "New cryptographic algorithms designed to resist quantum computing attacks.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Quantum_Computer.jpg/640px-Quantum_Computer.jpg"
  },
  {
    title: "Spatial Computing",
    date: "2025-03-15",
    description: "Integration of physical and digital worlds via AR/VR for immersive experiences.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/VR_Gaming.jpg/640px-VR_Gaming.jpg"
  },
  {
    title: "AI Governance Platforms",
    date: "2025-05-10",
    description: "Tools and frameworks for ethical and accountable AI implementation.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Artificial_Intelligence_robot.png/640px-Artificial_Intelligence_robot.png"
  },
  {
    title: "Ambient Invisible Intelligence",
    date: "2025-02-22",
    description: "AI integrated invisibly in environments to respond to user context automatically.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Smart_home_devices.jpg/640px-Smart_home_devices.jpg"
  },
  {
    title: "Polyfunctional Robots",
    date: "2025-01-12",
    description: "Robots that can perform multiple tasks across various domains effectively.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Humanoid_Robot.jpg/640px-Humanoid_Robot.jpg"
  },
  {
    title: "Disinformation Security",
    date: "2025-03-05",
    description: "Technologies developed to combat the spread of false or misleading information.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Misinformation.jpg/640px-Misinformation.jpg"
  },
  {
    title: "Energy-Efficient Computing",
    date: "2025-04-02",
    description: "Advancements in hardware and software to reduce computing's energy footprint.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Energy_saving_icon.png/640px-Energy_saving_icon.png"
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
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Technology Trends</h1>
      <nav className="w-full mb-6 md:mb-8">
        <ul className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium">
          <li><button onClick={() => handleNavigation("dashboard")} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Home</button></li>
          <li><button onClick={() => handleNavigation("research")} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Research</button></li>
          <li><button onClick={() => handleNavigation("events")} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Events</button></li>
        </ul>
      </nav>

      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        {trends.map((item, index) => (
          <div key={index} className={`p-4 bg-white rounded-lg shadow-md flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
            {editingIndex === index ? (
              <>
                <input name="title" value={item.title} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Trend Title" />
                <input name="date" value={item.date} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Date" />
                <textarea name="description" value={item.description} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Description" />
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className="w-full mb-2" />
                <button onClick={saveTrend} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-blue-700">{item.title}</h2>
                <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                <p className="mb-3 text-gray-700">{item.description}</p>
                {item.image && <img src={item.image} alt="Trend" className="w-full h-48 object-cover rounded mb-4 border border-gray-300" />}
                {isAlumni && (
                  <div className="flex space-x-3">
                    <button onClick={() => setEditingIndex(index)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                    <button onClick={() => deleteTrend(index)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isAlumni && (
        <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Trend</h2>
          <input name="title" value={newTrend.title} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Title" />
          <input name="date" value={newTrend.date} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Date" />
          <textarea name="description" value={newTrend.description} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Description" />
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, null)} className="w-full mb-2" />
          <button onClick={addTrend} className="px-4 py-2 bg-green-600 text-white rounded">Add Trend</button>
        </div>
      )}
    </div>
  );
}
