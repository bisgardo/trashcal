import { useEffect, useMemo, useState } from 'react';
import { Calendar } from './Calendar';

// TODO Make configurable.
const BACKEND_BASE_URL = 'http://localhost:5000';

function transformData(year, data) {
    const dates = data['dates'];
    const validFrom = data['valid_from_date'];

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

function daysInMonth(monthIdx, isLeapYear) {
    switch (monthIdx) {
        case 0:
            return 31;
        case 1:
            return isLeapYear ? 29 : 28;
        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
        default:
            throw new Error('invalid month index');
    }
}

function matchTypes(types, times, time) {
    // Note that printing 'times' here prunes the value to 32 bits in Firefox.
    // But not if you throw an exception right afterwards!
    // (Try to make minimal example of this.)
    return types.filter((t) => times.get(t).has(time));
}

function* genWeekdayIdxs(init) {
    for (let res = init; true; res++) {
        yield res % 7;
    }
}

// TODO Extract into file.
function useCalendarData(addressId, year, firstWeekdayIndex, isLeapYear) {
    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        const url = new URL(`${BACKEND_BASE_URL}/trash_calendar/${addressId}`);
        url.searchParams.append('year', year);

        const abortController = new AbortController();
        fetch(url, abortController)
            .then((res) => res.json())
            .then((res) => {
                setData(transformData(year, res));
                setFetchError('');
            })
            .catch((e) => {
                setData(null);
                setFetchError(e.message);
            });

        return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
    }, [addressId, year]);
    const monthsData = useMemo(() => {
        if (!data) {
            return null;
        }
        const { times, validFromTime } = data;
        const types = Array.from(times.keys());

        // TODO Just use local var instead?
        const weekdayIdxs = genWeekdayIdxs(firstWeekdayIndex);
        return Array.from({ length: 12 }, (_, monthIdx) =>
            Array.from({ length: daysInMonth(monthIdx, isLeapYear) }, (_, dayIdx) => {
                const time = Date.UTC(year, monthIdx, dayIdx + 1);
                return {
                    dayIdx,
                    weekdayIdx: weekdayIdxs.next().value,
                    matchedTypes: matchTypes(types, times, time),
                    isValid: time >= validFromTime,
                };
            })
        );
    }, [data, year, isLeapYear, firstWeekdayIndex]);
    return { monthsData, fetchError };
}

export function AddressCalendar({ addressId, year, isLeapYear, firstWeekdayIndex }) {
    const { monthsData, fetchError } = useCalendarData(addressId, year, firstWeekdayIndex, isLeapYear);
    return (
        <>
            {monthsData && <Calendar data={monthsData} />}
            {fetchError && <div>Fetch error: {fetchError}</div>}
        </>
    );
}
