"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface Event {
  title: string;
  date: string;
  location: string;
  description: string;
  image?: string;
}

const defaultEvents: Event[] = [
  {
    title: "Google Cloud DevFest",
    date: "2025-07-15",
    location: "OAT Auditorium, Tech Campus",
    description: "Hands-on sessions on GCP, Firebase, and AI tools with Google Developer Experts.",
    image: "https://commons.wikimedia.org/wiki/File:Google_cloud.png",
  },
  {
    title: "Microsoft Azure AI Bootcamp",
    date: "2025-08-10",
    location: "CS Lab 3, Innovation Building",
    description: "Interactive workshop on building intelligent apps using Microsoft Azure services.",
    image: "https://logos-world.net/wp-content/uploads/2021/03/Microsoft-Azure-Logo.png",
  },
  {
    title: "IBM Quantum Computing Seminar",
    date: "2025-06-20",
    location: "Seminar Hall 1",
    description: "Learn the basics of quantum computing and Qiskit with IBM researchers.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    title: "Amazon AWS Hackday",
    date: "2025-09-05",
    location: "Main Hall",
    description: "24-hour coding challenge focused on AWS Lambda, DynamoDB, and microservices.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  },
  {
    title: "Meta AR/VR Experience Expo",
    date: "2025-10-12",
    location: "Innovation Zone",
    description: "Explore the future of metaverse tech with Meta's AR/VR devices and demos.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/OpenAI_Logo.svg",
  },
  {
    title: "LinkedIn Career Day",
    date: "2025-11-02",
    location: "Career Services Hall",
    description: "Sessions on professional branding, networking tips, and resume building.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  },
  {
    title: "OpenAI AI Ethics Discussion",
    date: "2025-07-30",
    location: "Lecture Theatre 4",
    description: "Panel discussion with experts on ethical implications of AI deployment.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/OpenAI_Logo.svg",
  },
  {
    title: "Adobe Creative Jam",
    date: "2025-08-25",
    location: "Design Studio, Block D",
    description: "Creative challenge using Adobe tools for UI/UX design and visual storytelling.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Adobe_Systems_logo_and_wordmark.svg",
  },
  {
    title: "GitHub Open Source Fest",
    date: "2025-09-18",
    location: "Hackerspace Lab",
    description: "Collaborate on open-source projects, learn Git workflows, and contribute live.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  },
];

export default function Events() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: "",
    location: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        localStorage.setItem("events", JSON.stringify(defaultEvents));
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
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events, isAlumni]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setEvents((prevEvents) =>
        prevEvents.map((event, i) =>
          i === index ? { ...event, [name]: value } : event
        )
      );
    } else {
      setNewEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number | null
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      if (index !== null) {
        setEvents((prevEvents) =>
          prevEvents.map((event, i) =>
            i === index ? { ...event, image: base64Image } : event
          )
        );
      } else {
        setNewEvent((prev) => ({ ...prev, image: base64Image }));
      }
    };
    reader.readAsDataURL(file);
  };

  const saveEvent = () => {
    setEditingIndex(null);
  };

  const addEvent = () => {
    if (
      newEvent.title &&
      newEvent.date &&
      newEvent.location &&
      newEvent.description
    ) {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setNewEvent({ title: "", date: "", location: "", description: "", image: "" });
    }
  };

  const deleteEvent = (index: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((_, i) => i !== index)
    );
  };

  const handleNavigation = (path: string) => {
    if (path === "dashboard" && isAlumni) {
      path = "Almumnidashboard";
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Alumni Events</h1>
        <p className="text-base md:text-lg text-gray-600">Stay updated with tech events and networking opportunities.</p>
      </header>

      <nav className="mb-6">
        <ul className="flex flex-wrap justify-center gap-4">
          {['dashboard', 'about', 'alumni-directory', 'news'].map((page) => (
            <li key={page}>
              <button
                onClick={() => handleNavigation(page)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm md:text-base rounded"
              >
                {page.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="space-y-6 max-w-5xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
          >
            {editingIndex === index ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 border rounded"
                  placeholder="Event Title"
                />
                <input
                  type="text"
                  name="date"
                  value={event.date}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 border rounded"
                  placeholder="Event Date"
                />
                <input
                  type="text"
                  name="location"
                  value={event.location}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 border rounded"
                  placeholder="Location"
                />
                <textarea
                  name="description"
                  value={event.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 border rounded"
                  placeholder="Event Description"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                />
                <button
                  onClick={saveEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="md:flex gap-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full md:w-64 h-40 object-cover rounded mb-2 md:mb-0"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-sm text-gray-500">{event.date} | {event.location}</p>
                  <p className="mt-2 text-sm">{event.description}</p>
                </div>
              </div>
            )}
            {isAlumni && editingIndex !== index && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {isAlumni && (
        <section className="mt-10 max-w-5xl mx-auto p-4 md:p-6 bg-gray-100 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Add New Event</h2>
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full p-2 border rounded"
              placeholder="Event Title"
            />
            <input
              type="text"
              name="date"
              value={newEvent.date}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full p-2 border rounded"
              placeholder="Event Date"
            />
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full p-2 border rounded"
              placeholder="Location"
            />
            <textarea
              name="description"
              value={newEvent.description}
              onChange={(e) => handleInputChange(e, null)}
              className="w-full p-2 border rounded"
              placeholder="Event Description"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, null)}
            />
            <button
              onClick={addEvent}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Event
            </button>
          </div>
        </section>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        Logged in as: <span className="font-semibold text-gray-700">{username}</span>
      </footer>
    </div>
  );
}
