import React, { useState } from 'react';
import './App.css'; // We will put the CSS in this file

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [percent, setPercent] = useState(0);

  const onSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setResults([]); // Clear previous results
  };

  const startResize = async () => {
    setIsProcessing(true);
    let tempResults = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const data = new FormData();
      data.append('file', selectedFiles[i]);
      data.append('width', 500);
      data.append('height', 500);

      try {
        const res = await fetch('https://oyyi.xyz/api/image/resize', {
          method: 'POST',
          body: data
        });
        const blob = await res.blob();
        tempResults.push({
          url: URL.createObjectURL(blob),
          name: selectedFiles[i].name
        });
      } catch (err) {
        console.error("Error with file:", i);
      }
      
      // Update progress bar
      setPercent(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setResults(tempResults);
    setIsProcessing(false);
  };

  return (
    <div className="main-container">
      <div className="resizer-card">
        <h1>Batch Resizer</h1>
        <p>Select images to resize them to 500x500px</p>
        
        <input type="file" multiple onChange={onSelect} className="file-input" />
        
        <button onClick={startResize} disabled={isProcessing || selectedFiles.length === 0} className="upload-btn">
          {isProcessing ? "Processing..." : `Resize ${selectedFiles.length} Images`}
        </button>

        {isProcessing && (
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
            </div>
            <p>{percent}% Completed</p>
          </div>
        )}

        <div className="results-grid">
          {results.map((item, index) => (
            <div key={index} className="result-card">
              <img src={item.url} alt="resized" />
              <a href={item.url} download={`resized-${item.name}`}>Download</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;