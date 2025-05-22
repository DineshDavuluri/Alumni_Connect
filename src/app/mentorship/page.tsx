"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Mentorship {
  title: string;
  mentor: string;
  description: string;
  duration: string;
}

export default function Mentorship() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [mentorshipPrograms, setMentorshipPrograms] = useState<Mentorship[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newProgram, setNewProgram] = useState<Mentorship>({
    title: "",
    mentor: "",
    description: "",
    duration: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPrograms = localStorage.getItem("mentorshipPrograms");
      if (savedPrograms) {
        setMentorshipPrograms(JSON.parse(savedPrograms));
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
      localStorage.setItem("mentorshipPrograms", JSON.stringify(mentorshipPrograms));
    }
  }, [mentorshipPrograms, isAlumni]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setMentorshipPrograms((prevPrograms: Mentorship[]) =>
        prevPrograms.map((program, i) =>
          i === index ? { ...program, [name]: value } : program
        )
      );
    } else {
      setNewProgram((prev: Mentorship) => ({ ...prev, [name]: value }));
    }
  };

  const saveProgram = () => {
    setEditingIndex(null);
  };

  const addProgram = () => {
    if (
      newProgram.title &&
      newProgram.mentor &&
      newProgram.description &&
      newProgram.duration
    ) {
      setMentorshipPrograms((prevPrograms: Mentorship[]) => [...prevPrograms, newProgram]);
      setNewProgram({ title: "", mentor: "", description: "", duration: "" });
    }
  };

  const deleteProgram = (index: number) => {
    setMentorshipPrograms((prevPrograms: Mentorship[]) =>
      prevPrograms.filter((_, i) => i !== index)
    );
  };

  const handleNavigation = (path: string) => {
    if(path==='dashboard'&&isAlumni){
      path='Almumnidashboard';
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Alumni Mentorship Programs
      </h1>
      <p className="text-center text-lg mb-6">
        Empower the next generation by sharing your knowledge and expertise.
      </p>
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
        {mentorshipPrograms.map((program, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-gray-700"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={program.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Program Title"
                />
                <input
                  type="text"
                  name="mentor"
                  value={program.mentor}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Mentor Name"
                />
                <textarea
                  name="description"
                  value={program.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Description"
                />
                <input
                  type="text"
                  name="duration"
                  value={program.duration}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Duration"
                />
                <button
                  onClick={saveProgram}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-400">{program.title}</h2>
                <p className="text-gray-300 text-sm mb-1">Mentor: {program.mentor}</p>
                <p className="text-gray-400 mb-1">{program.description}</p>
                <p className="text-gray-400 text-sm italic">Duration: {program.duration}</p>

                {isAlumni && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProgram(index)}
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
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New Mentorship Program</h2>
          <input
            type="text"
            name="title"
            value={newProgram.title}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Program Title"
          />
          <input
            type="text"
            name="mentor"
            value={newProgram.mentor}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Mentor Name"
          />
          <textarea
            name="description"
            value={newProgram.description}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Description"
          />
          <input
            type="text"
            name="duration"
            value={newProgram.duration}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Duration"
          />
          <button
            onClick={addProgram}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Program
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-lg text-gray-300">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>
    </div>
  );
}
