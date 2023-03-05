import './dawa.scss';
import { useEffect, useState } from 'react';
import { dawaAutocomplete } from 'dawa-autocomplete2';
import { useNavigate, useParams } from 'react-router-dom';
import {DAWA_KOMMUNEKODE, DAWA_URL_QUERY_ADDRESS} from './config';

export function useDawaAutocomplete(inputRef) {
    const [selectedAddress, setSelectedAddress] = useState(); // TODO Use 'useEffect' to refresh on change..?
    const { address } = useParams(); // fetch 'address' URL parameter
    useEffect(() => {
        if (address) {
            const url = new URL(DAWA_URL_QUERY_ADDRESS);
            url.searchParams.append('q', address);
            const abortController = new AbortController();
            fetch(url, abortController)
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error(`address lookup failed with HTTP status ${res.status} ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((res) => {
                    if (res.length < 1) {
                        throw new Error('no matching address found');
                    }
                    return res[0].adgangsadresse;
                })
                .then(({ vejstykke, husnr, postnummer, adressebetegnelse }) =>
                    setSelectedAddress({
                        vejnavn: vejstykke.navn,
                        husnr,
                        postnr: postnummer.nr,
                        postnrnavn: postnummer.navn,
                        tekst: adressebetegnelse,
                    })
                )
                .catch(console.error);
            return () => abortController.abort();
        }
    }, [address]);

    const navigate = useNavigate();
    useEffect(() => {
        const res = dawaAutocomplete(inputRef.current, {
            params: { kommunekode: DAWA_KOMMUNEKODE },
            select: (r) => {
                // HACK to prevent DAWA from screwing up in a minor way,
                //      where it adds a comma and leaves the cursor to input another
                //      address component.
                //      This wasn't a problem before we started to use React Router,
                //      but it seems like putting the call in a timeout solves it...
                setTimeout(() => navigate(`/${r.tekst}`));
            },
        });
        return res.destroy;
    }, [inputRef, navigate]);
    return { selectedAddress };
}
