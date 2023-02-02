import { useEffect, useState } from 'react';

function addressUrlFromDawa({ vejnavn, husnr, postnr, postnrnavn }) {
    const url = new URL('http://localhost:5000/lookup_address_id');
    url.searchParams.append('street_name', vejnavn);
    url.searchParams.append('house_number', husnr);
    url.searchParams.append('postcode', postnr);
    url.searchParams.append('postcode_name', postnrnavn);
    return url;
}

const INIT_STATE = { addressId: null, addressError: '' };

export function useMitaffaldAddressId(dawaAddress) {
    const [state, setState] = useState(INIT_STATE);
    useEffect(() => {
        if (dawaAddress) {
            const url = addressUrlFromDawa(dawaAddress.data);
            const abortController = new AbortController();
            setState(INIT_STATE);
            fetch(url, abortController)
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error(`address lookup failed with HTTP status ${res.status} ${res.statusText}`);
                    }
                    return res.text();
                })
                .then((res) => setState({ addressId: res, addressError: '' }))
                .catch((e) => setState({ addressId: null, addressError: e.message }));
            return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
        }
    }, [dawaAddress]);
    return state;
}
