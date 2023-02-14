import { useEffect, useState } from 'react';
import { BACKEND_URL_BASE } from './config';

function addressUrlFromDawa({ vejnavn, husnr, postnr, postnrnavn }) {
    const url = new URL(`${BACKEND_URL_BASE}/address`);
    url.searchParams.append('street_name', vejnavn);
    url.searchParams.append('house_number', husnr);
    url.searchParams.append('postcode', postnr);
    url.searchParams.append('postcode_name', postnrnavn);
    return url;
}

export function useMitaffaldAddressId(dawaAddress) {
    const [addressId, setAddressId] = useState(null);
    const [addressError, setAddressError] = useState('');
    useEffect(() => {
        if (dawaAddress) {
            const url = addressUrlFromDawa(dawaAddress);
            const abortController = new AbortController();
            setAddressId(null);
            setAddressError('');
            fetch(url, abortController)
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error(`address lookup failed with HTTP status ${res.status} ${res.statusText}`);
                    }
                    return res.text();
                })
                .then((res) => {
                    setAddressId(res);
                    setAddressError('');
                })
                .catch((e) => {
                    setAddressId(null);
                    setAddressError(e.message || e);
                });
            return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
        }
    }, [dawaAddress]);
    return { addressId, addressError };
}
