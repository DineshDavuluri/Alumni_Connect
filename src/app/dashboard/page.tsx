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

  const navActions = {
    signOut: () => router.push("/"),
    alumniDirectory: () => router.push(`/alumni-directory?username=${encodeURIComponent(username)}`),
    news: () => router.push(`/news?username=${encodeURIComponent(username)}`),
    mentorship: () => router.push(`/mentorship?username=${encodeURIComponent(username)}`),
    updates: () => router.push(`/updates?username=${encodeURIComponent(username)}`),
    about: () => router.push(`/about?username=${encodeURIComponent(username)}`),
    events: () => router.push(`/events?username=${encodeURIComponent(username)}`),
    contact: () => router.push(`/contact?username=${encodeURIComponent(username)}`),
    batch: (batch: string) => router.push(`/alumni-directory?username=${encodeURIComponent(username)}&batch=${batch}`),
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <Image src="/laralogo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <h1 className="text-xl font-semibold text-blue-700">LARA CONNECT</h1>
        </div>
        <nav className="flex flex-wrap justify-center gap-2 mt-2 sm:mt-0">
          <NavButton label="Contributions" onClick={navActions.about} />
          <NavButton label="Events" onClick={navActions.events} />
          <NavButton label="Trends" onClick={navActions.news} />
          <NavButton label="Contact" onClick={navActions.contact} />
          <NavButton label="Sign Out" onClick={navActions.signOut} />
        </nav>
      </header>

      <section className="flex items-center justify-center h-32 bg-blue-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome, {username}</h2>
          <p className="text-sm text-gray-600">Connect and grow with your alumni network.</p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Highest Packages">
            <div className="overflow-hidden relative h-8">
              <div
                className="flex animate-marquee whitespace-nowrap"
                style={{ animationDuration: `${packages.length * 3}s` }}
              >
                {packages.length > 0 ? (
                  packages.map(pkg => (
                    <span key={pkg.id} className="mx-4 text-sm font-medium text-blue-700">
                      {pkg.company}: {pkg.package} LPA ({pkg.year})
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No packages available</span>
                )}
              </div>
            </div>
          </Card>

          <Card title="Alumni Directory" iconColor="blue">
            <p className="text-sm text-gray-600">Search and connect with fellow alumni.</p>
            <button onClick={navActions.alumniDirectory} className="mt-3 btn-primary">Search Now</button>
          </Card>

          <Card title="Current Trends" iconColor="pink">
            <p className="text-sm text-gray-600">Get the latest updates from the alumni network.</p>
            <button onClick={navActions.news} className="mt-3 btn-secondary">Read More</button>
          </Card>

          <Card title="Mentorship" iconColor="yellow">
            <p className="text-sm text-gray-600">Offer or seek mentorship opportunities.</p>
            <button onClick={navActions.mentorship} className="mt-3 btn-tertiary">Get Started</button>
          </Card>
        </div>

        <aside className="space-y-6">
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/R0FiU-PQ8XM?playlist=R0FiU-PQ8XM&loop=1"
              title="Alumni Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button onClick={navActions.updates} className="btn-primary w-full">View All Updates</button>
        </aside>
      </main>

      <section className="bg-white px-4 py-6 mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 text-white p-2 rounded">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700">View Alumni by Batch</h3>
              <p className="text-sm text-gray-500">Browse alumni by graduation year</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(batch => (
              <div
                key={batch}
                onClick={() => navActions.batch(batch)}
                className="cursor-pointer bg-gray-100 hover:bg-blue-100 text-center py-2 rounded text-sm border border-gray-300"
              >
                {batch}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee linear infinite;
        }
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }
        .btn-primary:hover {
          background-color: #2563eb;
        }
        .btn-secondary {
          background-color: #ec4899;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }
        .btn-secondary:hover {
          background-color: #db2777;
        }
        .btn-tertiary {
          background-color: #f59e0b;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }
        .btn-tertiary:hover {
          background-color: #d97706;
        }
      `}</style>
    </div>
  );
}

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-gray-700 font-medium px-3 py-2 hover:bg-blue-50 rounded"
    >
      {label}
    </button>
  );
}

function Card({ title, children, iconColor = "gray" }: { title: string; children: React.ReactNode; iconColor?: string }) {
  return (
    <div className="p-5 bg-white rounded-lg shadow border border-gray-200">
      <h3 className={`text-lg font-semibold mb-2 text-${iconColor}-600`}>{title}</h3>
      {children}
    </div>
  );
}