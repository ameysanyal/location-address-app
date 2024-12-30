import { useContext, useEffect } from 'react';
import { LocationContext } from '../context/LocationContext';
import { FaLocationDot, FaDeleteLeft } from "react-icons/fa6";

const AddressList = () => {
    const { addresses, setAddresses } = useContext(LocationContext);

    const deleteAddress = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the local state to remove the deleted address
            setAddresses((prevAddresses) =>
                prevAddresses.filter((address) => address._id !== id)
            );
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/address', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <div className="p-10 flex justify-center">
            {addresses.length === 0 ? (
                <p>No addresses saved yet.</p>
            ) : (
                <ul className="space-y-3 w-1/2">
                    {addresses.map((address) => (
                        <li
                            key={address._id}
                            className="p-1 flex bg-red-200 border-red-950 border shadow rounded justify-center items-center space-x-4"
                        >
                            <FaLocationDot size={20} />
                            <div className="flex flex-col w-3/4 justify-center">
                                <h3 className="font-bold">{address.category}</h3>
                                <p>
                                    {address.location}, {address.landmark}
                                </p>
                            </div>
                            <button onClick={() => deleteAddress(address._id)}>
                                <FaDeleteLeft size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressList;
