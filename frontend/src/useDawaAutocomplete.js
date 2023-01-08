import { useEffect, useState } from 'react';
import { dawaAutocomplete } from 'dawa-autocomplete2';

const DAWA_KOMMUNEKODE_AARHUS = '0751';

export function useDawaAutocomplete(inputRef) {
    const [selectedAddress, setSelectedAddress] = useState();
    useEffect(() => {
        const res = dawaAutocomplete(inputRef.current, {
            params: { kommunekode: DAWA_KOMMUNEKODE_AARHUS },
            select: setSelectedAddress,
        });
        return res.destroy;
    }, [inputRef]);
    return { selectedAddress };
}
