/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');

    return (
        <LocationContext.Provider value={{ location, setLocation, addresses, setAddresses, address, setAddress }}>
            {children}
        </LocationContext.Provider>
    );
};
