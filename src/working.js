import React, { useState } from 'react';

function App() {
    const [image, setImage] = useState(null);
    const [sketchUrl, setSketchUrl] = useState(null);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const processImage = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:5000/api/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process image');
            }

            const data = await response.json();
            setSketchUrl(data.sketchUrl);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={processImage}>Process Image</button>
            {sketchUrl && <img src={sketchUrl} alt="Pencil Sketch" />}
        </div>
    );
}

export default App;
