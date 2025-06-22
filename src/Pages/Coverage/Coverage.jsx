import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet + Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DistrictAvailability = () => {
    const [districts, setDistricts] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchText, setSearchText] = useState('');

    // Fetch data from public folder
    useEffect(() => {
        fetch('/warehouses.json')
            .then(res => res.json())
            .then(data => {
                setDistricts(data)
                console.log(data);
            })
            .catch(err => console.error('Failed to fetch districts:', err));
    }, []);

    const handleSearch = () => {
        setSearchText(inputText);
    };

    const filteredDistricts = districts.filter(d =>
        d.district.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 bg-white rounded-lg shadow space-y-6">
            <h2 className="text-3xl font-bold text-center text-blue-800 border-b-4 inline-block border-blue-500 px-4">
                We are available in 64 districts
            </h2>

            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="🔍 Search by district"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-72 px-4 py-2 border rounded-full text-black"
                />
                <button
                    onClick={handleSearch}
                    className="bg-lime-500 px-6 py-2 rounded-full font-semibold hover:bg-lime-600 transition"
                >
                    Search
                </button>
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-700">
                We deliver almost all over Bangladesh
            </h3>

            <div className="h-[500px] rounded-lg overflow-hidden">
                <MapContainer
                    center={[23.685, 90.3563]} // Center of Bangladesh
                    zoom={7}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredDistricts.map((district, idx) => (
                        <Marker key={idx} position={[district.latitude, district.longitude]}>
                            <Popup>
                                <div className="text-sm">
                                    <h4 className="font-bold text-lg">{district.district}</h4>
                                    <p className="text-gray-600">
                                        <strong>Covered:</strong> {district.covered_area.join(', ')}
                                    </p>
                                    <a
                                        href={district.flowchart}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline mt-1 inline-block"
                                    >
                                        View Flowchart
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default DistrictAvailability;
