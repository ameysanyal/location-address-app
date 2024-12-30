import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import LocationModal from './components/LocationModal';
import Map from './components/Map';
import AddressForm from './components/AddressForm';
import AddressList from './components/AddressList';

const active = "mr-2 text-sm  text-white p-1 sm:text-lg sm:p-1 bg-red-500 rounded-lg"

const inActive = "mr-2 text-sm  text-white p-1 sm:text-lg sm:p-1  hover:bg-red-500 focus:bg-red-500 active:bg-red-500 rounded-lg"
import { NavLink } from "react-router-dom"


const App = () => {

  const [addresses, setAddresses] = useState([]);

  // const location = useLocation();

  const handleAddAddress = (newAddress) => {
    // Example: Add the new address to the local list (or save to backend)
    setAddresses([...addresses, newAddress]);
    alert('Address saved successfully!');
  };

  return (
    <LocationProvider>
      <nav className="fixed flex w-full bg-red-950 justify-between p-2 z-50">
        <div className="flex items-center mx-2">
          <span className="text-xl text-white font-bold">OptoCloud</span>
        </div>
        <div>
          <NavLink to="/" className={({ isActive }) => isActive ? active : inActive}>
            Map
          </NavLink>
          <NavLink to="/add-address" className={({ isActive }) => isActive ? active : inActive}>
            Add Address
          </NavLink>
          <NavLink to="/manage-addresses" className={({ isActive }) => isActive ? active : inActive}>
            Manage Addresses
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        {/* Location Permission Modal */}
        <LocationModal />

        {/* Map Section */}
        {/* <section className="my-2">
          <h2 className="text-lg font-bold mb-2">Select Your Location</h2>
        </section> */}
      </main>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/add-address" element={<AddressForm onSubmit={handleAddAddress} />} />
        <Route path="/manage-addresses" element={<AddressList addresses={addresses} />} />
      </Routes>

    </LocationProvider>
  );
};

export default App;
{/* <AddressForm onSubmit={handleAddAddress} /> */ }
{/* <AddressList addresses={addresses} /> */ }



