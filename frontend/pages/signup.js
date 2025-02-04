import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE_URL = "https://your-app.onrender.com"; // Replace with your backend URL

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      router.push("/login"); // Redirect to login after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="border p-2 w-full"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
