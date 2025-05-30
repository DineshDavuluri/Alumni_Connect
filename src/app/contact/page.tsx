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
    if (path === "dashboard" && isAlumni) {
      path = "Almumnidashboard";
    }
    if (path === "AlumniContributions") {
      path = "about";
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-center text-base md:text-lg text-gray-600 mb-6">
        Reach out to us through the following contact details.
      </p>

      <nav className="w-full mb-8">
        <ul className="flex flex-col md:flex-row justify-center gap-3 md:gap-6 text-sm md:text-base font-medium text-gray-800">
          {["dashboard", "about", "alumni-directory", "events"].map((p, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavigation(p)}
                className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-200 transition"
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

      <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          {editing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-gray-700">{phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-gray-700">{email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Address</label>
          {editing ? (
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-gray-700">{address}</p>
          )}
        </div>

        {isAlumni && (
          <div className="text-right">
            <button
              onClick={() => setEditing(!editing)}
              className={`px-4 py-2 rounded-md font-medium text-white ${
                editing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editing ? "Save Changes" : "Edit Contact Info"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-700">
        Logged in as: <span className="font-semibold">{username}</span>
      </div>
    </div>
  );
}
