import React, { useState } from 'react';
import axios from 'axios';

// Maximum allowed image size in bytes
const MAX_IMAGE_SIZE = 1000000;
// API endpoint for getting a presigned URL for the upload
const API_ENDPOINT = 'https://g7k976a75d.execute-api.us-east-1.amazonaws.com/uploads';
// API endpoint for saving the input data and file path to DynamoDB
const API_SAVE_ENDPOINT = 'https://g7k976a75d.execute-api.us-east-1.amazonaws.com/save';

function App() {
  const [image, setImage] = useState('');
  const [uploadURL, setUploadURL] = useState('');
  const [textInput, setTextInput] = useState('');

  // Handle file change event
  const onFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createImage(files[0]);
  };

  // Create an image preview
  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target.result.includes('data:image/jpeg')) {
        return alert('Wrong file type - JPG only.');
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        return alert('Image is too large.');
      }
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove the selected image
  const removeImage = () => {
    setImage('');
  };

  // Upload the image to S3 and save metadata to DynamoDB
  const uploadImage = async () => {
    try {
      // Get a presigned URL for the upload
      const response = await axios({
        method: 'GET',
        url: API_ENDPOINT
      });

      // Convert the image to a binary blob
      let binary = atob(image.split(',')[1]);
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
      
      // Upload the image to S3 using the presigned URL
      await fetch(response.uploadURL, {
        method: 'PUT',
        body: blobData
      });

      const s3Path = `s3uploader-s3uploadbucket-dm8rdozrrqqv/${response.Key}`;
      setUploadURL(response.uploadURL.split('?')[0]);

      // Save the input text and S3 path to the API Gateway, which then saves it to DynamoDB
      await axios.post(API_SAVE_ENDPOINT, {
        input_text: textInput,
        input_file_path: s3Path
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const resetForm = () => {
    setImage('');
    setUploadURL('');
    setTextInput('');
  };

  const canSubmit = textInput && image;

  return (
    <div className="App">
      <h1>Fovus Coding Challenge</h1>
      {!uploadURL ? (
        <>
          <div className="input-group">
            <label>Text input:</label>
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
          </div>
          <div className="input-group">
            <label>File input:</label>
            <input type="file" onChange={onFileChange} accept="image/jpeg" />
            {image && <img src={image} className="preview-image" alt="preview" />}
            {image && <button onClick={removeImage} className="remove-button">Remove File</button>}
          </div>
          <button onClick={uploadImage} disabled={!canSubmit}>Submit</button>
        </>
      ) : (
        <>
          <h2>Success! File uploaded to bucket.</h2>
          <button onClick={resetForm}>Upload another file and text input</button>
        </>
      )}
    </div>
  );
}

export default App;
