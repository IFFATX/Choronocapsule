import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCapsule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
  });
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5001/api/capsules/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const capsule = res.data;
        // Format date to YYYY-MM-DD for input
        const date = new Date(capsule.releaseDate);
        const formattedDate = date.toISOString().split('T')[0];

        setFormData({
          title: capsule.title,
          description: capsule.description,
          releaseDate: formattedDate,
        });
        setExistingFiles(capsule.files || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching capsule");
        navigate("/dashboard");
      }
    };

    fetchCapsule();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const handleRemoveExistingFile = (fileToRemove) => {
    setExistingFiles(existingFiles.filter(f => f !== fileToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("releaseDate", formData.releaseDate);
      
      // Append existing files that we want to keep
      existingFiles.forEach(file => {
        formDataToSend.append("remainingFiles", file);
      });

      // Append new files
      for (let i = 0; i < newFiles.length; i++) {
        formDataToSend.append("files", newFiles[i]);
      }

      await axios.put(`http://localhost:5001/api/capsules/${id}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          // Axios automatically sets Content-Type for FormData
        }
      });
      
      alert("Capsule Updated Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating capsule: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd" }}>
      <h2>Edit Capsule</h2>
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

        {/* Existing Files Preview */}
        {existingFiles.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <label>Current Files:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {existingFiles.map((file, index) => {
                const isImage = file.match(/\.(jpeg|jpg|png|gif)$/i);
                const isVideo = file.match(/\.(mp4|mov|avi)$/i);
                const isAudio = file.match(/\.(mp3|wav)$/i);
                const isPdf = file.match(/\.pdf$/i);
                const fileUrl = `http://localhost:5001/${file}`;

                return (
                  <div key={index} style={{ position: 'relative', width: '150px', height: '150px', border: '1px solid #ccc', background: '#f9f9f9' }}>
                    {isImage ? (
                      <img 
                        src={fileUrl} 
                        alt="preview" 
                        onClick={() => setSelectedMedia(fileUrl)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                      />
                    ) : isVideo ? (
                      <div 
                        onClick={() => setSelectedMedia(fileUrl)}
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                      >
                        <video src={fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '40px',
                          color: 'white',
                          textShadow: '0 0 5px rgba(0,0,0,0.5)',
                          pointerEvents: 'none'
                        }}>
                          ▶️
                        </div>
                      </div>
                    ) : isAudio ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ fontSize: '30px' }}>🎵</span>
                         <audio controls src={fileUrl} style={{ width: '100%', maxWidth: '140px', marginTop: '5px' }} />
                      </div>
                    ) : isPdf ? (
                      <div 
                        onClick={() => setSelectedMedia(fileUrl)}
                        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                         <span style={{ fontSize: '40px' }}>📄</span>
                         <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>PDF</span>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', background: '#eee' }}>
                        File
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(file)}
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label>Add New Files (Images/Videos/Audio/PDFs)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: "10px 20px", background: "black", color: "white", cursor: "pointer" }}>
            Save Changes
            </button>
            <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                style={{ padding: "10px 20px", background: "#ccc", color: "black", cursor: "pointer", border: "none" }}
            >
            Cancel
            </button>
        </div>
      </form>

      {/* Full Screen Media Modal */}
      {selectedMedia && (
        <div 
          onClick={() => setSelectedMedia(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          {selectedMedia.match(/\.(mp4|mov|avi)$/i) ? (
             <video 
               controls 
               autoPlay
               src={selectedMedia} 
               style={{ maxWidth: '90%', maxHeight: '90%', outline: 'none' }} 
               onClick={(e) => e.stopPropagation()} 
             />
          ) : selectedMedia.match(/\.pdf$/i) ? (
             <iframe 
               src={selectedMedia} 
               style={{ width: '80%', height: '90%', background: 'white' }} 
               onClick={(e) => e.stopPropagation()}
             />
          ) : (
            <img 
              src={selectedMedia} 
              alt="Full size" 
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditCapsule;