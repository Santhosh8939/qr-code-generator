import React from 'react'
import { useState } from 'react';
import "../css/QRCode.css"

export const QRCode = () => {

    const [img, setImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState("")
    const [qrSize , setQrSize] = useState("")
    const [inputError, setInputError] = useState({ qrData: false, qrSize: false });

    const validateInputs = () => {
        let isValid = true;
        const errors = { qrData: false, qrSize: false };

        if (qrData.trim() === "") {
            errors.qrData = true;
            isValid = false;
        }

        if (qrSize.trim() === "" || isNaN(qrSize) || parseInt(qrSize) <= 0) {
            errors.qrSize = true;
            isValid = false;
        }

        setInputError(errors);
        return isValid;
    };

    async function generateQR() {
        if (!validateInputs()) {
            return;
        }

        setLoading(true);
        try {
            const url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=${qrSize}x${qrSize}`;
            setImg(url);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    function downloadQR() {
        if (!validateInputs()) {
            return;
        }

        fetch(img)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "qrcode.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    return (
        <div className='app-container'>
            <h2>QR Code Generator</h2>
            {loading && <p>Please wait.....</p>}
            {img && <img src={img} className='qr-code-img' />}
            <div className='main'>
                <label htmlFor='dataInput' className='input-label'>
                    Data For QR Code
                </label>
                <input
                    type='text'
                    id="dataInput"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder='Enter Data For QR Code'
                />
                {inputError.qrData && <span className="error-message">Please enter data for QR Code</span>}

                <label htmlFor='sizeInput' className='input-label'>
                    Image Size
                </label>
                <input 
                    type='text'
                    id="sizeInput"
                    value={qrSize}
                    onChange={(e) => setQrSize(e.target.value)}
                    placeholder='Enter Image Size'
                />
                {inputError.qrSize && <span className="error-message">Please enter image size</span>}
                <br/>
                <button onClick={generateQR} disabled={loading} className='generate-cta'>Generate QR Code</button>

                <button onClick={downloadQR} className='download-cta'>Download QR Code</button>
            </div>
        </div>
    );
};