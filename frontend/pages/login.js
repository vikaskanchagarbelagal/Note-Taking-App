import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE_URL = "https://your-app.onrender.com"; // Replace with your backend URL

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      localStorage.setItem("token", response.data.token);
      router.push("/"); // Redirect to homepage after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="border p-2 w-full"/>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
