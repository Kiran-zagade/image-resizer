import React, { useState } from 'react';

function App() {
  // --- State Management ---
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [resizedImageUrl, setResizedImageUrl] = useState(null);
  const [resultDimensions, setResultDimensions] = useState(null);

  // --- Functions ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResizedImageUrl(null); // Reset preview on new upload
    setResultDimensions(null);
  };

  const handleResize = async () => {
    if (!file) return alert("Please select an image first!");
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

      if (!response.ok) throw new Error("API failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Measure the actual result returned by the API
      const img = new Image();
      img.onload = () => {
        setResultDimensions({ w: img.width, h: img.height });
        setResizedImageUrl(url);
        setLoading(false);
      };
      img.src = url;

    } catch (err) {
      console.error(err);
      alert("Error processing image. Check your internet connection.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResizedImageUrl(null);
    setResultDimensions(null);
    setWidth(800);
    setHeight(600);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Oyyi Image Resizer</h2>
        <p style={styles.subtitle}>Upload and scale images instantly</p>

        {/* Input Controls */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Image File</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            style={styles.fileInput} 
            accept="image/*"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Target Width (px)</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(e.target.value)} 
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Target Height (px)</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.actionRow}>
          <button 
            onClick={handleResize} 
            disabled={loading} 
            style={loading ? {...styles.button, ...styles.disabled} : styles.button}
          >
            {loading ? 'Processing API Request...' : 'Resize Image Now'}
          </button>
          
          {(file || resizedImageUrl) && (
            <button onClick={handleReset} style={styles.resetBtn}>Reset All</button>
          )}
        </div>

        {/* Results / Verification Section */}
        {resizedImageUrl && resultDimensions && (
          <div style={styles.resultArea}>
            <div style={styles.divider}></div>
            
            <div style={styles.successBadge}>
              Success: Resized to {resultDimensions.w} x {resultDimensions.h} pixels
            </div>

            <h4 style={styles.label}>Resulting Image:</h4>
            <div style={styles.imageContainer}>
              <img src={resizedImageUrl} alt="Resized Result" style={styles.preview} />
            </div>
            
            <a href={resizedImageUrl} download="resized-image.png" style={styles.downloadLink}>
              Download Resized File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Professional CSS-in-JS Styles ---
const styles = {
  container: {
    backgroundColor: '#f0f2f5',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '90%',
    maxWidth: '420px',
    textAlign: 'center'
  },
  title: { color: '#1a1a1b', marginBottom: '8px', fontSize: '22px' },
  subtitle: { color: '#65676b', fontSize: '14px', marginBottom: '24px' },
  inputGroup: { textAlign: 'left', marginBottom: '16px', flex: 1 },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#4b4b4b', marginBottom: '6px', display: 'block' },
  fileInput: { fontSize: '14px', width: '100%' },
  row: { display: 'flex', gap: '12px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  actionRow: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#0064e0', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
  disabled: { backgroundColor: '#a8c7fa', cursor: 'not-allowed' },
  resetBtn: { backgroundColor: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontSize: '13px' },
  resultArea: { marginTop: '20px' },
  divider: { height: '1px', backgroundColor: '#eee', margin: '15px 0' },
  successBadge: { backgroundColor: '#e7f3ff', color: '#1877f2', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' },
  imageContainer: { border: '1px solid #f0f2f5', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' },
  preview: { maxWidth: '100%', display: 'block' },
  downloadLink: { color: '#0064e0', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }
};

export default App;