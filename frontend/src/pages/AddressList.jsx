import { useEffect, useContext } from "react";
import { LocationContext } from "../context/LocationContext";

const AddressList = () => {
    const { addresses, setAddresses } = useContext(LocationContext);

    useEffect(() => {
        fetch("/api/address/:userId")
            .then((res) => res.json())
            .then(setAddresses);
    }, []);

    return (
        <ul>
            {addresses.map((addr) => (
                <li key={addr._id}>{addr.houseNo}, {addr.area}</li>
            ))}
        </ul>
    );
};

export default AddressList;

// Explanation
// LocationModal Component:

// Displays the popup modal requesting location permissions or enabling manual search.
// Closes when onClose is triggered.
// Map Component:

// Displays the Google Map where the user can adjust their pin to fine - tune their location.
// AddressForm Component:

// Accepts user input for house number, street, and category.
// Passes the data to the parent via the onSubmit function.
// AddressList Component:

// Lists all saved addresses.
// For this example, it uses a local addresses state.You can modify this to fetch data from the backend.
