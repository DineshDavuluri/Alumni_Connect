"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Mentorship {
  title: string;
  mentor: string;
  description: string;
  duration: string;
}

const staticPrograms: Mentorship[] = [
  {
    title: "Career Growth Mentorship",
    mentor: "John Doe",
    description: "Guidance on progressing in your professional journey.",
    duration: "6 weeks",
  },
  {
    title: "Tech Industry Insights",
    mentor: "Jane Smith",
    description: "Understanding the current tech trends and career paths.",
    duration: "4 weeks",
  },
];

export default function Mentorship() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("guest123"); // Example username
  const [isAlumni, setIsAlumni] = useState<boolean>(true); // Assume user is alumni for demo
  const [mentorshipPrograms, setMentorshipPrograms] = useState<Mentorship[]>(staticPrograms);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newProgram, setNewProgram] = useState<Mentorship>({
    title: "",
    mentor: "",
    description: "",
    duration: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setMentorshipPrograms((prev) =>
        prev.map((program, i) => (i === index ? { ...program, [name]: value } : program))
      );
    } else {
      setNewProgram((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveProgram = () => {
    setEditingIndex(null);
  };

  const addProgram = () => {
    if (Object.values(newProgram).every((val) => val.trim() !== "")) {
      setMentorshipPrograms((prev) => [...prev, newProgram]);
      setNewProgram({ title: "", mentor: "", description: "", duration: "" });
    }
  };

  const deleteProgram = (index: number) => {
    setMentorshipPrograms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNavigation = (path: string) => {
    if (path === "dashboard" && isAlumni) path = "Almumnidashboard";
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-2">
          Mentorship Programs
        </h1>
        <p className="text-center text-base md:text-lg">
          Connect and empower through mentorship.
        </p>
      </header>

      <nav className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { label: "Home", path: "dashboard" },
          { label: "Contributions", path: "about" },
          { label: "Directory", path: "alumni-directory" },
          { label: "Events", path: "events" },
        ].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm md:text-base"
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="max-w-3xl mx-auto space-y-6">
        {mentorshipPrograms.map((program, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow">
            {editingIndex === index ? (
              <div className="space-y-2">
                <input
                  name="title"
                  value={program.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full border p-2 rounded"
                  placeholder="Title"
                />
                <input
                  name="mentor"
                  value={program.mentor}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full border p-2 rounded"
                  placeholder="Mentor"
                />
                <textarea
                  name="description"
                  value={program.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full border p-2 rounded"
                  placeholder="Description"
                />
                <input
                  name="duration"
                  value={program.duration}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full border p-2 rounded"
                  placeholder="Duration"
                />
                <button
                  onClick={saveProgram}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">{program.title}</h2>
                <p className="text-sm text-gray-600">Mentor: {program.mentor}</p>
                <p className="text-sm mt-1">{program.description}</p>
                <p className="text-sm text-gray-500 mt-1">Duration: {program.duration}</p>
                {isAlumni && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProgram(index)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isAlumni && (
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-3">Add New Program</h2>
            <input
              name="title"
              value={newProgram.title}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Title"
            />
            <input
              name="mentor"
              value={newProgram.mentor}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Mentor"
            />
            <textarea
              name="description"
              value={newProgram.description}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Description"
            />
            <input
              name="duration"
              value={newProgram.duration}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Duration"
            />
            <button
              onClick={addProgram}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        )}
      </main>

      <footer className="mt-10 text-center text-sm text-gray-500">
        Logged in as: <span className="font-semibold text-gray-700">{username}</span>
      </footer>
    </div>
  );
}
