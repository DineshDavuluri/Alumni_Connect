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

export default function Events() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
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
      setEvents((prevEvents: Event[]) =>
        prevEvents.map((event, i) =>
          i === index ? { ...event, [name]: value } : event
        )
      );
    } else {
      setNewEvent((prev: Event) => ({ ...prev, [name]: value }));
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
      setEvents((prevEvents: Event[]) => [...prevEvents, newEvent]);
      setNewEvent({ title: "", date: "", location: "", description: "", image: "" });
    }
  };

  const deleteEvent = (index: number) => {
    setEvents((prevEvents: Event[]) =>
      prevEvents.filter((_, i) => i !== index)
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
      <h1 className="text-4xl font-extrabold text-center mb-6">Upcoming Alumni Events</h1>
      <p className="text-center text-lg mb-6">
        Stay updated with exciting tech events and networking opportunities.
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
              onClick={() => handleNavigation("news")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
            >
              Current Trends
            </button>
          </li>
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-gray-700"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Event Title"
                />
                <input
                  type="text"
                  name="date"
                  value={event.date}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Event Date"
                />
                <input
                  type="text"
                  name="location"
                  value={event.location}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Location"
                />
                <textarea
                  name="description"
                  value={event.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  placeholder="Event Description"
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
                  onClick={saveEvent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <>
              <div className="flex flex-row md:flex-row gap-6">
                {event.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-[400px] h-[250px] object-cover rounded-md mb-4 border-2 border-gray-600"
                  />
                )}
                <h2 className="text-2xl font-bold text-blue-400">{event.title}</h2>
                <p className="text-gray-300 text-sm mb-2">
                  {event.date} | {event.location}
                </p>
                <p className="text-gray-400">{event.description}</p>
              </div>  
                {isAlumni && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(index)}
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
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New Event</h2>
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Event Title"
          />
          <input
            type="text"
            name="date"
            value={newEvent.date}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Event Date"
          />
          <input
            type="text"
            name="location"
            value={newEvent.location}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Location"
          />
          <textarea
            name="description"
            value={newEvent.description}
            onChange={(e) => handleInputChange(e, null)}
            className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
            placeholder="Event Description"
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
            onClick={addEvent}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Event
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-lg text-gray-300">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>
    </div>
  );
}
