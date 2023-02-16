import { useRef } from 'react';
import { useDawaAutocomplete } from './useDawaAutocomplete';
import { useMitaffaldAddressId } from './useMitaffaldAddressId';
import { AddressCalendar } from './AddressCalendar';
import { YEAR_FIRST_WEEKDAY_IDX, YEAR_IS_LEAP_YEAR, YEAR, MITAFFALD_URL_VIEW_ADDRESS } from './config';

function showAddressInfoUrl(mitaffaldId) {
    const url = new URL(MITAFFALD_URL_VIEW_ADDRESS);
    url.searchParams.append('address-selected-id', mitaffaldId);
    return url.toString();
}

export default function App() {
    const inputRef = useRef(null);
    const { selectedAddress } = useDawaAutocomplete(inputRef);
    const [addressId, addressError] = useMitaffaldAddressId(selectedAddress);
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
                {selectedAddress && (
                    <>
                        Valgt adresse: {selectedAddress.tekst} &middot; MitAffald ID:&nbsp;
                        {addressId ? (
                            <a target="_blank" rel="noreferrer" href={showAddressInfoUrl(addressId)}>
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
                    isLeapYear={YEAR_IS_LEAP_YEAR}
                    firstWeekdayIdx={YEAR_FIRST_WEEKDAY_IDX}
                />
            )}
            {addressError && <div>Address error: {addressError}</div>}
        </div>
    );
}
