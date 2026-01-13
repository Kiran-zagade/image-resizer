import React, { useState } from 'react';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const onSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const startResize = async () => {
    setIsProcessing(true);
    let tempResults = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      // Update progress bar
      let percent = Math.round(((i + 1) / selectedFiles.length) * 100);
      setCurrentProgress(percent);

      const data = new FormData();
      data.append('file', selectedFiles[i]);
      data.append('width', 500); // Fixed size for simplicity
      data.append('height', 500);

      try {
        const res = await fetch('https://oyyi.xyz/api/image/resize', {
          method: 'POST',
          body: data
        });

        const blob = await res.blob();
        tempResults.push(URL.createObjectURL(blob));
      } catch (err) {
        console.log("Error with file " + i);
      }
    }

    setResults(tempResults);
    setIsProcessing(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>My Image Resizer</h1>
      
      <input type="file" multiple onChange={onSelect} />
      <br /><br />

      <button onClick={startResize} disabled={isProcessing}>
        {isProcessing ? "Resizing..." : "Upload & Resize All"}
      </button>

      {isProcessing && (
        <div style={{ marginTop: '20px' }}>
          <p>Processing: {currentProgress}%</p>
          <progress value={currentProgress} max="100"></progress>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        {results.map((url, index) => (
          <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
            <img src={url} width="150" alt="resized" />
            <br />
            <a href={url} download={`image-${index}.png`}>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;