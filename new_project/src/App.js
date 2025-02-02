import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a file first');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      alert(response.data.message);
      setErrors([]);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Error uploading file');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Excel Data Importer</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'block', margin: '10px auto', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }} />
      <button onClick={handleUpload} style={{ display: 'block', margin: '10px auto', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Upload</button>
      {errors.length > 0 && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px' }}>
          {errors.map((err, index) => (
            <p key={index} style={{ margin: '5px 0' }}>{`Row ${err.row}: ${err.message}`}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

