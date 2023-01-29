import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';

function transformData(year, data) {
    const dates = data['dates'];
    const validFrom = data['valid_from'];

    try {
        return {
            times: new Map(
                Object.entries(dates).map(([type, dates]) => [
                    type,
                    new Set(dates.map((monthDay) => Date.parse(`${year}-${monthDay}`))),
                ])
            ),
            validFromTime: Date.parse(`${year}-${validFrom}`),
        };
    } catch {
        console.error('invalid data:', dates);
        throw new Error('invalid data (logged to console)');
    }
}

export function AddressCalendar({ addressId, year, isLeapYear, firstWeekdayIndex }) {
    const [data, setData] = useState(undefined);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        const url = new URL(`http://localhost:5000/trash_calendar/${addressId}`);
        url.searchParams.append('year', year);

        const abortController = new AbortController();
        fetch(url, abortController)
            .then((res) => res.json())
            .then((res) => {
                setData(transformData(year, res));
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
            {data && <Calendar data={data} year={year} isLeapYear={isLeapYear} firstWeekdayIndex={firstWeekdayIndex} />}
            {fetchError && <div>Fetch error: {fetchError}</div>}
        </>
    );
}
