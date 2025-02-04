import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt_decode from "jwt-decode";

const API_BASE_URL = "https://your-app.onrender.com"; // Replace with your Render URL

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUser(decoded);
      fetchNotes();
    } else {
      router.push("/login");
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const handleSaveNote = async () => {
    if (!note) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/notes`,
        { content: note },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNote("");
      fetchNotes();
    } catch (error) {
      console.error("Error saving note", error);
    }
  };

  const handleSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote(transcript);
    };

    recognition.start();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Note-Taking App</h1>
      {user && <p className="mb-4">Welcome, {user.name}</p>}
      <textarea
        className="border p-2 w-full mb-4"
        rows="4"
        placeholder="Type or dictate your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={handleSaveNote} className="bg-blue-500 text-white p-2 rounded mr-2">
        Save Note
      </button>
      <button
        onClick={handleSpeechRecognition}
        className={`bg-green-500 text-white p-2 rounded ${recording ? "opacity-50" : ""}`}
        disabled={recording}
      >
        {recording ? "Listening..." : "Record Voice"}
      </button>
      <ul className="mt-4">
        {notes.map((n, index) => (
          <li key={index} className="border-b p-2">{n.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default NoteTakingApp;
