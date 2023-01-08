import './App.css';
import { useRef } from 'react';
import { useDawaAutocomplete } from './useDawaAutocomplete';
import { useMitaffaldAddressId } from './useMitaffaldAddressId';
import { Calendar } from './Calendar';

const YEAR = 2023;

function App() {
    const inputRef = useRef(null);
    const { selectedAddress } = useDawaAutocomplete(inputRef);
    const { addressId, addressError } = useMitaffaldAddressId(selectedAddress);

    const addressText = selectedAddress?.tekst;
    return (
        <div className="App">
            <p className="autocomplete-container">
                <label htmlFor="input">Autocomplete af adresse:</label>
                <input type="search" id="input" ref={inputRef} />
            </p>
            {addressText && <p>Valgt adresse: {addressText}</p>}
            {addressId && (
                <>
                    <p>MitAffald ID: {addressId}</p>
                    <Calendar addressId={addressId} year={YEAR} />
                </>
            )}
            {addressError && <div>Address error: {addressError}</div>}
        </div>
    );
}

export default App;
