import React, { useState, useEffect, useRef } from 'react';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [opacity, setOpacity] = useState(100);
  const [uploadProgress, setUploadProgress] = useState(0);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); // pencil or eraser

useEffect(() => {
  if (image) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.filter = `contrast(${contrast}%) brightness(${brightness}%) opacity(${opacity}%)`;
      tempCtx.drawImage(img, 0, 0);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      ctx.drawImage(tempCanvas, 0, 0);
      setPreviewImage(canvas.toDataURL());
    };
    img.src = image;
  }
}, [image, contrast, brightness, opacity]);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleContrastChange = (e) => {
    setContrast(e.target.value);
  };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  const handleToolChange = (e) => {
    setTool(e.target.value);
  };

  const handleCanvasMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {previewImage && <img src={previewImage} alt="Uploaded" style={{ display: 'none' }} />}
      
      <div>
        <label>Contrast:</label>
        <input
          type="range"
          min="0"
          max="200"
          value={contrast}
          onChange={handleContrastChange}
        />
      </div>
      
      <div>
        <label>Brightness:</label>
        <input
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={handleBrightnessChange}
        />
      </div>
      
      <div>
        <label>Opacity:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={handleOpacityChange}
        />
      </div>

      <div>
        <label>Tool:</label>
        <select value={tool} onChange={handleToolChange}>
          <option value="pencil">Pencil</option>
          <option value="eraser">Eraser</option>
        </select>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{ border: '1px solid black', cursor: 'crosshair' }}
      />

      <button onClick={handleDownload}>Download</button>
      <progress value={uploadProgress} max="100" />
    </div>
  );
};

export default ImageEditor;
