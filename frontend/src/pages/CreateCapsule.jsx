import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Hook to redirect user after submit

const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a capsule");
        return;
      }

      // NOTE: Ensure this matches your backend URL/Port
      const res = await axios.post("http://localhost:5001/api/capsules", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Response:", res.data);
      alert("Capsule Created Successfully!");
      navigate("/dashboard"); // Redirect to dashboard (if you have one)
    } catch (err) {
      console.error(err);
      alert("Error creating capsule: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ddd" }}>
      <h2>Create New Capsule</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Message</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", height: "100px", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Unlock Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", background: "black", color: "white", cursor: "pointer" }}>
          Seal Capsule
        </button>
      </form>
    </div>
  );
};

export default CreateCapsule;