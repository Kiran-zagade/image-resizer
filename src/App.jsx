import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- 1. Load data from IndexedDB on startup ---
  useEffect(() => {
    const request = indexedDB.open("ImageResizerDB", 1);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const getAll = store.getAll();

      getAll.onsuccess = () => {
        // Convert Blobs back to URLs so we can see them
        const savedImages = getAll.result.map(item => ({
          url: URL.createObjectURL(item.blob),
          name: item.name
        }));
        setResults(savedImages);
      };
    };
  }, []);

 // Save image to IndexedDB 
  const saveToDB = (blob, name) => {
    const request = indexedDB.open("ImageResizerDB", 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      store.add({ blob, name, timestamp: Date.now() });
    };
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
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
        
        // Save to Database for persistence
        saveToDB(blob, selectedFiles[i].name);

        const imageUrl = URL.createObjectURL(blob);
        finishedImages.push({ url: imageUrl, name: selectedFiles[i].name });

      } catch (err) {
        console.log("Error processing file index: " + i);
      }

      let currentStep = Math.round(((i + 1) / selectedFiles.length) * 100);
      setProgress(currentStep);
    }

    setResults(prev => [...prev, ...finishedImages]); // Add new to existing
    setLoading(false);
  };

  const clearHistory = () => {
    const request = indexedDB.open("ImageResizerDB", 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction("images", "readwrite");
      transaction.objectStore("images").clear();
      setResults([]);
    };
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Batch Resizer & Storage</h2>
        <p className="subtitle">Files stay here even after refresh!</p>

        <input type="file" multiple onChange={handleFileChange} className="file-input" />

        <button onClick={runBatchResize} disabled={loading || selectedFiles.length === 0} className="resize-btn">
          {loading ? `Processing (${progress}%)` : `Resize ${selectedFiles.length} Images`}
        </button>

        {results.length > 0 && (
          <button onClick={clearHistory} className="clear-btn">Clear History</button>
        )}

        {loading && (
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <div className="results-grid">
          {results.map((img, index) => (
            <div key={index} className="image-card">
              <img src={img.url} alt="saved" className="preview-img" />
              <a href={img.url} download={img.name} className="download-link">Download</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;