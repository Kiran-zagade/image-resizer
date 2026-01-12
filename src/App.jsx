import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [resizedImageUrl, setResizedImageUrl] = useState(null);

  const handleResize = async () => {
    if (!file) return alert("Please upload an image!");
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);

    try {
      const response = await fetch('https://oyyi.xyz/api/image/resize', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error("API Error");
      const blob = await response.blob();
      setResizedImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert("Error resizing image. Make sure the file is an image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResizedImageUrl(null);
    setWidth(800);
    setHeight(600);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Oyyi Resizer</h2>
        <p style={styles.subtitle}>Professional Image Scaling Tool</p>

        {/* File Input Area */}
        <div style={styles.uploadBox}>
          <label style={styles.label}>Choose Image</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            style={styles.fileInput} 
            accept="image/*"
          />
          {file && <p style={styles.fileName}>Selected: {file.name}</p>}
        </div>

        {/* Dimension Controls */}
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Width</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(e.target.value)} 
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Height</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleResize} 
            disabled={loading} 
            style={loading ? {...styles.button, ...styles.disabled} : styles.button}
          >
            {loading ? 'Resizing...' : 'Resize Image'}
          </button>
          
          {resizedImageUrl && (
            <button onClick={handleReset} style={styles.resetBtn}>
              Reset
            </button>
          )}
        </div>

        {/* Result Area */}
        {resizedImageUrl && (
          <div style={styles.resultArea}>
            <div style={styles.divider}></div>
            <h4 style={styles.label}>Result Preview:</h4>
            <div style={styles.imageContainer}>
              <img src={resizedImageUrl} alt="Resized" style={styles.preview} />
            </div>
            <a href={resizedImageUrl} download="resized-oyyi.png" style={styles.downloadLink}>
              Download Resized File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Enhanced Styles for Perfect Centering ---
const styles = {
  container: {
    backgroundColor: '#eef2f3',
    height: '100vh',           // Full viewport height
    width: '100vw',            // Full viewport width
    display: 'flex',           // Flexbox for centering
    justifyContent: 'center',  // Horizontal center
    alignItems: 'center',      // Vertical center
    fontFamily: '"Inter", sans-serif',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px 40px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    maxHeight: '90vh',         // Prevents card from going off screen
    overflowY: 'auto'          // Allows scrolling inside card if content is long
  },
  title: { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 5px 0' },
  subtitle: { fontSize: '14px', color: '#777', marginBottom: '25px' },
  uploadBox: { marginBottom: '20px', textAlign: 'left' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
  fileInput: { width: '100%', fontSize: '14px' },
  fileName: { fontSize: '12px', color: '#27ae60', marginTop: '5px' },
  row: { display: 'flex', gap: '15px', marginBottom: '25px' },
  inputGroup: { flex: 1, textAlign: 'left' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  button: { width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
  disabled: { backgroundColor: '#a5a6f6', cursor: 'not-allowed' },
  resetBtn: { backgroundColor: 'transparent', border: '1px solid #ddd', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#666' },
  resultArea: { marginTop: '20px' },
  divider: { height: '1px', backgroundColor: '#eee', margin: '20px 0' },
  imageContainer: { borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', marginBottom: '15px' },
  preview: { maxWidth: '100%', display: 'block' },
  downloadLink: { color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }
};

export default App;