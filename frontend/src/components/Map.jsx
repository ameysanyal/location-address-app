import { useContext, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LocationContext } from '../context/LocationContext';
import { FaLocationCrosshairs } from "react-icons/fa6";

const LocationMarker = () => {
    const { location, setLocation, setAddress, address } = useContext(LocationContext);
    const map = useMap();

    const fetchAddress = useCallback(async (loc) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'MyMapApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text(); // First get the response as text
            if (!text) {
                throw new Error('Empty response received');
            }

            const data = JSON.parse(text); // Then parse it
            setAddress(data.display_name || 'Address not found');

        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Error fetching address');
        }
    }, [setAddress]);

    useMapEvents({
        click(e) {
            const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
            setLocation(newLocation);
            fetchAddress(newLocation);
            map.setView(newLocation);
        },
    });

    useEffect(() => {
        if (location) {
            map.setView(location);
            fetchAddress(location);
        }
        console.log(address)
    }, [location, map, fetchAddress, address]);

    return location ? (
        <Marker
            position={[location.lat, location.lng]}
            draggable
            eventHandlers={{
                dragend: (e) => {
                    const newLocation = {
                        lat: e.target.getLatLng().lat,
                        lng: e.target.getLatLng().lng,
                    };
                    setLocation(newLocation);
                    fetchAddress(newLocation);
                    map.setView(newLocation);
                },
            }}
        />
    ) : null;
};

const Map = () => {
    const { location, setLocation, address } = useContext(LocationContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'MyMapApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text(); // First get the response as text
            if (!text) {
                throw new Error('Empty response received');
            }

            const data = JSON.parse(text); // Then parse it
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('Error fetching suggestions');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const { lat, lon } = suggestion;
        const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setLocation(newLocation);
        setSearchQuery('');
        setSuggestions([]);
    };

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setLocation(newLocation);
                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                    setError("Unable to fetch your location. Please try again.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="flex flex-col space-y-2 p-10 bg-red-200">
            <div className="mb-4 relative">
                <h2 className="text-lg font-semibold mb-2 w-full">Select Your Location</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    placeholder="Search for a location"
                    className="w-full p-1 border rounded z-10"
                />
                {isLoading && (
                    <div className="absolute right-2 top-2">
                        Loading...
                    </div>
                )}
                {error && (
                    <div className="text-red-600 text-sm mt-1">
                        {error}
                    </div>
                )}
                {suggestions.length > 0 && (
                    <ul className="absolute bg-white border rounded shadow-md w-full z-10">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="text-md text-black">
                <strong>Selected Address:</strong> {address || 'None'}
            </div>

            <div className="relative">
                <MapContainer
                    center={location || [0, 0]}
                    zoom={15}
                    className="h-64"
                    style={{ height: '400px', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker />
                </MapContainer>
                <button
                    onClick={handleLocateMe}
                    className="absolute bottom-10 left-10 font-semibold p-2 flex items-center gap-2 bg-red-950 text-white rounded-xl"
                    style={{ zIndex: 1000 }}
                >
                    Locate Me <FaLocationCrosshairs size={20} />
                </button>
            </div>
        </div>
    );
};

export default Map;