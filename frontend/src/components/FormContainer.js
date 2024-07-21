import React, { useState } from 'react';
import TextInput from './TextInput';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';

function FormContainer() {
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState(null);

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file || !inputText) {
            alert("Please fill out both fields.");
            return;
        }

        // Placeholder for actual upload logic
        console.log("Text:", inputText);
        console.log("File:", file);
        // Implement actual upload to S3 and interactions with AWS here
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextInput value={inputText} onChange={handleTextChange} />
            <FileInput onChange={handleFileChange} />
            <SubmitButton />
        </form>
    );
}

export default FormContainer;
