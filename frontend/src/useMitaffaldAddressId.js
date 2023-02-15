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

async function load(url, abortController) {
    try {
        const res = await fetch(url, abortController);
        if (res.status !== 200) {
            throw new Error(`address lookup failed with HTTP status ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        return [text, null];
    } catch (e) {
        return [null, e.message || e];
    }
}

export function useMitaffaldAddressId(dawaAddress) {
    const [res, setRes] = useState([null, '']);
    useEffect(() => {
        if (dawaAddress) {
            const url = addressUrlFromDawa(dawaAddress);
            const abortController = new AbortController();
            setRes([null, '']);
            load(url, abortController).then(setRes);
            return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
        }
    }, [dawaAddress]);
    return res;
}
