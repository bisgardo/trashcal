import { useEffect, useState } from 'react';

function addressUrlFromDawa({ vejnavn, husnr, postnr, postnrnavn }) {
    const text = `${vejnavn}, ${postnr} ${postnrnavn}`;
    const url = new URL('http://localhost:5000/lookup_address_id');
    url.searchParams.append('house_number', husnr);
    url.searchParams.append('postcode', postnr);
    url.searchParams.append('street_address_text', text);
    return url;
}

export function useMitaffaldAddressId(dawaAddress) {
    const initState = { addressId: undefined, addressError: '' };
    const [state, setState] = useState(initState);
    useEffect(() => {
        if (dawaAddress) {
            const url = addressUrlFromDawa(dawaAddress.data);
            const abortController = new AbortController();
            setState(initState);
            fetch(url, abortController)
                .then((res) => res.text())
                .then((res) => setState({ addressId: res, addressError: '' }))
                .catch((e) => setState({ addressId: undefined, addressError: e.message }));
            return () => abortController.abort(); // not sure why, but returning raw function doesn't work
        }
    }, [dawaAddress]);
    return state;
}
