"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface Alumni {
  name: string;
  graduationYear: string;
  company: string;
  role: string;
  location: string;
  salary: string;
}

export default function AlumniDirectory() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [batch, setBatch] = useState<string | null>(null);
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [alumnus, setAlumnus] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newAlumni, setNewAlumni] = useState<Alumni>({
    name: "",
    graduationYear: "",
    company: "",
    role: "",
    location: "",
    salary: "",
  });

  useEffect(() => {
  if (typeof window !== "undefined") {
    const savedAlumnus = localStorage.getItem("alumnus");

    if (savedAlumnus) {
      setAlumnus(JSON.parse(savedAlumnus));
    } else {
      const staticAlumni: Alumni[] = [
  // 2017
  { name: "Adam West", graduationYear: "2017", company: "Oracle", role: "Database Admin", location: "Austin", salary: "93000" },
  { name: "Becca Hart", graduationYear: "2017", company: "Accenture", role: "Consultant", location: "Chicago", salary: "88000" },
  { name: "Chris Pine", graduationYear: "2017", company: "Infosys", role: "QA Engineer", location: "Bangalore", salary: "70000" },
  { name: "Dana Fox", graduationYear: "2017", company: "Dell", role: "Support Engineer", location: "Texas", salary: "85000" },
  { name: "Eli Nash", graduationYear: "2017", company: "Capgemini", role: "Technical Lead", location: "Mumbai", salary: "89000" },

  // 2018
  { name: "Fiona Liu", graduationYear: "2018", company: "Uber", role: "Full Stack Developer", location: "San Francisco", salary: "100000" },
  { name: "Gavin Ross", graduationYear: "2018", company: "TCS", role: "Systems Analyst", location: "Pune", salary: "72000" },
  { name: "Hannah Young", graduationYear: "2018", company: "HP", role: "Support Analyst", location: "Houston", salary: "79000" },
  { name: "Ian Stone", graduationYear: "2018", company: "Wipro", role: "DevOps Engineer", location: "Hyderabad", salary: "82000" },
  { name: "Jade Ray", graduationYear: "2018", company: "Adobe", role: "Design Engineer", location: "San Jose", salary: "97000" },

  // 2019
  { name: "Alice Johnson", graduationYear: "2019", company: "Google", role: "Software Engineer", location: "California", salary: "120000" },
  { name: "Bob Smith", graduationYear: "2019", company: "Amazon", role: "Product Manager", location: "New York", salary: "110000" },
  { name: "Clara Adams", graduationYear: "2019", company: "Facebook", role: "Data Scientist", location: "Seattle", salary: "115000" },
  { name: "Daniel Brown", graduationYear: "2019", company: "Apple", role: "UI/UX Designer", location: "San Francisco", salary: "105000" },
  { name: "Eva Green", graduationYear: "2019", company: "Tesla", role: "Engineer", location: "Texas", salary: "100000" },

  // 2020
  { name: "Frank Lee", graduationYear: "2020", company: "Microsoft", role: "DevOps Engineer", location: "Redmond", salary: "110000" },
  { name: "Grace Kim", graduationYear: "2020", company: "Netflix", role: "Frontend Developer", location: "Los Angeles", salary: "108000" },
  { name: "Hank Wright", graduationYear: "2020", company: "Intel", role: "Embedded Engineer", location: "Oregon", salary: "95000" },
  { name: "Isabel Moore", graduationYear: "2020", company: "IBM", role: "Cloud Architect", location: "Austin", salary: "102000" },
  { name: "Jason Clark", graduationYear: "2020", company: "Cisco", role: "Network Engineer", location: "San Jose", salary: "99000" },

  // 2021
  { name: "Karen Bell", graduationYear: "2021", company: "Salesforce", role: "Backend Developer", location: "Denver", salary: "107000" },
  { name: "Leo Turner", graduationYear: "2021", company: "Spotify", role: "Audio ML Engineer", location: "Stockholm", salary: "104000" },
  { name: "Maya Patel", graduationYear: "2021", company: "Adobe", role: "Creative Cloud Engineer", location: "San Jose", salary: "101000" },
  { name: "Noah Brooks", graduationYear: "2021", company: "Snapchat", role: "Mobile Developer", location: "Santa Monica", salary: "97000" },
  { name: "Olivia White", graduationYear: "2021", company: "LinkedIn", role: "Recruiting Analyst", location: "Sunnyvale", salary: "96000" },

  // 2022
  { name: "Paul Reed", graduationYear: "2022", company: "Zomato", role: "Data Engineer", location: "Delhi", salary: "92000" },
  { name: "Quincy Zhou", graduationYear: "2022", company: "Swiggy", role: "Operations Manager", location: "Bangalore", salary: "87000" },
  { name: "Rhea Mehta", graduationYear: "2022", company: "Meesho", role: "Marketing Analyst", location: "Pune", salary: "83000" },
  { name: "Sam Tan", graduationYear: "2022", company: "Flipkart", role: "Software Tester", location: "Bangalore", salary: "91000" },
  { name: "Tina Singh", graduationYear: "2022", company: "CureFit", role: "ML Researcher", location: "Hyderabad", salary: "95000" },

  // 2023
  { name: "Uday Rao", graduationYear: "2023", company: "Paytm", role: "Android Developer", location: "Noida", salary: "88000" },
  { name: "Vikram Sharma", graduationYear: "2023", company: "Razorpay", role: "Backend Developer", location: "Bangalore", salary: "91000" },
  { name: "Wendy Thomas", graduationYear: "2023", company: "Navi", role: "Product Analyst", location: "Mumbai", salary: "86000" },
  { name: "Xavier Gomes", graduationYear: "2023", company: "PhonePe", role: "DevOps Engineer", location: "Pune", salary: "90000" },
  { name: "Yasmin Ali", graduationYear: "2023", company: "Dream11", role: "Game Developer", location: "Mumbai", salary: "94000" },

  // 2024
  { name: "Zara Khan", graduationYear: "2024", company: "OpenAI", role: "Prompt Engineer", location: "San Francisco", salary: "130000" },
  { name: "Aarav Patel", graduationYear: "2024", company: "Google", role: "AI Engineer", location: "California", salary: "125000" },
  { name: "Bianca Das", graduationYear: "2024", company: "Nvidia", role: "Graphics Programmer", location: "Santa Clara", salary: "128000" },
  { name: "Chetan R", graduationYear: "2024", company: "Byju's", role: "Content Engineer", location: "Bangalore", salary: "89000" },
  { name: "Disha Naik", graduationYear: "2024", company: "Zoho", role: "Web Developer", location: "Chennai", salary: "87000" },
];


      setAlumnus(staticAlumni);
      localStorage.setItem("alumnus", JSON.stringify(staticAlumni));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    const batchParam = urlParams.get("batch");

    if (user) {
      setUsername(user);
      const numPrefix = parseInt(user.slice(0, 2), 10);
      setIsAlumni(!isNaN(numPrefix) && numPrefix <= 20);
    }

    if (batchParam) {
      setBatch(batchParam);
    }
  }
}, []);


  useEffect(() => {
    if (typeof window !== "undefined" && isAlumni) {
      localStorage.setItem("alumnus", JSON.stringify(alumnus));
    }
  }, [alumnus, isAlumni]);

  useEffect(() => {
    if (batch) {
      setFilteredAlumni(alumnus.filter((a) => a.graduationYear === batch));
    } else {
      setFilteredAlumni(alumnus);
    }
  }, [alumnus, batch]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number | null
  ) => {
    const { name, value } = e.target;
    if (index !== null) {
      setAlumnus((prevAlumni: Alumni[]) =>
        prevAlumni.map((alum, i) =>
          i === index ? { ...alum, [name]: value } : alum
        )
      );
    } else {
      setNewAlumni((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveAlumni = () => {
    setEditingIndex(null);
  };

  const addAlumni = () => {
    if (
      newAlumni.name &&
      newAlumni.graduationYear &&
      newAlumni.company &&
      newAlumni.role &&
      newAlumni.location &&
      newAlumni.salary
    ) {
      setAlumnus((prevAlumni:Alumni[]) => [...prevAlumni, newAlumni]);
      setNewAlumni({
        name: "",
        graduationYear: "",
        company: "",
        role: "",
        location: "",
        salary: "",
      });
    } else {
      alert("Please fill in all fields to add a new alumni.");
    }
  };

  const deleteAlumni = (index: number) => {
    setAlumnus((prevAlumni) => prevAlumni.filter((_, i) => i !== index));
  };

  const handleNavigation = (path: string) => {
    if(path=='dashboard'&&isAlumni){
      path='Almumnidashboard';
    }
    router.push(`/${path}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Alumni Directory</h1>
      <p className="text-center text-lg mb-6">
        Connect with fellow alumni and explore professional networks.
      </p>

      <nav className="w-full mb-8">
        <ul className="flex justify-around text-lg font-semibold">
          <li>
            <button onClick={() => handleNavigation("dashboard")} className="px-4 py-2 text-sm bg-black font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">Home</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("about")} className="px-4 py-2 text-sm bg-black font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">Alumni Contributions</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("news")} className="px-4 py-2 text-sm bg-black font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">Current Trends</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("events")} className="px-4 py-2 text-sm bg-black font-semibold text-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">Events</button>
          </li>
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {filteredAlumni.map((alum, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-gray-700">
            {editingIndex === index ? (
              <>
                <input type="text" name="name" value={alum.name} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Full Name" />
                <input type="text" name="graduationYear" value={alum.graduationYear} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Graduation Year" />
                <input type="text" name="company" value={alum.company} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Company" />
                <input type="text" name="role" value={alum.role} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Role" />
                <input type="text" name="location" value={alum.location} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Location" />
                <input type="salary" name="salary" value={alum.salary} onChange={(e) => handleInputChange(e, index)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="salary" />
                <button onClick={saveAlumni} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-400">{alum.name}</h2>
                <p className="text-gray-300 text-sm mb-2">
                  {alum.graduationYear} Passed Out --&gt; {alum.role} at {alum.company}
                </p>
                <p className="text-gray-400">Location: {alum.location}</p>
                <p className="text-gray-400">salary: {alum.salary}</p>
                {isAlumni && (
                  <div className="mt-4 flex space-x-3">
                    <button onClick={() => setEditingIndex(index)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                    <button onClick={() => deleteAlumni(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isAlumni && (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New Alumni</h2>
          <input type="text" name="name" value={newAlumni.name} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Full Name" />
          <input type="text" name="graduationYear" value={newAlumni.graduationYear} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Graduation Year" />
          <input type="text" name="company" value={newAlumni.company} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Company" />
          <input type="text" name="role" value={newAlumni.role} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Role" />
          <input type="text" name="location" value={newAlumni.location} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="Location" />
          <input type="salary" name="salary" value={newAlumni.salary} onChange={(e) => handleInputChange(e, null)} className="w-full p-2 bg-gray-700 text-white rounded-md mb-2" placeholder="salary" />
          <button onClick={addAlumni} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Alumni</button>
        </div>
      )}

      <div className="mt-8 text-center text-lg text-gray-300">
        Logged in as: <span className="font-semibold text-white">{username}</span>
      </div>
    </div>
  );
}
