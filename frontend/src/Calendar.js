import { useEffect, useState } from 'react';

export function Calendar({ addressId, year }) {
    const [data, setData] = useState();
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        const url = new URL(`http://localhost:5000/trash_calendar/${addressId}`);
        url.searchParams.append('year', year);

        const abortController = new AbortController();
        fetch(url, abortController)
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setFetchError('');
            })
            .catch((e) => {
                setData(undefined);
                setFetchError(e.message);
            });

        return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
    }, [addressId, year]);
    return (
        <>
            <pre>{data && JSON.stringify(data, null, 2)}</pre>
            {fetchError && <div>Fetch error: {fetchError}</div>}
        </>
    );
}
