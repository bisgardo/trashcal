import { useEffect, useState } from 'react';
import { BACKEND_URL_BASE, MONTH_NAMES } from './config';

function parse(year, data) {
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

function buildCalendarData({ times, validFromTime }, year, isLeapYear, firstWeekdayIdx) {
    const types = Array.from(times.keys());

    let nextWeekdayIdx = firstWeekdayIdx;
    return Array.from(MONTH_NAMES, (_, monthIdx) =>
        Array.from({ length: daysInMonth(monthIdx, isLeapYear) }, (_, dayIdx) => {
            const time = Date.UTC(year, monthIdx, dayIdx + 1);
            return {
                dayIdx,
                weekdayIdx: nextWeekdayIdx++ % 7,
                matchedTypes: matchTypes(types, times, time),
                isValid: time >= validFromTime,
            };
        })
    );
}

async function load(url, abortController, year, isLeapYear, firstWeekdayIdx) {
    try {
        const res = await fetch(url, abortController);
        if (res.status !== 200) {
            throw new Error(`calendar data lookup failed with HTTP status ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        const fetchedData = parse(year, json);
        return [buildCalendarData(fetchedData, year, isLeapYear, firstWeekdayIdx), ''];
    } catch (e) {
        return [null, e.message || e];
    }
}

export function useFetchCalendarData(addressId, year, isLeapYear, firstWeekdayIdx) {
    const [res, setRes] = useState([null, '']);
    useEffect(() => {
        const url = new URL(`${BACKEND_URL_BASE}/trash_calendar/${addressId}`);
        url.searchParams.append('year', year);
        const abortController = new AbortController();
        setRes([null, '']);
        load(url, abortController, year, isLeapYear, firstWeekdayIdx).then(setRes);
        return () => abortController.abort(); // not sure why, but returning raw function (even when binding 'this') doesn't work
    }, [addressId, year, isLeapYear, firstWeekdayIdx]);
    return res;
}
