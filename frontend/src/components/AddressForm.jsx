import { useState, useContext } from "react";
import { LocationContext } from '../context/LocationContext';

const AddressForm = () => {
    const { address } = useContext(LocationContext);
    const [form, setForm] = useState({ location: address, houseNo: "", landmark: "", category: "Home" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    async function handleSubmit(data) {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/address/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    location: address // Ensure we're using the latest address from context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // const result = await response.json();

            setForm({ location: address, houseNo: "", landmark: "", category: "Home" }); // Reset form
        } catch (err) {
            console.error('Error saving address:', err);
            setError('Failed to save address. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form className='p-10 rounded-lg border border-red-950 bg-red-200 flex flex-col space-y-4 items-center w-3/4 lg:w-1/2'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(form);
                }}>
                {error && (
                    <div className="w-full p-2 text-red-600 text-sm bg-red-100 rounded">
                        {error}
                    </div>
                )}
                <div className="flex space-y-1 lg:flex-row flex-col my-2 w-full">
                    <label className='lg:text-lg lg:self-center text-sm text-nowrap mr-3 w-1/4'>Location:</label>
                    <p className="lg:p-1 p-0.5 rounded-lg w-full lg:w-3/4">{address}</p>
                </div>
                <div className="flex space-y-1 lg:flex-row flex-col my-2 w-full">
                    <label className='lg:text-lg text-sm text-nowrap mr-3 w-1/4'>House No:</label>
                    <input
                        className="lg:p-1 p-0.5 rounded-lg w-full lg:w-3/4"
                        name="houseNo"
                        value={form.houseNo}
                        placeholder="House/Flat/Block No."
                        onChange={handleChange}
                    />
                </div>
                <div className="flex space-y-1 lg:flex-row flex-col my-2 w-full">
                    <label className='lg:text-lg text-sm text-nowrap mr-4 w-1/4'>LandMark:</label>
                    <input
                        name="landmark"
                        className="lg:p-1 p-0.5 rounded-lg w-full lg:w-3/4"
                        value={form.area}
                        placeholder="Apartment/Road/Area"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex space-y-1 lg:flex-row flex-col my-2 w-full">
                    <label className='lg:text-lg text-sm text-nowrap mr-4 w-1/4'>Category:</label>
                    <select
                        className="lg:p-1 p-0.5 rounded-lg w-full lg:w-3/4"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Friends & Family">Friends & Family</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-red-950 w-24 text-white py-1 px-2 font-semibold rounded-lg hover:bg-red-500 disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default AddressForm;
