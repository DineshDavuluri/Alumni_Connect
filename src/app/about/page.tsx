"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface Contribution {
  alumniName: string;
  contribution: string;
  date: string;
  image?: string;
}

const staticContributions: Contribution[] = [
  {
    alumniName: "Ravi Kumar",
    contribution: "Donated ₹2,00,000 for lab equipment",
    date: "2023-04-15",
    image: ""
  },
  {
    alumniName: "Anjali Sharma",
    contribution: "Organized mentorship sessions for final year students",
    date: "2023-06-10",
    image: ""
  },
  {
    alumniName: "Sunil Mehta",
    contribution: "Sponsored college tech fest 2024",
    date: "2024-01-20",
    image: ""
  }
];

export default function About() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [newContribution, setNewContribution] = useState<Contribution>({
    alumniName: "",
    contribution: "",
    date: "",
    image: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("contributions");
    if (saved) setContributions([...staticContributions, ...JSON.parse(saved)]);
    else setContributions(staticContributions);

    const params = new URLSearchParams(window.location.search);
    const user = params.get("username");
    if (user) {
      setUsername(user);
      const numPrefix = parseInt(user.slice(0, 2), 10);
      setIsAlumni(!isNaN(numPrefix) && numPrefix <= 20);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (isAlumni) {
      const customContributions = contributions.filter(c => !staticContributions.includes(c));
      localStorage.setItem("contributions", JSON.stringify(customContributions));
    }
  }, [contributions, isAlumni]);

  const handleNavigation = (path: string) => {
    if (path === 'dashboard' && isAlumni) {
      path = 'Almumnidashboard';
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setContributions((prev) =>
        prev.map((c, i) => (i === index ? { ...c, [name]: value } : c))
      );
    } else {
      setNewContribution((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number | null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() || "";
      if (index !== null) {
        setContributions((prev) =>
          prev.map((c, i) => (i === index ? { ...c, image: base64 } : c))
        );
      } else {
        setNewContribution((prev) => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addContribution = () => {
    const { alumniName, contribution, date } = newContribution;
    if (alumniName && contribution && date) {
      setContributions((prev) => [...prev, newContribution]);
      setNewContribution({ alumniName: "", contribution: "", date: "", image: "" });
      setSuccessMessage("Contribution added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert("Please fill all fields.");
    }
  };

  const saveContribution = () => {
    setEditingIndex(null);
    setSuccessMessage("Contribution updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const deleteContribution = (index: number) => {
    setContributions(contributions.filter((_, i) => i !== index));
    setSuccessMessage("Contribution deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Alumni Contributions</h1>

      <nav className="flex justify-center gap-2 flex-wrap mb-8">
        {["dashboard", "news", "alumni-directory", "events"].map((path, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigation(path)}
            className="px-3 py-2 text-sm font-medium text-gray-800 border border-gray-400 rounded hover:bg-gray-200"
          >
            {path === "dashboard"
              ? "Home"
              : path === "news"
              ? "Current Trends"
              : path === "alumni-directory"
              ? "Alumni Directory"
              : "Events"}
          </button>
        ))}
      </nav>

      <div className="max-w-5xl mx-auto space-y-8">
        {contributions.map((contrib, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-300`}
          >
            {contrib.image && (
              <img
                src={contrib.image}
                alt="Alumni"
                className="w-full md:w-[250px] h-[180px] object-cover rounded-md mb-4 md:mb-0 md:mr-6"
              />
            )}
            <div className="flex-1">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    name="alumniName"
                    value={contrib.alumniName}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Alumni Name"
                  />
                  <input
                    type="text"
                    name="date"
                    value={contrib.date}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Date"
                  />
                  <textarea
                    name="contribution"
                    value={contrib.contribution}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Contribution"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={saveContribution}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{contrib.alumniName}</h2>
                  <p className="text-sm text-gray-600 mb-1">{contrib.date}</p>
                  <p>{contrib.contribution}</p>
                  {isAlumni && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteContribution(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-gray-300">
          <h2 className="text-xl font-semibold mb-4">Add New Contribution</h2>
          <input
            type="text"
            name="alumniName"
            value={newContribution.alumniName}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Alumni Name"
          />
          <input
            type="text"
            name="date"
            value={newContribution.date}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Date"
          />
          <textarea
            name="contribution"
            value={newContribution.contribution}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Contribution"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, null)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={addContribution}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Contribution
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-600">
        Logged in as: <span className="font-semibold text-gray-800">{username}</span>
      </div>

      {successMessage && (
        <div className="mt-4 text-center text-green-600 font-medium">{successMessage}</div>
      )}
    </div>
  );
}