import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setResults([]); 
    setProgress(0);
  };

  const runBatchResize = async () => {
    setLoading(true);
    let finishedImages = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', selectedFiles[i]);
      formData.append('width', 600);
      formData.append('height', 400);

      try {
        const response = await fetch('https://oyyi.xyz/api/image/resize', {
          method: 'POST',
          body: formData,
        });

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        finishedImages.push({
          url: imageUrl,
          name: selectedFiles[i].name
        });
      } catch (err) {
        console.log("Error processing file index: " + i);
      }

      // Calculate percentage for progress bar
      let currentStep = Math.round(((i + 1) / selectedFiles.length) * 100);
      setProgress(currentStep);
    }

    setResults(finishedImages);
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Batch Resizer</h2>
        <p className="subtitle">Upload multiple images to resize at once</p>

        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          className="file-input"
        />

        <button 
          onClick={runBatchResize} 
          disabled={loading || selectedFiles.length === 0}
          className="resize-btn"
        >
          {loading ? `Processing (${progress}%)` : `Resize ${selectedFiles.length} Images`}
        </button>

        {loading && (
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <div className="results-grid">
          {results.map((img, index) => (
            <div key={index} className="image-card">
              <img src={img.url} alt="resized" className="preview-img" />
              <a href={img.url} download={img.name} className="download-link">Download</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;