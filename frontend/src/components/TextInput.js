import React from 'react';

function TextInput({ value, onChange }) {
    return <input type="text" placeholder="Enter text here" value={value} onChange={onChange} />;
}

export default TextInput;
