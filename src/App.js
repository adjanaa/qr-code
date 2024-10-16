import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2pdf from 'html2pdf.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './App.css';

const App = () => {
    const qrcodeRef = useRef(null);
    const [wifiName, setWifiName] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [wifiString, setWifiString] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (wifiString) {
            QRCode.toCanvas(qrcodeRef.current, wifiString, { width: 300 }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [wifiString]);

    const handleGenerateQRCode = (e) => {
        e.preventDefault();
        const formattedString = `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};;`;
        setWifiString(formattedString);
    };

    const generatePDF = () => {
        const element = qrcodeRef.current;
        const opt = {
            margin: [50, 60, 50, 0],
            filename: 'qrcode.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="app container d-flex flex-column justify-content-center align-items-center pt-5">
            <h1 className="text-center my-4">Wifi QR Code Generator</h1>
            <form onSubmit={handleGenerateQRCode} className="mb-4 w-50">
                <div className="mb-3">
                    <label htmlFor="wifiName"><strong>Wi-Fi Name</strong></label>
                    <input
                        type="text"
                        id="wifiName"
                        className="form-control"
                        placeholder="Enter Wi-Fi Name"
                        value={wifiName}
                        onChange={(e) => setWifiName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="wifiPassword"><strong>Wi-Fi Password</strong></label>
                    <input
                        type={showPassword ? 'text' : 'password'} 
                        id="wifiPassword"
                        className="form-control"
                        placeholder="Enter Wi-Fi Password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="btn position-absolute"
                        style={{ right: '10px', top: '25px' }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash /> }
                    </button>
                </div>
                <button type="submit" className="btn btn-primary w-100">Generate QR Code</button>
                <div className="d-flex flex-column align-items-center pt-4">
                    <canvas ref={qrcodeRef} className="mb-3"></canvas>
                    {wifiString && (
                        <button onClick={generatePDF} className="btn btn-primary w-100">Download QR Code as PDF</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default App;
