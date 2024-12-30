import { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../context/LocationContext';

// eslint-disable-next-line react/prop-types
const LocationModal = () => {
    const { setLocation } = useContext(LocationContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            // Success callback - means permission is granted
            () => {
                console.log('Permission is granted');
                setIsModalOpen(false)
            },
            // Error callback
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setIsModalOpen(true)
                    console.log('Permission is denied');
                } else {
                    console.log('Other error:', error.message);
                }
            }
        );
    }, [])

    const enableLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setIsModalOpen(false)
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setIsModalOpen(true)
                        console.log('Permission is denied');
                    } else {
                        console.log('Other error:', error.message);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-bold">Location Permission</h2>
                <p className="my-2">Enable location or search manually to proceed.</p>
                <div className="flex flex-col space-y-2 mt-4">
                    <button className="bg-red-500 text-white px-2 py-1 rounded font-semibold" onClick={enableLocation}>
                        Enable Location
                    </button>
                    <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setIsModalOpen(false)}>
                        Search your Location Manually
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default LocationModal;
