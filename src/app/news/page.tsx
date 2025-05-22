"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface News {
  title: string;
  date: string;
  description: string;
  image?: string;
}

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newNews, setNewNews] = useState<News>({
    title: "",
    date: "",
    description: "",
    image: ""
  });
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNews = localStorage.getItem("news");
      if (savedNews) {
        setNews(JSON.parse(savedNews));
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
      localStorage.setItem("news", JSON.stringify(news));
    }
  }, [news, isAlumni]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setNews((prevNews: News[]) =>
        prevNews.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    } else {
      setNewNews((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number | null
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        if (index !== null) {
          setNews((prevNews: News[]) =>
            prevNews.map((item, i) =>
              i === index ? { ...item, image: imageBase64 } : item
            )
          );
        } else {
          setNewNews((prev) => ({ ...prev, image: imageBase64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNews = () => {
    setEditingIndex(null);
  };

  const addNews = () => {
    if (newNews.title && newNews.date && newNews.description) {
      setNews((prevNews: News[]) => [...prevNews, newNews]);
      setNewNews({ title: "", date: "", description: "", image: "" });
    }
  };

  const deleteNews = (index: number) => {
    setNews((prevNews: News[]) => prevNews.filter((_, i) => i !== index));
  };

  const handleNavigation = (path: string) => {
    if(path==='dashboard'&&isAlumni){
      path='Almumnidashboard';
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Current Trends</h1>

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
        {news.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-gray-700"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={item.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="News Title"
                />
                <input
                  type="text"
                  name="date"
                  value={item.date}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="News Date"
                />
                <textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="News Description"
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
                  onClick={saveNews}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-400">{item.title}</h2>
                <p className="text-gray-300 text-sm mb-2">{item.date}</p>
                <p className="text-gray-200 mb-4">{item.description}</p>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt="News"
                    className="w-[400px] h-[250px] object-cover rounded-md mb-4 border-2 border-gray-600"
                  />
                )}
                {isAlumni && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNews(index)}
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
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New News</h2>
          <input
            type="text"
            name="title"
            value={newNews.title}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="News Title"
          />
          <input
            type="text"
            name="date"
            value={newNews.date}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="News Date"
          />
          <textarea
            name="description"
            value={newNews.description}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="News Description"
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
            onClick={addNews}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add News
          </button>
        </div>
      )}
    </div>
  );
}
