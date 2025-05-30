"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Mentorship {
  title: string;
  mentor: string;
  description: string;
  duration: string;
}

// Static mentorships in engineering field
const STATIC_MENTORSHIPS: Mentorship[] = [
  {
    title: "AI in Healthcare",
    mentor: "Dr. Neha Rao",
    description: "Explore how AI and machine learning are revolutionizing diagnostics and treatment.",
    duration: "6 weeks",
  },
  {
    title: "Sustainable Civil Engineering",
    mentor: "Prof. Rajiv Bansal",
    description: "Learn about green infrastructure and sustainable building practices.",
    duration: "8 weeks",
  },
  {
    title: "Embedded Systems Design",
    mentor: "Anjali Mehta",
    description: "Understand the fundamentals of designing microcontroller-based embedded systems.",
    duration: "5 weeks",
  },
  {
    title: "Cloud Infrastructure & DevOps",
    mentor: "Arjun Iyer",
    description: "Hands-on mentorship on deploying and managing scalable cloud systems.",
    duration: "7 weeks",
  },
  {
    title: "Electric Vehicle Design",
    mentor: "Tanmay Deshmukh",
    description: "Study EV drivetrain, battery management, and sustainability practices.",
    duration: "6 weeks",
  },
  {
    title: "Biomedical Device Innovation",
    mentor: "Dr. Sneha Kapoor",
    description: "Learn the process of designing medical devices and gaining regulatory approvals.",
    duration: "8 weeks",
  },
  {
    title: "Cybersecurity Engineering",
    mentor: "Ravi Menon",
    description: "Master the basics of securing networks, applications, and infrastructure.",
    duration: "6 weeks",
  },
  {
    title: "Data-Driven Smart Cities",
    mentor: "Meera Jain",
    description: "Explore IoT and analytics for smarter, more efficient urban development.",
    duration: "7 weeks",
  },
];

export default function Mentorship() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [mentorshipPrograms, setMentorshipPrograms] = useState<Mentorship[]>(STATIC_MENTORSHIPS);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newProgram, setNewProgram] = useState<Mentorship>({
    title: "",
    mentor: "",
    description: "",
    duration: "",
  });

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setMentorshipPrograms((prev) =>
        prev.map((program, i) =>
          i === index ? { ...program, [name]: value } : program
        )
      );
    } else {
      setNewProgram((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveProgram = () => setEditingIndex(null);

  const addProgram = () => {
    if (
      newProgram.title &&
      newProgram.mentor &&
      newProgram.description &&
      newProgram.duration
    ) {
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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Alumni Mentorship Programs</h1>
      <p className="text-center text-lg mb-6">
        Empower the next generation by sharing your knowledge and expertise.
      </p>

      <nav className="w-full mb-8">
        <ul className="flex justify-around text-lg font-semibold">
          {["dashboard", "about", "alumni-directory", "events"].map((path, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavigation(path)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-white hover:text-black transition"
              >
                {path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto space-y-10">
        {mentorshipPrograms.map((program, index) => (
          <div
            key={index}
            className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-start gap-6 bg-gray-900 rounded-2xl p-6 shadow-md`}
          >
            <div className="flex-1">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={program.title}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
                    placeholder="Program Title"
                  />
                  <input
                    type="text"
                    name="mentor"
                    value={program.mentor}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
                    placeholder="Mentor Name"
                  />
                  <textarea
                    name="description"
                    value={program.description}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    name="duration"
                    value={program.duration}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
                    placeholder="Duration"
                  />
                  <button
                    onClick={saveProgram}
                    className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-300"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{program.title}</h2>
                  <p className="text-gray-400 text-sm mb-1">Mentor: {program.mentor}</p>
                  <p className="text-gray-300 mb-1">{program.description}</p>
                  <p className="text-gray-400 text-sm italic">Duration: {program.duration}</p>

                  {isAlumni && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProgram(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAlumni && (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-900 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Mentorship Program</h2>
          <input
            type="text"
            name="title"
            value={newProgram.title}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
            placeholder="Program Title"
          />
          <input
            type="text"
            name="mentor"
            value={newProgram.mentor}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
            placeholder="Mentor Name"
          />
          <textarea
            name="description"
            value={newProgram.description}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
            placeholder="Description"
          />
          <input
            type="text"
            name="duration"
            value={newProgram.duration}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-800 text-white rounded-md mb-2"
            placeholder="Duration"
          />
          <button
            onClick={addProgram}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
          >
            Add Program
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-lg text-gray-400">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>
    </div>
  );
}
