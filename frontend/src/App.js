import './dawa.scss';
import { useRef } from 'react';
import { useDawaAutocomplete } from './useDawaAutocomplete';
import { useMitaffaldAddressId } from './useMitaffaldAddressId';
import { AddressCalendar } from './AddressCalendar';

const YEAR = 2023;
const IS_LEAP_YEAR = false;
const FIRST_WEEKDAY_INDEX = 6; // Sunday

function showAddressInfoUrlFromMitaffaldId(mitaffaldId) {
    const url = new URL('https://mitaffald.affaldvarme.dk/Adresse/VisAdresseInfo');
    url.searchParams.append('address-selected-id', mitaffaldId);
    return url.toString();
}

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
                        Valgt adresse: {addressText} &middot; MitAffald ID:{' '}
                        {addressId ? (
                            <a target="_blank" rel="noreferrer" href={showAddressInfoUrlFromMitaffaldId(addressId)}>
                                {addressId}
                            </a>
                        ) : (
                            <i>Indlæser...</i>
                        )}
                    </>
                )}
            </p>
            <hr />
            {addressId && (
                <AddressCalendar
                    addressId={addressId}
                    year={YEAR}
                    isLeapYear={IS_LEAP_YEAR}
                    firstWeekdayIndex={FIRST_WEEKDAY_INDEX}
                />
            )}
            {addressError && <div>Address error: {addressError}</div>}
        </div>
    );
}
