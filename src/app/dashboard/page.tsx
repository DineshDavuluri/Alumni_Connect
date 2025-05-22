"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [packages, setPackages] = useState<
    { id: string; company: string; package: string; year: string }[]
  >([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      setUsername(user);
    } else {
      router.push("/");
    }
    const storedPackages = localStorage.getItem("highestPackages");
    if (storedPackages) {
      setPackages(JSON.parse(storedPackages));
    }
  }, [router]);

  const handleSignOut = () => {
    router.push("/");
  };

  const handleSearchAlumni = () => {
    router.push(`/alumni-directory?username=${encodeURIComponent(username)}`);
  };

  const handleViewNews = () => {
    router.push(`/news?username=${encodeURIComponent(username)}`);
  };

  const handleMentorship = () => {
    router.push(`/mentorship?username=${encodeURIComponent(username)}`);
  };

  const handleViewAllUpdates = () => {
    router.push(`/updates?username=${encodeURIComponent(username)}`);
  };

  const handleAbout = () => {
    router.push(`/about?username=${encodeURIComponent(username)}`);
  };

  const handleEvents = () => {
    router.push(`/events?username=${encodeURIComponent(username)}`);
  };

  const handleContact = () => {
    router.push(`/contact?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex z-50 items-center justify-between p-4 bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <Image
            src="/laralogo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            LARA CONNECT
          </h1>
        </div>
        <nav className="flex space-x-2">
          <button
            onClick={handleAbout}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            AlumniContributions
          </button>
          <button
            onClick={handleEvents}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Events
          </button>
          <button
            onClick={handleViewNews}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            CurrentTrends
          </button>
          <button
            onClick={handleContact}
            className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Contact
          </button>
        </nav>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          Sign Out
        </button>
        <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Menu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-300">
                View B.Tech Alumni by Batch
              </h3>
              <p className="text-gray-400">
                Select a batch to browse alumni profiles.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 gap-2 z-50 relative">
  {["2024", "2023", "2022", "2021", "2020", "2019", "2018","2017"].map((batch) => (
    <div
      key={batch}
      onClick={() =>
        router.push(
          `/alumni-directory?username=${encodeURIComponent(username)}&batch=${batch}`
        )
      }
      className="cursor-pointer bg-gray-800 text-white rounded-lg p-2 text-center text-sm shadow hover:bg-blue-600 transition duration-200"
    >
       {batch}
    </div>
  ))}
</div>

        </div>
      </header>

      <section className="relative flex items-center justify-center h-40 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight animate-fade-in">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              {username}
            </span>
          </h2>
          <p className="mt-1 text-base sm:text-lg text-gray-200 animate-fade-in-delayed">
            Connect with your Alumni and expand your professional network.
          </p>
        </div>
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
      </section>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 space-x-15">
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
  <h3 className="text-lg font-semibold text-blue-300 mb-2 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]">
    Highest Packages
  </h3>
  <div className="absolute top-8 left-0 h-8 w-16 bg-gradient-to-r from-gray-800/50 via-gray-800/0 to-transparent z-10" />
  <div className="absolute top-8 right-0 h-8 w-16 bg-gradient-to-l from-gray-800/50 via-gray-800/0 to-transparent z-10" />

  <div className="overflow-hidden relative h-8">
    <div
      className="flex animate-marquee whitespace-nowrap"
      style={{ animationDuration: `${packages.length * 3}s` }}
    >
      {packages.length > 0 ? (
        packages.map((pkg) => (
          <span
            key={pkg.id}
            className="mx-6 text-blue-200 text-base font-bold tracking-wide drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
          >
            {pkg.company}: {pkg.package} LPA ({pkg.year})
          </span>
        ))
      ) : (
        <span className="text-gray-400">No packages available</span>
      )}
    </div>
  </div>
</div>


          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 10c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-300">Alumni List</h3>
                <p className="text-gray-400">
                  Search the directory to connect with fellow alumni.
                </p>
              </div>
            </div>
            <button
              onClick={handleSearchAlumni}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Search Now
            </button>
          </div>
          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l2 4h4a2 2 0 012 2v8a2 2 0 01-2 2zM7 10h10M7 14h6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-300">
                  Current Trends
                </h3>
                <p className="text-gray-400">
                  Read the latest updates from our alumni community.
                </p>
              </div>
            </div>
            <button
              onClick={handleViewNews}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-300"
            >
              Read More
            </button>
          </div>

          <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-300">Mentorship</h3>
                <p className="text-gray-400">
                  Find a mentor or offer your expertise to other alumni.
                </p>
              </div>
            </div>
            <button
              onClick={handleMentorship}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="md:col-span-1 space-y-6 flex flex-col items-center">
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/R0FiU-PQ8XM?playlist=R0FiU-PQ8XM&loop=1"
              title="Alumni Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button
            onClick={handleViewAllUpdates}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg"
          >
            <span className="text-lg font-semibold">View All Updates</span>
          </button>
        </div>
      </main>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}