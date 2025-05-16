import React, { useState } from 'react';
import axios from 'axios';
import './ProductImageUpload.css';

const ProductImageUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setUploadStatus('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setUploadStatus('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file || !displayName.trim()) {
      setUploadStatus('Please enter a display name and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', displayName.trim());  // <-- Important: 'name' matches backend

    try {
      setUploading(true);
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Upload successful!');
      setFile(null);
      setPreviewUrl(null);
      setDisplayName('');
      console.log(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div 
        className="upload-box" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {!previewUrl ? (
          <p>Drag & drop an image here, or click to select a file</p>
        ) : (
          <img src={previewUrl} alt="Preview" className="preview-image" />
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <input
        type="text"
        placeholder="Enter image display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="input-field"
        disabled={uploading}
      />

      <button 
        onClick={handleUpload} 
        className="upload-button" 
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadStatus && <p className="status">{uploadStatus}</p>}
    </div>
  );
};

export default ProductImageUpload;
