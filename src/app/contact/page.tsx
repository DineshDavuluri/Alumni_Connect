"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Contact() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);

  const [phone, setPhone] = useState("+91 70320 13570");
  const [email, setEmail] = useState("dineshdavuluri16@gmail.com");
  const [address, setAddress] = useState("VLITS, Vadlamudi, Guntur");

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      setUsername(user);
      const prefix = parseInt(user.slice(0, 2), 10);
      setIsAlumni(!isNaN(prefix) && prefix <= 20);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleNavigation = (path: string) => {
    if(path==='dashboard'&&isAlumni){
      path='Almumnidashboard';
    }
    if (path === "AlumniContributions") {
      path = "about";
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center mb-4">Contact Us</h1>
      <p className="text-center text-lg mb-6 text-gray-300">
        Get in touch with us through the following contact details.
      </p>

      <nav className="w-full mb-8">
        <ul className="flex justify-around text-lg font-semibold">
          {["dashboard", "about", "alumni-directory", "events"].map((p, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavigation(p)}
                className="px-4 py-2 bg-blue-300 rounded-md hover:bg-pink-700 transition"
              >
                {p === "dashboard"
                  ? "Home"
                  : p === "about"
                  ? "Alumni Contributions"
                  : p === "alumni-directory"
                  ? "Alumni Directory"
                  : "Events"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Phone</h2>
          {editing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white"
            />
          ) : (
            <p className="text-gray-300">{phone}</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Email</h2>
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white"
            />
          ) : (
            <p className="text-gray-300">{email}</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Address</h2>
          {editing ? (
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white"
            />
          ) : (
            <p className="text-gray-300">{address}</p>
          )}
        </div>

        {isAlumni && (
          <button
            onClick={() => setEditing(!editing)}
            className={`mt-4 px-4 py-2 rounded-md font-semibold transition ${
              editing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {editing ? "Save Changes" : "Edit Contact Info"}
          </button>
        )}
      </div>

      <div className="mt-8 text-center text-lg text-black">
        Logged in as: <span className="font-semibold">{username}</span>
      </div>
    </div>
  );
}
