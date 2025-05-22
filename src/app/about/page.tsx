"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface Contribution {
  alumniName: string;
  contribution: string;
  date: string;
  image?: string;
}

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
    if (saved) setContributions(JSON.parse(saved));

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
      localStorage.setItem("contributions", JSON.stringify(contributions));
    }
  }, [contributions, isAlumni]);

  const handleNavigation = (path: string) => {
    if(path==='dashboard' && isAlumni){
      path='Almumnidashboard';
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">Alumni Contributions</h1>

      <nav className="flex justify-center gap-4 mb-10">
        {["dashboard", "news", "alumni-directory", "events"].map((path, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigation(path)}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
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

      <div className="max-w-5xl mx-auto space-y-6">
        {contributions.map((contrib, index) => (
          <div
            key={index}
            className="flex bg-black/30 p-6 rounded-2xl shadow-xl backdrop-blur-sm hover:scale-[1.01] transition"
          >
            {contrib.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={contrib.image}
                alt="Alumni"
                className="w-[300px] h-[200px] object-cover rounded-xl border-2 border-gray-600 mr-6"
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
                    className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                    placeholder="Alumni Name"
                  />
                  <input
                    type="text"
                    name="date"
                    value={contrib.date}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                    placeholder="Date"
                  />
                  <textarea
                    name="contribution"
                    value={contrib.contribution}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                    placeholder="Contribution"
                  />
                  <label className="block mb-2 text-sm font-medium text-yellow-300">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="block w-full text-sm text-white bg-gray-700 rounded-md border border-gray-600 p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 mt-2"
                  />
                  </label>

                  <button
                    onClick={saveContribution}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-yellow-300">{contrib.alumniName}</h2>
                  <p className="text-gray-300 text-sm mb-2">{contrib.date}</p>
                  <p className="text-white">{contrib.contribution}</p>
                  {isAlumni && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteContribution(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-black/30 rounded-2xl shadow-xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">Add New Contribution</h2>
          <input
            type="text"
            name="alumniName"
            value={newContribution.alumniName}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Alumni Name"
          />
          <input
            type="text"
            name="date"
            value={newContribution.date}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Date"
          />
          <textarea
            name="contribution"
            value={newContribution.contribution}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Contribution"
          />
          <label className="block mb-2 text-sm font-medium text-yellow-300">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, null)}
              className="block w-full text-sm text-white bg-gray-700 rounded-md border border-gray-600 p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 mt-2"
            />
            </label>
          <button
            onClick={addContribution}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Contribution
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-lg text-gray-300">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>

      {successMessage && (
        <div className="mt-4 text-center text-green-400 font-medium">{successMessage}</div>
      )}
    </div>
  );
}
