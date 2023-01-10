import './dawa.scss';
import { useRef } from 'react';
import { useDawaAutocomplete } from './useDawaAutocomplete';
import { useMitaffaldAddressId } from './useMitaffaldAddressId';
import { Calendar } from './Calendar';

const YEAR = 2023;

export default function App() {
    const inputRef = useRef(null);
    const { selectedAddress } = useDawaAutocomplete(inputRef);
    const { addressId, addressError } = useMitaffaldAddressId(selectedAddress);

    const addressText = selectedAddress?.tekst;
    return (
        <div className="container mx-auto px-24 py-8">
            <div className="rounded-xl border p-3 mt-4 mb-6 bg-stone-200">
                <h1 className="text-xl">Trash Cal: Affaldskalender for Aarhus Kommune</h1>
            </div>
            <p className="relative w-full">
                <label htmlFor="input" className="text-lg">
                    Indtast adresse:
                </label>
                <input
                    type="search"
                    id="input"
                    className="w-full px-3 py-1.5 text-stone-700 border border-solid border-stone-300 rounded transition ease-in-out focus:border-stone-400 focus:outline-none"
                    ref={inputRef}
                />
            </p>
            <p>
                {addressText && (
                    <>
                        Valgt adresse: {addressText} &middot; MitAffald ID: {addressId ? addressId : <i>Indlæser...</i>}
                    </>
                )}
            </p>
            <hr />
            {addressId && <Calendar addressId={addressId} year={YEAR} />}
            {addressError && <div>Address error: {addressError}</div>}
        </div>
    );
}
